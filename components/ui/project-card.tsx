"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { TechTag } from "@/components/ui/tech-tag";
import { useTilt3D } from "@/lib/motion";

const MotionLink = motion.create(Link);

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
  const cardRef = useRef<HTMLAnchorElement>(null);
  const tilt = useTilt3D(cardRef, { max: 8, perspective: 1000 });

  // A soft accent light that tracks the pointer across the card face.
  const glare = useTransform(
    [tilt.glareX, tilt.glareY],
    ([x, y]: string[]) =>
      `radial-gradient(260px circle at ${x} ${y}, rgba(var(--brand-rgb), 0.16), transparent 62%)`,
  );

  return (
    <MotionLink
      ref={cardRef}
      href={`/projects/${slug}`}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      onBlur={tilt.onBlur}
      style={tilt.style}
      whileHover={tilt.reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "focus-ring group relative block rounded-2xl",
        "surface-card border-gradient h-full",
        "transition-[box-shadow,border-color] duration-500 ease-[var(--ease-expo)]",
        "hover:border-brand/30 hover:shadow-[var(--shadow-3)]",
      )}
    >
      {/* Image — `overflow-hidden` forces flattening, so it stays on this
          wrapper rather than the card, which has to keep preserve-3d. */}
      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Pointer-tracking glare, painted above the card face */}
      {!tilt.reduce && (
        <motion.span
          aria-hidden="true"
          style={{ backgroundImage: glare }}
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      {/* Hover affordance — the nearest layer, so it lifts furthest on tilt */}
      <span className="absolute end-3 top-3 z-30 inline-flex h-9 w-9 translate-y-2 items-center justify-center rounded-lg glass text-brand opacity-0 shadow-[var(--shadow-2)] transition-all duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100 [transform-style:preserve-3d] group-hover:[transform:translateZ(45px)]">
        <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
      </span>

      {/* Content — lifted a little off the card face */}
      <div className="relative z-20 space-y-3 p-5 [transform:translateZ(24px)]">
        <h3 className="text-lg font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand">
          {title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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
    </MotionLink>
  );
}
