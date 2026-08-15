"use client";

import { motion } from "framer-motion";
import { splitStatValue, useCountUp } from "@/lib/motion";

interface StatCounterProps {
  /** The display string exactly as authored, e.g. `"20+"` or `"+20"`. */
  value: string;
  className?: string;
}

/**
 * Counts the numeric part of a stat up from zero the first time it scrolls
 * into view, leaving whatever brackets it — the `+` suffix in English, the
 * `+` prefix in Arabic — untouched. Falls back to plain text when the string
 * carries no number, and to the final figure under `prefers-reduced-motion`.
 */
export function StatCounter({ value, className }: StatCounterProps) {
  const { prefix, value: target, suffix } = splitStatValue(value);
  const { ref, display } = useCountUp(target ?? 0);

  if (target === null) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={className}>
      {prefix}
      <motion.span ref={ref}>{display}</motion.span>
      {suffix}
    </span>
  );
}
