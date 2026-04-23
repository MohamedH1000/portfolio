"use client";

import { useTranslations } from "next-intl";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
      <h2 className="text-2xl font-bold mb-4">{t("error")}</h2>
      <button
        onClick={reset}
        className="px-6 py-2 rounded-lg bg-brand text-primary-foreground hover:bg-brand/90 transition-colors"
      >
        {t("retry")}
      </button>
    </div>
  );
}
