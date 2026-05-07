"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "@/components/ui/user-menu";
import { LogIn } from "lucide-react";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/experience", key: "experience" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("Auth");
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full",
          "glass border-b",
          isDark ? "border-white/[0.06]" : "border-black/[0.06]"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground transition-colors hover:text-brand"
          >
            M<span className="text-brand">H</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  isActive(href)
                    ? "text-brand bg-brand/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-high/50"
                )}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            {mounted && (
              <button
                onClick={toggleTheme}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
                  "border",
                  isDark
                    ? "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    : "border-black/10 bg-black/5 text-muted-foreground hover:bg-black/10 hover:text-foreground"
                )}
                aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
            {mounted && session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <LogIn className="h-4 w-4" />
                {tAuth("signIn")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:hidden cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed top-16 z-40 h-[calc(100dvh-4rem)] w-72 md:hidden",
          "glass border-s",
          isDark ? "border-white/[0.06]" : "border-black/[0.06]",
          "transition-transform duration-300 ease-in-out",
          locale === "ar" ? "left-0" : "right-0",
          mobileOpen
            ? "translate-x-0"
            : locale === "ar"
              ? "-translate-x-full"
              : "translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive(href)
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:bg-surface-high/50 hover:text-foreground"
              )}
            >
              {t(key)}
            </Link>
          ))}

          <div className="my-4 h-px bg-border/40" />

          <div className="flex items-center gap-2 px-4">
            <LanguageSwitcher />
            {mounted && (
              <button
                onClick={toggleTheme}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
                  "border",
                  isDark
                    ? "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    : "border-black/10 bg-black/5 text-muted-foreground hover:bg-black/10 hover:text-foreground"
                )}
                aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          <div className="mt-2 px-4">
            {mounted && session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <LogIn className="h-4 w-4" />
                {tAuth("signIn")}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
