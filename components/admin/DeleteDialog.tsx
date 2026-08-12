"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete item",
  message = "Are you sure? This action cannot be undone.",
  loading = false,
}: DeleteDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, loading, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-sm"
            onClick={loading ? undefined : onClose}
            aria-hidden="true"
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="glass-panel relative w-full max-w-md rounded-2xl p-6"
          >
            <button
              onClick={onClose}
              disabled={loading}
              className="focus-ring press absolute end-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-high hover:text-foreground disabled:opacity-40"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-destructive/20 motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]"
                />
                <AlertTriangle className="relative h-5 w-5 text-destructive" />
              </div>
              <h3
                id="delete-dialog-title"
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                {title}
              </h3>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {message}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="focus-ring press cursor-pointer rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-surface-high hover:text-foreground disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="focus-ring press inline-flex cursor-pointer items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-[var(--destructive-foreground)] shadow-[var(--shadow-2)] transition-all duration-200 hover:shadow-[var(--shadow-3)] hover:brightness-110 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
