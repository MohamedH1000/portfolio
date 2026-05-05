"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { MagicButton } from "@/components/ui/magic-button";
import { ArrowUpRight, Calendar } from "lucide-react";

interface Experience {
  role_en: string;
  role_ar: string;
  company: string;
  description_en: string;
  description_ar: string;
  start_date: string;
  end_date: string | null;
}

interface ExperienceHighlightsProps {
  experiences: Experience[];
  locale: string;
}

export function ExperienceHighlights({ experiences, locale }: ExperienceHighlightsProps) {
  const t = useTranslations("experience");
  const isAr = locale === "ar";

  return (
    <section className="py-24">
      <SectionHeading
        text={t("title", { highlight: t("titleHighlight") })}
        highlight={t("titleHighlight")}
      />

      <div className="mt-16 max-w-3xl mx-auto space-y-6">
        {experiences.slice(0, 3).map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative rounded-2xl p-6 border border-transparent hover:border-brand/15 bg-surface-low transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-brand transition-colors duration-300">
                  {isAr ? exp.role_ar : exp.role_en}
                </h3>
                <p className="text-sm text-brand/80 mt-0.5">{exp.company}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(exp.start_date).getFullYear()} —{" "}
                {exp.end_date ? new Date(exp.end_date).getFullYear() : t("present")}
              </div>
            </div>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              {isAr ? exp.description_ar : exp.description_en}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link href={{ pathname: "/experience" }}>
          <MagicButton title={t("viewAll")} icon={<ArrowUpRight />} position="right" />
        </Link>
      </div>
    </section>
  );
}
