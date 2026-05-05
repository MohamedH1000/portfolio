import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageWrapper } from "@/components/layout/PageWrapper";

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
    { title: t("phase1Title"), desc: t("phase1Description"), num: "01", icon: "💡" },
    { title: t("phase2Title"), desc: t("phase2Description"), num: "02", icon: "⚡" },
    { title: t("phase3Title"), desc: t("phase3Description"), num: "03", icon: "🚀" },
  ];

  return (
    <PageWrapper>
      <section className="py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-3 space-y-6">
              <h1 className="section-heading">
                {isAr ? (
                  <>عن <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">Mohamed</span></>
                ) : (
                  <>About <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">Me</span></>
                )}
              </h1>
              <p className="text-muted-foreground leading-relaxed text-lg">{t("bio")}</p>
              <p className="text-muted-foreground leading-relaxed">{t("bioExtended")}</p>
            </div>

            <div className="md:col-span-2">
              <div className="rounded-2xl p-6 space-y-4 bg-surface-low border border-brand/10">
                <h2 className="text-lg font-semibold">{t("skills")}</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-xs font-medium bg-brand/10 text-brand border border-brand/15">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-center mb-16">
            <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">{t("approach")}</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <div key={phase.num} className="rounded-2xl p-6 space-y-4 bg-surface-low border border-transparent hover:border-brand/15 transition-all duration-300 group card-hover">
                <span className="text-4xl">{phase.icon}</span>
                <span className="text-xs font-bold text-brand/40 tracking-widest">{phase.num}</span>
                <h3 className="text-lg font-semibold group-hover:text-brand transition-colors duration-300">{phase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
