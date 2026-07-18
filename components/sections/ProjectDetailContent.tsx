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
        className="focus-ring inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 rounded-md"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        {backLabel}
      </Link>

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-video rounded-xl overflow-hidden bg-surface-low mb-8"
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
              className="focus-ring inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-primary-foreground font-medium transition-all duration-200 hover:bg-brand/90 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(203,172,249,0.3)]"
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
              className="focus-ring inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-high text-foreground font-medium transition-all duration-200 hover:bg-surface-bright hover:-translate-y-0.5"
            >
              {sourceCodeLabel}
            </a>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
