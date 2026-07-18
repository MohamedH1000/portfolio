import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { getExperiences } from "@/app/actions/experiences";

export const revalidate = 3600;

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const experiences = await getExperiences();

  return <ExperienceContent experiences={experiences} locale={locale} />;
}

function ExperienceContent({ experiences, locale }: { experiences: Awaited<ReturnType<typeof getExperiences>>; locale: string }) {
  const t = useTranslations("experience");

  return (
    <PageWrapper>
      <section className="py-24 max-w-3xl mx-auto">
        <SectionHeading
          text={t("title", { highlight: t("titleHighlight") })}
          highlight={t("titleHighlight")}
        />

        <ExperienceTimeline experiences={experiences} locale={locale} />
      </section>
    </PageWrapper>
  );
}
