import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent locale={locale} />;
}

function AboutContent({ locale }: { locale: string }) {
  const t = useTranslations("about");
  const isAr = locale === "ar";

  const skills = [
    "React", "Next.js", "TypeScript", "JavaScript",
    "Tailwind CSS", "Node.js", "MongoDB", "PostgreSQL",
    "Prisma", "Supabase", "Redux", "Framer Motion",
    "Git", "Docker", "REST APIs", "GraphQL",
  ];

  const phases = [
    { title: t("phase1Title"), desc: t("phase1Description"), num: "01" },
    { title: t("phase2Title"), desc: t("phase2Description"), num: "02" },
    { title: t("phase3Title"), desc: t("phase3Description"), num: "03" },
  ];

  return (
    <PageWrapper>
      <section className="py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-3 space-y-6">
              <h1 className="section-heading">
                {isAr ? (
                  <>عن <span className="text-brand">Mohamed</span></>
                ) : (
                  <>About <span className="text-brand">Me</span></>
                )}
              </h1>
              <p className="text-muted-foreground leading-relaxed">{t("bio")}</p>
              <p className="text-muted-foreground leading-relaxed">{t("bioExtended")}</p>
            </div>

            <div className="md:col-span-2">
              <div className="bg-surface-low rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold">{t("skills")}</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full text-xs bg-surface-high text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-center mb-16">
            <span className="text-brand">{t("approach")}</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <div key={phase.num} className="bg-surface-low rounded-xl p-6 space-y-3">
                <span className="text-3xl font-bold text-brand/30">{phase.num}</span>
                <h3 className="text-lg font-semibold">{phase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
