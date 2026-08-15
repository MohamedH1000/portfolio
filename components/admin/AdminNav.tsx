"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  MessageSquareQuote,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { handleSignOut } from "@/app/actions/auth";

export const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experiences", label: "Experience", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/contacts", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminNavProps {
  /** Distinguishes the desktop rail from the mobile drawer so the
   *  shared `layoutId` pill doesn't animate between two mounted copies. */
  idPrefix: string;
  onNavigate?: () => void;
}

/**
 * Sidebar contents shared by the desktop rail and the mobile drawer.
 * Kept separate from `AdminSidebar` so the drawer isn't rendering a
 * `hidden lg:flex` element (which made the mobile menu render empty).
 */
export function AdminNav({ idPrefix, onNavigate }: AdminNavProps) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-[var(--hairline)] px-5">
        <Link
          href="/"
          onClick={onNavigate}
          className="focus-ring group flex items-center gap-2.5 rounded-lg"
        >
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg btn-accent text-sm font-medium transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-105">
            MH
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }, i) => {
          const active = isActive(href, exact);
          return (
            <motion.div
              key={href}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-ring group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  "transition-colors duration-200",
                  active
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId={`${idPrefix}-admin-nav-pill`}
                    className="absolute inset-0 rounded-xl bg-brand/10 ring-1 ring-brand/20"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {!active && (
                  <span className="absolute inset-0 rounded-xl bg-surface-high/0 transition-colors duration-200 group-hover:bg-surface-high/70" />
                )}

                {/* Active edge marker */}
                {active && (
                  <motion.span
                    layoutId={`${idPrefix}-admin-nav-edge`}
                    className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full brand-gradient"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                <Icon
                  className={cn(
                    "relative h-4 w-4 shrink-0 transition-transform duration-300 ease-[var(--ease-spring)]",
                    active ? "scale-110" : "group-hover:scale-110"
                  )}
                />
                <span className="relative">{label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="shrink-0 space-y-1 border-t border-[var(--hairline)] px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-surface-high/70 hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          View Site
        </Link>
        <form action={handleSignOut}>
          <button
            type="submit"
            className="focus-ring group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-0.5" />
            Sign Out
          </button>
        </form>
      </div>
    </>
  );
}
