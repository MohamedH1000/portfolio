"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { MagicButton } from "@/components/ui/magic-button";
import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function HeroSection() {
  const t = useTranslations("hero");
  const roles = t("roles").split("|");
  const [roleIndex, setRoleIndex] = useState(0);
  const reduce = useReducedMotion();

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Base texture */}
      <div className="absolute inset-0 bg-blueprint" />

      {/* Aurora glow orbs — layered depth across the whole hero, not just the center */}
      <motion.div
        className="absolute -top-24 -left-24 w-[34rem] h-[34rem] bg-brand/25 rounded-full blur-[110px]"
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-purple-400/20 rounded-full blur-[110px]"
        animate={reduce ? undefined : { x: [0, -36, 0], y: [0, 32, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] bg-purple-600/15 rounded-full blur-[100px]"
        animate={reduce ? undefined : { x: [0, 24, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0">
        <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="var(--spotlight-primary)" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="var(--spotlight-secondary)" />
      </div>

      {/* Legibility scrim — concentrated behind the text, fading out toward the edges so the glow stays visible */}
      <div className="absolute inset-0 bg-background/60 [mask-image:radial-gradient(ellipse_55%_45%_at_center,black,transparent)]" />

      {/* Smooth handoff into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />

      <div className="relative z-10 max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm md:text-base text-muted-foreground mb-4 tracking-wide"
        >
          {t("greeting")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
        >
          <span className="text-gradient-brand">{t("name")}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6 px-5 py-2 rounded-full border border-brand/20 bg-brand/5"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="uppercase tracking-[0.2em] text-xs md:text-sm font-medium text-brand"
            >
              {roles[roleIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl font-semibold text-foreground mb-4"
        >
          {t("title")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mb-10"
        >
          {t("description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href={{ pathname: "/projects" }}>
            <MagicButton
              title={t("cta")}
              icon={<ArrowUpRight />}
              position="right"
            />
          </Link>
          <Link href={{ pathname: "/contact" }}>
            <MagicButton
              title={t("ctaSecondary")}
              icon={<Mail />}
              position="left"
              variant="ghost"
            />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
