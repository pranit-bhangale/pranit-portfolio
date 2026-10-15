import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '../../app/store';
import { closeMobileMenu } from '../../features/nav/navSlice';
import { navLinks, personalInfo } from '../../assets/data/navigation';

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
  const dispatch = useAppDispatch();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full mt-4 w-[92%] max-w-md glass-panel md:hidden p-6 flex flex-col items-center gap-5 shadow-2xl z-50 border border-white/10"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-base sm:text-lg text-text hover:text-primary font-medium transition-colors w-full text-center py-1"
              onClick={() => dispatch(closeMobileMenu())}
            >
              {link.name}
            </a>
          ))}
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary pt-3 border-t border-glass-border w-full text-center hover:underline"
            onClick={() => dispatch(closeMobileMenu())}
          >
            View Resume ↗
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
