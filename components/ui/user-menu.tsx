"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { handleSignOut } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    is_admin?: boolean;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const itemClass =
    "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-surface-high hover:text-foreground cursor-pointer";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          "focus-ring press flex cursor-pointer items-center rounded-full p-0.5",
          "transition-all duration-300 ease-[var(--ease-spring)]",
          open ? "ring-2 ring-brand/40" : "hover:ring-2 hover:ring-brand/25"
        )}
      >
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name || ""}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full brand-gradient text-sm font-semibold text-white">
            {(user.name || user.email || "U")[0].toUpperCase()}
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel absolute end-0 top-full z-50 mt-2 w-56 origin-top overflow-hidden rounded-2xl py-2"
          >
            <div className="border-b border-[var(--hairline)] px-4 pb-2.5">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>

            <form action={handleSignOut} className="mt-1">
              <button type="submit" role="menuitem" className={itemClass}>
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
