import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExperienceContent locale={locale} />;
}

function ExperienceContent({ locale }: { locale: string }) {
  const t = useTranslations("experience");
  const isAr = locale === "ar";

  const experiences = [
    {
      role_en: "Frontend Engineer Intern", role_ar: "مهندس واجهات أمامية متدرب",
      company: "Tech Corp",
      description_en: "Assisted in the development of a web-based platform using React.js, enhancing interactivity and user experience.",
      description_ar: "ساعدت في تطوير منصة ويب باستخدام React.js، معززاً التفاعلية وتجربة المستخدم.",
      start_date: "2023-06-01", end_date: "2023-09-01",
    },
    {
      role_en: "Mobile App Developer", role_ar: "مطور تطبيقات الهاتف",
      company: "JSM Tech",
      description_en: "Designed and developed mobile apps for both iOS and Android platforms using React Native.",
      description_ar: "صممت وطورت تطبيقات الهاتف لمنصتي iOS و Android باستخدام React Native.",
      start_date: "2023-09-01", end_date: "2024-01-01",
    },
    {
      role_en: "Freelance Developer", role_ar: "مطور مستقل",
      company: "Self-employed",
      description_en: "Led the development of a mobile app for a client, from initial concept to deployment on app stores.",
      description_ar: "قُدت تطوير تطبيق هاتف لعميل، من المفهوم الأولي إلى النشر في متاجر التطبيقات.",
      start_date: "2024-01-01", end_date: "2024-06-01",
    },
    {
      role_en: "Lead Frontend Developer", role_ar: "مطور واجهات أمامية رئيسي",
      company: "WebFlow Agency",
      description_en: "Developed and maintained user-facing features using modern frontend technologies. Led a team of 3 developers.",
      description_ar: "طورت وصيانت الميزات الموجهة للمستخدم باستخدام تقنيات الواجهة الأمامية الحديثة. قُدت فريقاً من 3 مطورين.",
      start_date: "2024-06-01", end_date: null,
    },
  ];

  return (
    <PageWrapper>
      <section className="py-20 max-w-3xl mx-auto">
        <SectionHeading
          text={t("title", { highlight: t("titleHighlight") })}
          highlight={t("titleHighlight")}
        />

        <div className="mt-16 relative">
          <div className="absolute start-0 top-0 bottom-0 w-px bg-surface-high" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <div key={i} className="relative ps-8">
                <div className="absolute start-0 top-1 w-3 h-3 rounded-full bg-brand -translate-x-[5px]" />

                <div className="bg-surface-low rounded-xl p-6 hover:bg-surface transition-colors">
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
                  <p className="text-brand text-sm mb-2">{exp.company}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {isAr ? exp.description_ar : exp.description_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
