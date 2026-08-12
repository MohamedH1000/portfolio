"use client";

import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminNav } from "./AdminNav";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/experiences": "Experience",
  "/admin/testimonials": "Testimonials",
  "/admin/contacts": "Messages",
  "/admin/settings": "Settings",
};

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title =
    PAGE_TITLES[pathname] ||
    (pathname.startsWith("/admin/projects") ? "Projects" : "Admin");

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--hairline)] glass px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="focus-ring press inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-surface-high hover:text-foreground lg:hidden"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-5 w-5" />
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {title}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:block">
            {user?.email}
          </span>
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt=""
              className="h-9 w-9 rounded-full ring-2 ring-brand/25 ring-offset-2 ring-offset-[var(--background)] transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-105"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full brand-gradient text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-105">
              {(user?.name || user?.email || "A")[0].toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="admin-drawer-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-[var(--scrim)] backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            <motion.div
              key="admin-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--hairline)] bg-surface-low shadow-[var(--shadow-5)] lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="focus-ring press absolute right-3 top-4 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-high hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
              <AdminNav idPrefix="mobile" onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
