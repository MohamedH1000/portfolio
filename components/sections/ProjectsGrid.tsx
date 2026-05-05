"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { ProjectCard } from "@/components/ui/project-card";
import { TechTag } from "@/components/ui/tech-tag";

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

interface ProjectsGridProps {
  projects: Project[];
  locale: string;
}

export function ProjectsGrid({ projects, locale }: ProjectsGridProps) {
  const t = useTranslations("projects");
  const isAr = locale === "ar";
  const [search, setSearch] = useState("");
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const allTechs = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((p) => p.tech_stack.forEach((t) => techs.add(t)));
    return Array.from(techs).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const title = isAr ? p.title_ar : p.title_en;
      const desc = isAr ? p.description_ar : p.description_en;
      const matchesSearch =
        !search ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        desc.toLowerCase().includes(search.toLowerCase());
      const matchesTech = !activeTech || p.tech_stack.includes(activeTech);
      return matchesSearch && matchesTech;
    });
  }, [projects, search, activeTech, isAr]);

  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="w-full bg-surface-low border border-brand/10 rounded-xl ps-10 pe-4 py-3 text-sm outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTech(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              !activeTech ? "bg-gradient-to-r from-brand to-purple-400 text-white" : "bg-surface-high text-muted-foreground hover:bg-brand/10 hover:text-brand"
            }`}
          >
            {t("filterAll")}
          </button>
          {allTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => setActiveTech(activeTech === tech ? null : tech)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeTech === tech ? "bg-gradient-to-r from-brand to-purple-400 text-white" : "bg-surface-high text-muted-foreground hover:bg-brand/10 hover:text-brand"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t("noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard
              key={project.slug}
              title={isAr ? project.title_ar : project.title_en}
              description={isAr ? project.description_ar : project.description_en}
              imageUrl={project.image_url || "/grid.svg"}
              techStack={project.tech_stack}
              liveUrl={project.live_url ?? undefined}
              slug={project.slug}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
