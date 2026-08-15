"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { flipInUp } from "@/lib/motion";

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
      {/* The spine ramps to transparent at both ends rather than stopping cleanly */}
      <div className="rule-fade-y absolute start-0 top-0 bottom-0" />

      <div className="space-y-8">
        {experiences.map((exp, i) => (
          <motion.div key={i} {...flipInUp(i * 0.1, !!reduce)} className="relative ps-10">
            <span className="absolute start-0 top-1.5 -translate-x-[7px] rtl:translate-x-[7px]">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-brand/40 motion-safe:animate-[pulse-ring_2.8s_ease-out_infinite]"
              />
              <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-brand bg-background shadow-[var(--shadow-brand)]" />
            </span>

            <div className="surface-card border-gradient card-hover rounded-2xl p-5 hover:border-brand/25">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="text-lg font-medium">
                  {isAr ? exp.role_ar : exp.role_en}
                </h3>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(exp.start_date).toLocaleDateString(isAr ? "ar-EG" : "en-US", { month: "short", year: "numeric" })} —{" "}
                  {exp.end_date
                    ? new Date(exp.end_date).toLocaleDateString(isAr ? "ar-EG" : "en-US", { month: "short", year: "numeric" })
                    : t("present")}
                </span>
              </div>
              <p className="text-gradient-brand text-sm font-medium mb-2">{exp.company}</p>
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
