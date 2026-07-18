import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/app/actions/projects";
import { projects as fallbackProjects } from "@/data/temp";
import { createServerClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProjectDetailContent } from "@/components/sections/ProjectDetailContent";

const isDev = process.env.NODE_ENV === "development";

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  if (isDev) return fallbackProjects.map((p) => ({ slug: p.slug }));

  const env = getPublicEnv();
  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });

  const { data } = await supabase.from("projects").select("slug").order("sort_order", { ascending: true });
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectDetail project={project} locale={locale} />;
}

function ProjectDetail({ project, locale }: { project: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>; locale: string }) {
  const t = useTranslations("projects");
  const isAr = locale === "ar";
  const title = isAr ? project.title_ar : project.title_en;
  const description = isAr ? project.description_ar : project.description_en;

  return (
    <PageWrapper>
      <article className="py-20 max-w-4xl mx-auto">
        <ProjectDetailContent
          title={title}
          description={description}
          imageUrl={project.image_url || "/grid.svg"}
          techStack={project.tech_stack}
          liveUrl={project.live_url}
          githubUrl={project.github_url}
          backLabel={t("backToProjects")}
          liveDemoLabel={t("liveDemo")}
          sourceCodeLabel={t("sourceCode")}
        />
      </article>
    </PageWrapper>
  );
}
