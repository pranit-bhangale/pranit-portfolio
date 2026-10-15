import type { Variants } from 'framer-motion';

/**
 * Shared Framer Motion Variants for specialized SaaS animations.
 * Centralizing these follows DRY (Don't Repeat Yourself) principles.
 */

// 1. Overall Section Entrance (Reveal on Scroll)
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

// 2. Individual Card Entrance (Staggered or Scale-based)
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 100
    }
  }
};


// 4. Direction-Aware Slide Animations for Carousels
export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" }
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" }
  })
};
