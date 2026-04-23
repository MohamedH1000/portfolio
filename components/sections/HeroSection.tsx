"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerate } from "@/components/ui/text-generate";
import { MagicButton } from "@/components/ui/magic-button";
import { FaLocationArrow } from "react-icons/fa6";
import { Link } from "@/i18n/navigation";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="#CBACF9" />
      </div>

      <div className="absolute inset-0 bg-blueprint" />
      <div className="absolute inset-0 bg-background/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-10 max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="uppercase tracking-widest text-xs text-muted-foreground mb-4"
        >
          {t("subtitle")}
        </motion.p>

        <TextGenerate words={t("title")} className="text-[40px] md:text-5xl lg:text-6xl font-bold leading-tight" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center md:tracking-wider mb-8 text-sm md:text-lg text-muted-foreground max-w-xl"
        >
          {t("description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link href={{ pathname: "/projects" }}>
            <MagicButton
              title={t("cta")}
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
