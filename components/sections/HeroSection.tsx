"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { MagicButton } from "@/components/ui/magic-button";
import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTilt3D } from "@/lib/motion";

/** Proper nouns, not UI copy — the same in every locale. */
const STACK = ["Next.js", "TypeScript", "Node.js", "Docker", "PostgreSQL", "AWS"];

export function HeroSection() {
  const t = useTranslations("hero");
  const roles = t("roles").split("|");
  const [roleIndex, setRoleIndex] = useState(0);
  const reduce = useReducedMotion();

  // The pointer is tracked across the whole hero, so the panel stack leans
  // toward the cursor wherever it is rather than only over the panels.
  const heroRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt3D(heroRef, { max: 12, perspective: 1200 });

  useEffect(() => {
    if (reduce) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      interval = setInterval(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, 3000);
    };
    const stop = () => {
      if (interval) clearInterval(interval);
      interval = null;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [roles.length, reduce]);

  return (
    // `full-bleed` escapes PageWrapper's max-width container and `-mt-24`
    // cancels its top padding, so the aurora, spotlight and scrim span the
    // viewport instead of being clipped to the content column.
    <div
      ref={heroRef}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="full-bleed relative -mt-24 flex min-h-screen items-center overflow-hidden"
    >
      {/* PageWrapper already paints the blueprint grid across `main`; a second
          copy here would just double its contrast. */}

      {/* Aurora glow orbs — layered depth across the whole hero, not just the center */}
      <motion.div
        className="absolute -top-24 -left-24 h-[34rem] w-[34rem] rounded-full bg-brand/20 blur-[110px]"
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-brand-500/15 blur-[110px]"
        animate={reduce ? undefined : { x: [0, -36, 0], y: [0, 32, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/3 h-[28rem] w-[28rem] rounded-full bg-brand-700/20 blur-[100px]"
        animate={reduce ? undefined : { x: [0, 24, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0">
        <Spotlight className="-top-40 -left-10 h-screen md:-top-20 md:-left-32" fill="var(--spotlight-primary)" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="var(--spotlight-secondary)" />
      </div>

      {/* Legibility scrim — concentrated behind the text, fading out toward the edges so the glow stays visible */}
      <div className="absolute inset-0 bg-background/60 [mask-image:radial-gradient(ellipse_65%_55%_at_35%_50%,black,transparent)]" />

      {/* Smooth handoff into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />

      {/* Asymmetric split: copy hugs the leading edge, the depth stack sits
          opposite it with the whitespace between them. */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="flex flex-col items-start text-start">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm tracking-wide text-muted-foreground md:text-base"
          >
            {t("greeting")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-5 text-4xl leading-tight font-medium md:text-6xl lg:text-7xl"
          >
            <span className="text-gradient-brand">{t("name")}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6 rounded-lg border border-brand/25 bg-brand/[0.06] px-4 py-1.5"
          >
            {/* Every role is stacked in one grid cell: the pill sizes itself to
                the longest of them, so it never resizes as they change, and the
                outgoing and incoming roles cross-fade rather than leaving the
                pill briefly empty the way `AnimatePresence mode="wait"` did. */}
            <span className="grid">
              {roles.map((role, i) => (
                <motion.span
                  key={role}
                  aria-hidden={i !== roleIndex}
                  className="[grid-area:1/1] text-xs font-medium tracking-[0.2em] text-brand uppercase md:text-sm"
                  initial={false}
                  animate={
                    i === roleIndex
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: -6, filter: "blur(4px)" }
                  }
                  transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {role}
                </motion.span>
              ))}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-4 text-lg font-medium text-foreground md:text-xl"
          >
            {t("title")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-9 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Link href={{ pathname: "/projects" }}>
              <MagicButton
                title={t("cta")}
                icon={<ArrowUpRight className="h-4 w-4" />}
                position="right"
              />
            </Link>
            <Link href={{ pathname: "/contact" }}>
              <MagicButton
                title={t("ctaSecondary")}
                icon={<Mail className="h-4 w-4" />}
                position="left"
                variant="ghost"
              />
            </Link>
          </motion.div>
        </div>

        {/* ===== Depth stack =====
            Three panels at different translateZ depths inside one
            preserve-3d group, leaning toward the pointer. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="scene-3d relative mx-auto hidden h-[24rem] w-full max-w-md sm:block lg:h-[28rem]"
          aria-hidden="true"
        >
          <motion.div
            style={tilt.style}
            className="layer-3d relative h-full w-full"
          >
            {/* Back plate — the deepest layer, a grid panel that catches the glow */}
            <div className="absolute inset-x-6 inset-y-10 [transform:translateZ(-70px)]">
              <div className="bg-blueprint bg-blueprint-fade h-full w-full rounded-2xl border border-[var(--hairline)] bg-surface-low/40" />
            </div>

            {/* Mid plate — the stack list, sitting at the group's own depth */}
            <div className="absolute inset-x-0 top-8 [transform:translateZ(10px)]">
              <div className="glass-panel rounded-2xl p-5">
                <p className="mb-4 text-[10px] tracking-[0.18em] text-brand uppercase">
                  {t("panelKicker")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {STACK.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.07 }}
                      className="rounded-md border border-[var(--divider)] bg-surface-high/60 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
                <div className="rule-fade my-4" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t("panelUptime")}</span>
                  <span className="text-brand">99.9%</span>
                </div>
              </div>
            </div>

            {/* Front plate — nearest the viewer, so it travels furthest on
                tilt. The depth lives on a plain wrapper: Framer writes its own
                inline `transform`, which would otherwise drop the translateZ. */}
            <div className="absolute end-2 bottom-6 [transform:translateZ(80px)]">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.05 }}
                className="glass-panel flex items-center gap-2.5 rounded-xl px-4 py-3"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand/60 motion-safe:animate-[pulse-ring_2.8s_ease-out_infinite]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                <span className="text-xs font-medium text-foreground">
                  {t("panelStatus")}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
