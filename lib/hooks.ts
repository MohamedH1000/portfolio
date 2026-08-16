"use client";

import { useSyncExternalStore } from "react";

/** Never fires — hydration happens once and never reverts. */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` while rendering on the server and during hydration, `true` after.
 *
 * Use it to gate anything that would otherwise mismatch between server and
 * client — a resolved theme, a locale-dependent label, a `window` read.
 *
 * This replaces the `useState(false)` + `useEffect(() => setMounted(true))`
 * pattern. That version sets state inside an effect, which costs a second
 * render pass on every mount and opts the component out of React Compiler
 * optimization. `useSyncExternalStore` gives React the two snapshots directly,
 * so the correct value is known on the first client render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
