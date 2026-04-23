import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getProjectBySlug, getProjects } from "@/app/actions/projects";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TechTag } from "@/components/ui/tech-tag";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
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
        <Link
          href={{ pathname: "/projects" }}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t("backToProjects")}
        </Link>

        <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-low mb-8">
          <Image
            src={project.image_url || "/grid.svg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack.map((tech) => (
            <TechTag key={tech} name={tech} />
          ))}
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed mb-8">{description}</p>

        <div className="flex flex-wrap gap-4">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-primary-foreground font-medium hover:bg-brand/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {t("liveDemo")}
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-high text-foreground font-medium hover:bg-surface-bright transition-colors"
            >
              {t("sourceCode")}
            </a>
          )}
        </div>
      </article>
    </PageWrapper>
  );
}
