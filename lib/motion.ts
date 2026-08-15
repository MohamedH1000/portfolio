"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
  type Easing,
} from "framer-motion";

export const EASE_OUT: Easing = [0.16, 1, 0.3, 1];
export const EASE_SPRING = { type: "spring", stiffness: 300, damping: 24 } as const;

/** Shared spring for pointer-driven 3D — loose enough to feel like weight,
 *  damped enough that it never oscillates. */
export const TILT_SPRING = { stiffness: 180, damping: 22, mass: 0.6 } as const;

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

/**
 * Plain 3D "flip up" factory — the entry hinges at its bottom edge and
 * settles flat. Safe to call inside `.map()`; pass the reduced-motion flag
 * from a single `useReducedMotion()` call at the top of the component.
 */
export function flipInUp(delay = 0, reduce = false) {
  return {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 28, rotateX: -18 },
    whileInView: { opacity: 1, y: 0, rotateX: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: {
      duration: reduce ? 0.2 : 0.75,
      delay: reduce ? 0 : delay,
      ease: EASE_OUT,
    },
    style: reduce
      ? undefined
      : ({ transformPerspective: 1000, transformOrigin: "50% 100%" } as const),
  };
}

/** Hook form of `flipInUp` for single (non-looped) call sites. */
export function useFlipInUp(delay = 0) {
  const reduce = useReducedMotion();
  return flipInUp(delay, !!reduce);
}

interface Tilt3DOptions {
  /** Peak rotation in degrees at the element's corners. */
  max?: number;
  /** `transformPerspective` applied to the tilting element. */
  perspective?: number;
}

/**
 * Pointer-relative 3D tilt with spring smoothing.
 *
 * Tracks the pointer as a 0–1 fraction of the measured element's own box, so
 * it works at any size and in both writing directions. Returns motion values
 * plus a ready-made `style` object to spread onto a `motion.*` element, and a
 * `glareX`/`glareY` pair for a highlight that follows the pointer.
 *
 * Returns `style: undefined` under `prefers-reduced-motion`, so call sites
 * opt out simply by spreading it.
 *
 * The caller owns the ref and passes it in — keeping it out of the returned
 * object is what lets the React Compiler see the result as plain render data.
 */
export function useTilt3D<T extends HTMLElement = HTMLDivElement>(
  ref: React.RefObject<T | null>,
  { max = 10, perspective = 900 }: Tilt3DOptions = {},
) {
  const reduce = useReducedMotion();

  // 0.5 / 0.5 is the resting centre — no rotation.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const sx = useSpring(px, TILT_SPRING);
  const sy = useSpring(py, TILT_SPRING);

  // Pointer below centre tips the near edge toward the viewer, so rotateX
  // takes the inverted range.
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (reduce || !el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      px.set((e.clientX - rect.left) / rect.width);
      py.set((e.clientY - rect.top) / rect.height);
    },
    [reduce, px, py, ref],
  );

  const reset = useCallback(() => {
    px.set(0.5);
    py.set(0.5);
  }, [px, py]);

  return {
    reduce: !!reduce,
    rotateX,
    rotateY,
    glareX,
    glareY,
    onPointerMove,
    onPointerLeave: reset,
    onBlur: reset,
    style: reduce
      ? undefined
      : {
          rotateX,
          rotateY,
          transformPerspective: perspective,
          transformStyle: "preserve-3d" as const,
        },
  };
}

/** Splits a display stat like `"20+"` or `"+20"` into its number and the
 *  text that brackets it, so a count-up can animate the digits and leave the
 *  suffix (and RTL prefix) exactly as the translator wrote them. */
export function splitStatValue(raw: string): {
  prefix: string;
  value: number | null;
  suffix: string;
} {
  const match = raw.match(/^(\D*?)(\d+(?:\.\d+)?)(\D*)$/);
  if (!match) return { prefix: "", value: null, suffix: raw };
  return { prefix: match[1], value: Number(match[2]), suffix: match[3] };
}

/**
 * Counts a number up from zero the first time it scrolls into view.
 *
 * Attach `ref` to the element that displays the figure and render `display`
 * as the child of a `motion.*` element — it's a MotionValue, so the digits
 * update without re-rendering the tree. Jumps straight to the target under
 * `prefers-reduced-motion`.
 *
 * The value *starts* at the target rather than at zero, so the figure the
 * server renders is the real one — crawlers and pre-hydration paints show
 * "20+", not "0+". It rewinds to zero only at the moment the animation
 * starts, within the same tick, so nothing flashes.
 */
export function useCountUp(
  target: number,
  { duration = 1.6, decimals = 0 }: { duration?: number; decimals?: number } = {},
): { ref: React.RefObject<HTMLSpanElement | null>; display: MotionValue<string> } {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const count = useMotionValue(target);
  const display = useTransform(count, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (reduce) {
      count.set(target);
      return;
    }
    if (!inView) return;
    count.set(0);
    const controls = animate(count, target, { duration, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, target, duration, reduce, count]);

  return { ref, display };
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
