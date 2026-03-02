import { Variants } from "framer-motion";

/**
 * Common transitions for consistent feel
 */
export const transitions = {
  default: { duration: 0.3, ease: "easeInOut" },
  spring: { type: "spring", stiffness: 300, damping: 30 },
  slow: { duration: 0.5, ease: "easeOut" },
  fast: { duration: 0.2, ease: "linear" },
};

/**
 * Slide and Fade Variants for switching between forms or steps
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/**
 * Directional slide variants for dynamic transitions (e.g., based on index or step)
 */
export const getSlideVariants = (direction: "left" | "right"): Variants => ({
  initial: { opacity: 0, x: direction === "left" ? -20 : 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: direction === "right" ? -20 : 20 },
});
