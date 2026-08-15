"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface AdminButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "btn-accent sheen-hover",
  secondary:
    "border border-border/60 bg-surface-high/60 text-foreground hover:bg-surface-highest hover:border-brand/30",
  ghost:
    "text-muted-foreground hover:bg-surface-high hover:text-foreground",
  danger:
    "bg-destructive text-[var(--destructive-foreground)] shadow-[var(--shadow-2)] hover:brightness-110",
};

export function AdminButton({
  variant = "primary",
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: AdminButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "focus-ring press relative inline-flex cursor-pointer items-center justify-center gap-2",
        "rounded-xl px-4 py-2 text-sm font-medium",
        "transition-all duration-200 ease-[var(--ease-quart)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
