"use client";

import { AdminNav } from "./AdminNav";

/** Desktop-only fixed rail. The mobile drawer renders `AdminNav` directly. */
export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-[var(--hairline)] bg-surface-low/80 backdrop-blur-xl lg:flex">
      {/* Ambient brand wash so the rail reads as a distinct surface */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/[0.06] via-transparent to-transparent"
      />
      <div className="relative flex h-full flex-col">
        <AdminNav idPrefix="desktop" />
      </div>
    </aside>
  );
}
