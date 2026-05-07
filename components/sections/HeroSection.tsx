"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { MagicButton } from "@/components/ui/magic-button";
import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function HeroSection() {
  const t = useTranslations("hero");
  const roles = t("roles").split("|");
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="#CBACF9" />
      </div>

      <div className="absolute inset-0 bg-blueprint" />
      <div className="absolute inset-0 bg-background/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

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
          <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">
            {t("name")}
          </span>
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
              className="bg-transparent border border-brand/30 text-brand hover:bg-brand/10 hover:shadow-none dark:from-transparent dark:to-transparent dark:text-brand"
            />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
