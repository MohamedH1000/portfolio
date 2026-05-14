"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";

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

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/30 bg-card/80 backdrop-blur-sm px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground lg:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </span>
          {user?.image ? (
            <img
              src={user?.image}
              alt=""
              className="h-8 w-8 rounded-full border border-border/40"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center text-brand text-sm font-medium">
              {(user?.name || "A")[0].toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 transform bg-card transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <AdminSidebar />
      </div>
    </>
  );
}
