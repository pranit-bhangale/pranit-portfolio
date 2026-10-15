import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, id, className = '' }) => {
  return (
    <section id={id} className={`py-16 sm:py-20 md:py-24 container mx-auto px-4 min-h-[300px] ${className}`}>
      <motion.div
        className="glass-panel p-5 sm:p-8 md:p-12 relative overflow-hidden h-full"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Decorative subtle gradient orb inside */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {children}
      </motion.div>
    </section>
  );
};

export default SectionWrapper;
