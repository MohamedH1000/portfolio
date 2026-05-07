"use client";

import { useState, useRef, useEffect } from "react";
import { handleSignOut } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full p-0.5 hover:opacity-80 transition-opacity cursor-pointer"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || ""}
            className="h-8 w-8 rounded-full border border-border/40 object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center text-brand text-sm font-medium">
            {(user.name || "U")[0].toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-2 w-56 rounded-xl bg-card border border-border/40 shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-border/20">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-high transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
