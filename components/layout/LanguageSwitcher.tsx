"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  if (!mounted) {
    return (
      <div className="h-8 w-16 rounded-full bg-surface-high" />
    );
  }

  return (
    <button
      onClick={switchLocale}
      className={cn(
        "relative inline-flex h-8 items-center rounded-full px-3",
        "bg-surface-high text-sm font-medium",
        "text-muted-foreground transition-colors",
        "hover:bg-surface-highest hover:text-foreground",
        "cursor-pointer select-none"
      )}
      aria-label={
        locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
      }
    >
      {locale === "en" ? "عربي" : "EN"}
    </button>
  );
}
