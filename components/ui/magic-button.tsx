"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface MagicButtonProps {
  title: string;
  icon?: React.ReactNode;
  position?: "left" | "right";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export function MagicButton({
  title,
  icon,
  position = "left",
  href,
  onClick,
  type = "button",
  disabled = false,
  className,
}: MagicButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2",
    "rounded-full px-8 py-3",
    "font-medium text-sm",
    "bg-gradient-to-r from-brand to-purple-400 text-white",
    "transition-all duration-300 ease-out",
    "hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(203,172,249,0.35)]",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    "dark:from-[#CBACF9] dark:to-[#9b7fd4]",
    className,
  );

  // RTL-aware icon placement: swap for RTL context
  const iconElement = icon && (
    <span className="shrink-0 rtl:order-last">{icon}</span>
  );

  const content = (
    <>
      {icon && position === "left" && iconElement}
      <span>{title}</span>
      {icon && position === "right" && iconElement}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {content}
    </button>
  );
}
