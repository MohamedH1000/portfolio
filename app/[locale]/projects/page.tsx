import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { getProjects } from "@/app/actions/projects";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getProjects();

  return <ProjectsContent projects={projects} locale={locale} />;
}

function ProjectsContent({ projects, locale }: { projects: Awaited<ReturnType<typeof getProjects>>; locale: string }) {
  const t = useTranslations("projects");

  return (
    <PageWrapper>
      <section className="py-20">
        <SectionHeading
          text={t("title", { highlight: t("titleHighlight") })}
          highlight={t("titleHighlight")}
        />
        <div className="mt-16">
          <ProjectsGrid projects={projects} locale={locale} />
        </div>
      </section>
    </PageWrapper>
  );
}
