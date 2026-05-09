"use client";

import { useReducedMotion, type Variants } from "framer-motion";

// ─── Timing configs ────────────────────────────────────────────────────────────
export const spring = {
  type: "spring",
  stiffness: 320,
  damping: 28,
} as const;

export const smooth = {
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

export const snappy = {
  duration: 0.15,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

// ─── Shared variants ───────────────────────────────────────────────────────────
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: smooth,
  },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

// Stagger with 60ms between children — for cascading lists
export const staggerList: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

// Slower stagger for analysis result sections (150ms — "presenting" feel)
export const staggerSections: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// ─── useMotion hook ────────────────────────────────────────────────────────────
// Returns shouldReduce: true when prefers-reduced-motion is set.
// Pass to every animated component — fall back to instant transitions.
export function useMotion() {
  const shouldReduce = useReducedMotion();

  const transition = (config: object) =>
    shouldReduce ? { duration: 0 } : config;

  return { shouldReduce, transition };
}
