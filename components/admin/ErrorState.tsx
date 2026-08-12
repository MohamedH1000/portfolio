"use client";

import { motion } from "framer-motion";
import { AlertCircle, RotateCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      role="alert"
      className="flex flex-col items-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="focus-ring press mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-brand/40 hover:bg-surface-high"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </motion.div>
  );
}
