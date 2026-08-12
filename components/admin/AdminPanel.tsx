"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminPanelProps {
  children: React.ReactNode;
  /** Optional header row rendered above a hairline divider */
  title?: string;
  action?: React.ReactNode;
  /** Stagger index so stacked panels cascade in */
  index?: number;
  className?: string;
  bodyClassName?: string;
}

/** Elevated container used for every boxed region in the admin. */
export function AdminPanel({
  children,
  title,
  action,
  index = 0,
  className,
  bodyClassName,
}: AdminPanelProps) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "surface-card overflow-hidden rounded-2xl",
        className
      )}
    >
      {title && (
        <div className="relative flex items-center justify-between gap-4 border-b border-[var(--hairline)] px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className={cn("relative", bodyClassName)}>{children}</div>
    </motion.section>
  );
}
