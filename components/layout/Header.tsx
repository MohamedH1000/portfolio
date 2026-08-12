"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full",
          "glass border-b border-[var(--hairline)]",
          "transition-[box-shadow,height] duration-300 ease-[var(--ease-quart)]",
          scrolled && "shadow-[var(--shadow-3)]"
        )}
      >
        {/* Brand hairline that fades in once the page is scrolled */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-500",
            "bg-gradient-to-r from-transparent via-brand/40 to-transparent",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="focus-ring rounded-lg text-xl font-bold tracking-tight text-foreground transition-colors hover:text-brand"
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
                  "focus-ring relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                  isActive(href)
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive(href) && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-lg bg-brand/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative">{t(key)}</span>
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
                  "focus-ring press inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full",
                  "border border-[var(--hairline)] bg-surface-high/60 text-muted-foreground",
                  "transition-all duration-300 ease-[var(--ease-quart)]",
                  "hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                )}
                aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={resolvedTheme}
                    initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex"
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            )}
            {mounted && session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Link
                href="/auth/signin"
                className="focus-ring press sheen-hover inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-2)] transition-shadow duration-300 hover:shadow-[var(--shadow-brand)]"
              >
                <LogIn className="h-4 w-4" />
                {tAuth("signIn")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:hidden cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay + Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[var(--scrim)] backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              key="panel"
              initial={{ x: locale === "ar" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: locale === "ar" ? "-100%" : "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className={cn(
                "fixed top-16 z-40 h-[calc(100dvh-4rem)] w-72 md:hidden",
                "glass border-s border-[var(--hairline)] shadow-[var(--shadow-4)]",
                locale === "ar" ? "left-0" : "right-0"
              )}
            >
              <nav className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map(({ href, key }, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: locale === "ar" ? -16 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "focus-ring block rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                        isActive(href)
                          ? "bg-brand/10 text-brand"
                          : "text-muted-foreground hover:bg-surface-high/50 hover:text-foreground"
                      )}
                    >
                      {t(key)}
                    </Link>
                  </motion.div>
                ))}

                <div className="divider-gradient my-4" />

                <div className="flex items-center gap-2 px-4">
                  <LanguageSwitcher />
                  {mounted && (
                    <button
                      onClick={toggleTheme}
                      className={cn(
                        "focus-ring press inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full",
                        "border border-[var(--hairline)] bg-surface-high/60 text-muted-foreground",
                        "transition-all duration-300 ease-[var(--ease-quart)]",
                        "hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
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
                      className="focus-ring press sheen-hover inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-2)] transition-shadow duration-300 hover:shadow-[var(--shadow-brand)]"
                    >
                      <LogIn className="h-4 w-4" />
                      {tAuth("signIn")}
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
