"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      <div
        aria-hidden="true"
        className="bg-blueprint bg-blueprint-fade pointer-events-none absolute inset-0"
      />

      <div className="glass-panel relative w-full max-w-md rounded-2xl p-8 text-center">
        <div className="relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl bg-destructive/15 motion-safe:animate-[pulse-ring_2.6s_ease-out_infinite]"
          />
          <AlertTriangle className="relative h-6 w-6 text-destructive" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {t("error")}
        </h2>

        <button
          onClick={reset}
          className="focus-ring press sheen-hover mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl brand-gradient px-6 py-3 text-sm font-medium text-white shadow-[var(--shadow-2)] transition-shadow duration-300 hover:shadow-[var(--shadow-brand)]"
        >
          <RotateCw className="h-4 w-4" />
          {t("retry")}
        </button>
      </div>
    </div>
  );
}
