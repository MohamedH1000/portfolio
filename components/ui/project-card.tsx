"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { TechTag } from "@/components/ui/tech-tag";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  liveUrl?: string;
  slug: string;
  locale: string;
}

export function ProjectCard({
  title,
  description,
  imageUrl,
  techStack,
  slug,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={cn(
        "focus-ring group relative block overflow-hidden rounded-2xl",
        "surface-card border-gradient card-hover h-full",
        "hover:border-brand/25",
      )}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Hover affordance */}
        <span className="absolute end-3 top-3 z-20 inline-flex h-9 w-9 translate-y-2 items-center justify-center rounded-full glass text-brand opacity-0 shadow-[var(--shadow-2)] transition-all duration-400 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
        </span>
      </div>

      {/* Content */}
      <div className="relative space-y-4 p-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 pt-1">
          {techStack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <TechTag name={tech} />
            </motion.span>
          ))}
        </div>
      </div>
    </Link>
  );
}
