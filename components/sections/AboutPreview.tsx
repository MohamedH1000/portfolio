"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Code2, CloudCog, Brain, Workflow } from "lucide-react";
import { useStagger, useFadeUpItem } from "@/lib/motion";
import { StatCounter } from "@/components/ui/stat-counter";

const highlights = [
  { icon: Code2, key: "fullStackTitle" },
  { icon: CloudCog, key: "devOpsTitle" },
  { icon: Brain, key: "aiTitle" },
  { icon: Workflow, key: "automationTitle" },
];

const stats = [
  { value: "statsYearsValue", label: "statsYears" },
  { value: "statsProjectsValue", label: "statsProjects" },
  { value: "statsTechnologiesValue", label: "statsTechnologies" },
  { value: "statsSatisfiedValue", label: "statsSatisfied" },
];

export function AboutPreview() {
  const t = useTranslations("about");
  const tc = useTranslations("common");
  const stagger = useStagger(0.1);
  const item = useFadeUpItem();

  return (
    <section className="section-y">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.h2 variants={item} className="section-heading mb-5">
          <span className="text-gradient-brand">{t("previewTitle")}</span>
        </motion.h2>

        <motion.p
          variants={item}
          className="mx-auto mb-8 max-w-2xl leading-relaxed text-muted-foreground"
        >
          {t("intro")}
        </motion.p>

        <motion.div variants={item} className="mb-9 flex flex-wrap justify-center gap-2.5">
          {highlights.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="group flex items-center gap-2 rounded-lg border border-[var(--divider)] bg-surface-low/80 px-3.5 py-1.5 text-sm text-muted-foreground transition-all duration-300 ease-[var(--ease-quart)] hover:-translate-y-1 hover:border-brand/40 hover:bg-brand/[0.07] hover:text-foreground"
            >
              <Icon className="h-4 w-4 text-brand transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-110" />
              {t(key)}
            </div>
          ))}
        </motion.div>

        <div className="rule-fade mb-9" />

        {/* Figures count up the first time they scroll into view */}
        <motion.div
          variants={item}
          className="mb-9 grid grid-cols-2 gap-5 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <StatCounter
                value={t(stat.value)}
                className="block text-2xl font-medium text-gradient-brand md:text-3xl"
              />
              <p className="mt-1 text-xs text-muted-foreground">{t(stat.label)}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} whileHover={{ x: 4 }} className="inline-block">
          <Link
            href={{ pathname: "/about" }}
            className="focus-ring group inline-flex items-center gap-2 rounded-md font-medium text-brand transition-colors hover:text-brand-strong"
          >
            {tc("readMore")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
