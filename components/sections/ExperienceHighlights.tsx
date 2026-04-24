import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { MagicButton } from "@/components/ui/magic-button";
import { ArrowUpRight } from "lucide-react";

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
    <section className="py-20">
      <SectionHeading
        text={t("title", { highlight: t("titleHighlight") })}
        highlight={t("titleHighlight")}
      />

      <div className="mt-16 max-w-3xl mx-auto space-y-6">
        {experiences.slice(0, 3).map((exp, i) => (
          <div
            key={i}
            className="relative bg-surface-low rounded-xl p-6 group hover:bg-surface transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {isAr ? exp.role_ar : exp.role_en}
                </h3>
                <p className="text-sm text-brand">{exp.company}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(exp.start_date).getFullYear()} —{" "}
                {exp.end_date ? new Date(exp.end_date).getFullYear() : t("present")}
              </p>
            </div>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              {isAr ? exp.description_ar : exp.description_en}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link href={{ pathname: "/experience" }}>
          <MagicButton title={t("viewAll")} icon={<ArrowUpRight />} position="right" />
        </Link>
      </div>
    </section>
  );
}
