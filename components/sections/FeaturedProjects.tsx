"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/ui/project-card";
import { fadeInUp } from "@/lib/motion";

interface Project {
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  featured: boolean;
}

interface FeaturedProjectsProps {
  projects: Project[];
  locale: string;
}

export function FeaturedProjects({ projects, locale }: FeaturedProjectsProps) {
  const t = useTranslations("projects");
  const reduce = useReducedMotion();

  return (
    <section className="py-24">
      <SectionHeading text={t("title", { highlight: t("titleHighlight") })} highlight={t("titleHighlight")} />

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div key={project.slug} {...fadeInUp(i * 0.08, !!reduce)}>
            <ProjectCard
              title={locale === "ar" ? project.title_ar : project.title_en}
              description={locale === "ar" ? project.description_ar : project.description_en}
              imageUrl={project.image_url || "/grid.svg"}
              techStack={project.tech_stack}
              liveUrl={project.live_url ?? undefined}
              slug={project.slug}
              locale={locale}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
