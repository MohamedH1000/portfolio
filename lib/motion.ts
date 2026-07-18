"use client";

import { useReducedMotion, type Variants, type Easing } from "framer-motion";

export const EASE_OUT: Easing = [0.16, 1, 0.3, 1];
export const EASE_SPRING = { type: "spring", stiffness: 300, damping: 24 } as const;

/**
 * Plain (non-hook) fade-up factory — safe to call inside `.map()`.
 * Pass the reduced-motion flag from a single `useReducedMotion()` call
 * made once at the top of the component.
 */
export function fadeInUp(delay = 0, reduce = false) {
  return {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: {
      duration: reduce ? 0.2 : 0.6,
      delay: reduce ? 0 : delay,
      ease: EASE_OUT,
    },
  };
}

/** Hook form of `fadeInUp` for single (non-looped) call sites. */
export function useFadeInUp(delay = 0) {
  const reduce = useReducedMotion();
  return fadeInUp(delay, !!reduce);
}

/** Plain stagger container variant — safe to call inside `.map()`. */
export function stagger(staggerChildren = 0.12, reduce = false): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : staggerChildren } },
  };
}

export function useStagger(staggerChildren = 0.12): Variants {
  const reduce = useReducedMotion();
  return stagger(staggerChildren, !!reduce);
}

/** Plain child variant paired with `stagger` — safe to call inside `.map()`. */
export function fadeUpItem(reduce = false): Variants {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.6, ease: EASE_OUT },
    },
  };
}

export function useFadeUpItem(): Variants {
  const reduce = useReducedMotion();
  return fadeUpItem(!!reduce);
}

/** Scale-in variant for modals, cards entering on hover/focus, etc. */
export function useScaleIn() {
  const reduce = useReducedMotion();

  return {
    initial: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 },
    transition: { duration: reduce ? 0.15 : 0.3, ease: EASE_OUT },
  };
}
