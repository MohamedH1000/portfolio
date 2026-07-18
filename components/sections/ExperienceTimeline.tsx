"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface Experience {
  role_en: string;
  role_ar: string;
  company: string;
  description_en: string;
  description_ar: string;
  start_date: string;
  end_date: string | null;
}

interface ExperienceTimelineProps {
  experiences: Experience[];
  locale: string;
}

export function ExperienceTimeline({ experiences, locale }: ExperienceTimelineProps) {
  const t = useTranslations("experience");
  const isAr = locale === "ar";
  const reduce = useReducedMotion();

  return (
    <div className="mt-16 relative">
      <div className="absolute start-0 top-0 bottom-0 w-px bg-gradient-to-b from-brand/50 via-brand/20 to-transparent" />

      <div className="space-y-10">
        {experiences.map((exp, i) => (
          <motion.div key={i} {...fadeInUp(i * 0.1, !!reduce)} className="relative ps-10">
            <div className="absolute start-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-brand bg-background -translate-x-[7px]" />

            <div className="rounded-2xl p-6 bg-surface-low border border-transparent hover:border-brand/15 transition-all duration-300 card-hover">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="text-lg font-semibold">
                  {isAr ? exp.role_ar : exp.role_en}
                </h3>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(exp.start_date).toLocaleDateString(isAr ? "ar-EG" : "en-US", { month: "short", year: "numeric" })} —{" "}
                  {exp.end_date
                    ? new Date(exp.end_date).toLocaleDateString(isAr ? "ar-EG" : "en-US", { month: "short", year: "numeric" })
                    : t("present")}
                </span>
              </div>
              <p className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent text-sm font-medium mb-2">{exp.company}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {isAr ? exp.description_ar : exp.description_en}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
