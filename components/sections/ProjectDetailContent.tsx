"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { TechTag } from "@/components/ui/tech-tag";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useStagger, useFadeUpItem } from "@/lib/motion";

interface ProjectDetailContentProps {
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  backLabel: string;
  liveDemoLabel: string;
  sourceCodeLabel: string;
}

export function ProjectDetailContent({
  title,
  description,
  imageUrl,
  techStack,
  liveUrl,
  githubUrl,
  backLabel,
  liveDemoLabel,
  sourceCodeLabel,
}: ProjectDetailContentProps) {
  const reduce = useReducedMotion();
  const stagger = useStagger(0.1);
  const item = useFadeUpItem();

  return (
    <>
      <Link
        href={{ pathname: "/projects" }}
        className="focus-ring group mb-8 inline-flex items-center gap-2 rounded-md text-muted-foreground transition-colors duration-200 hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        {backLabel}
      </Link>

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="border-gradient border-gradient-static relative mb-8 aspect-video overflow-hidden rounded-2xl bg-surface-low shadow-[var(--shadow-4)]"
      >
        <Image src={imageUrl} alt={title} fill className="object-cover" priority />
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.h1 variants={item} className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </motion.h1>

        <motion.div variants={item} className="flex flex-wrap gap-2 mb-6">
          {techStack.map((tech) => (
            <TechTag key={tech} name={tech} />
          ))}
        </motion.div>

        <motion.p variants={item} className="text-lg text-muted-foreground leading-relaxed mb-8">
          {description}
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-4">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring press sheen-hover inline-flex items-center gap-2 rounded-xl btn-accent px-6 py-3 font-medium transition-all duration-300 ease-[var(--ease-quart)] hover:-translate-y-0.5"
            >
              <ExternalLink className="w-4 h-4" />
              {liveDemoLabel}
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring press inline-flex items-center gap-2 rounded-xl border border-[var(--hairline)] bg-surface-high px-6 py-3 font-medium text-foreground shadow-[var(--shadow-1)] transition-all duration-300 ease-[var(--ease-quart)] hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[var(--shadow-3)]"
            >
              {sourceCodeLabel}
            </a>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
