"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  /** Stagger index so a row of cards cascades in */
  index?: number;
  accent?: "brand" | "positive" | "warning";
  className?: string;
}

const ACCENTS = {
  brand: "text-brand bg-brand/10 ring-brand/20",
  positive: "text-emerald-400 bg-emerald-400/10 ring-emerald-400/20",
  warning: "text-amber-400 bg-amber-400/10 ring-amber-400/20",
} as const;

export function StatsCard({
  label,
  value,
  icon: Icon,
  index = 0,
  accent = "brand",
  className,
}: StatsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [counted, setCounted] = useState(0);
  // Derived rather than stored, so reduced-motion needs no setState-in-effect
  const display = reduce ? value : counted;

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: Math.min(1.1, 0.4 + value * 0.03),
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCounted(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "surface-card border-gradient group relative overflow-hidden rounded-2xl p-5",
        "lift-sm hover:border-brand/25",
        className
      )}
    >
      {/* Soft corner glow that blooms on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {label}
          </p>
          <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight text-foreground">
            {display}
          </p>
        </div>

        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1",
            "transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-110 group-hover:-rotate-6",
            ACCENTS[accent]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
