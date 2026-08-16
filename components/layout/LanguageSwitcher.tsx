"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/hooks";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();

  const switchLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  if (!hydrated) {
    return <div className="h-9 w-16 rounded-full bg-surface-high/60" />;
  }

  const label = locale === "en" ? "عربي" : "EN";

  return (
    <button
      onClick={switchLocale}
      className={cn(
        "focus-ring press relative inline-flex h-9 min-w-16 items-center justify-center rounded-full px-3.5",
        "border border-[var(--hairline)] bg-surface-high/60 text-sm font-medium",
        "text-muted-foreground",
        "transition-all duration-300 ease-[var(--ease-quart)]",
        "hover:border-brand/30 hover:bg-brand/10 hover:text-brand",
        "cursor-pointer select-none"
      )}
      aria-label={
        locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
