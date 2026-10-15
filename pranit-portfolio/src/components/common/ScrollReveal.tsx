import React, { type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { sectionVariants } from '../../constants/animations';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * ScrollReveal HOC abstracts away Framer Motion dependency from 
 * standard presentation components, enforcing the Dependency Inversion Principle.
 */
const ScrollReveal: React.FC<ScrollRevealProps> = React.memo(({ children, className = "", delay = 0 }) => {
  const customVariants: Variants = delay
    ? {
        ...sectionVariants,
        visible: {
          ...sectionVariants.visible,
          transition: {
            // @ts-expect-error transition property merging
            ...sectionVariants.visible?.transition,
            delay
          }
        }
      }
    : sectionVariants;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';

export default ScrollReveal;
