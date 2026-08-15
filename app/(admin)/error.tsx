"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RotateCw } from "lucide-react";

/**
 * Error boundary for the whole admin group. Sits above `admin/layout.tsx` so it
 * catches failures in the layout itself, not just in the pages beneath it.
 *
 * Deliberately plain English and free of `useTranslations` — the admin group is
 * English-only and renders outside `NextIntlClientProvider`, so a translation
 * hook here would throw inside the error boundary itself.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        role="alert"
        className="w-full max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
      >
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>

        <h2 className="text-lg font-semibold text-foreground">
          Something went wrong in the admin panel
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This is usually a stale sign-in. Try again, or sign out and back in.
        </p>

        {/* Production strips the message but keeps the digest — surfacing it
            here is the only way to correlate a report with the Vercel log. */}
        {error.digest && (
          <p className="mt-4 font-mono text-xs text-muted-foreground/70">
            digest: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="focus-ring press mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:border-brand/40 hover:bg-surface-high"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </motion.div>
    </div>
  );
}
