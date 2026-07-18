"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

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

const MAGNET_STRENGTH = 0.25;
const MAGNET_MAX = 10;

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
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, offsetX * MAGNET_STRENGTH)));
    y.set(Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, offsetY * MAGNET_STRENGTH)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles = cn(
    "focus-ring inline-flex items-center justify-center gap-2",
    "rounded-full px-8 py-3",
    "font-medium text-sm",
    "bg-gradient-to-r from-brand to-purple-400 text-white",
    "transition-shadow duration-300 ease-out",
    "hover:shadow-[0_0_24px_rgba(203,172,249,0.35)]",
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

  const motionProps = {
    style: reduce ? undefined : { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileHover: reduce ? undefined : { scale: 1.02 },
    whileTap: { scale: 0.96 },
  };

  if (href) {
    return (
      <MotionLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseStyles}
        {...motionProps}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
