"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { ProjectCard } from "@/components/ui/project-card";

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
  const reduce = useReducedMotion();

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
        <div className="group relative max-w-md">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-brand" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="field rounded-xl py-3 ps-10 pe-4"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={!activeTech}
            onClick={() => setActiveTech(null)}
            label={t("filterAll")}
          />
          {allTechs.map((tech) => (
            <FilterPill
              key={tech}
              active={activeTech === tech}
              onClick={() => setActiveTech(activeTech === tech ? null : tech)}
              label={tech}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground py-12"
          >
            {t("noResults")}
          </motion.p>
        ) : (
          <motion.div
            key={`${search}-${activeTech}`}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
            }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reduce ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                <ProjectCard
                  title={isAr ? project.title_ar : project.title_en}
                  description={isAr ? project.description_ar : project.description_en}
                  imageUrl={project.image_url || "/grid.svg"}
                  techStack={project.tech_stack}
                  liveUrl={project.live_url ?? undefined}
                  slug={project.slug}
                  locale={locale}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function FilterPill({ active, onClick, label }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`focus-ring press relative cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 ${
        active
          ? "text-white"
          : "bg-surface-high text-muted-foreground hover:bg-brand/10 hover:text-brand"
      }`}
    >
      {active && (
        <motion.span
          layoutId="projects-filter-pill"
          className="absolute inset-0 rounded-full brand-gradient shadow-[var(--shadow-brand)]"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <span className="relative">{label}</span>
    </button>
  );
}
