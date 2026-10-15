import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { toggleMobileMenu, closeMobileMenu, selectIsMobileMenuOpen } from '../../features/nav/navSlice';
import { useOutsideAction } from '../../hooks/useOutsideAction';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import { personalInfo } from '../../assets/data/navigation';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const isMobileOpen = useAppSelector(selectIsMobileMenuOpen);
  const [scroll, setScroll] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  // Custom hook to close navbar on outside click or scroll
  useOutsideAction(headerRef, isMobileOpen, () => {
    dispatch(closeMobileMenu());
  });

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <nav className={`glass-nav transition-all duration-300 ${scroll ? 'py-3 px-6 md:px-8' : 'py-4 px-6 md:px-10'} flex items-center justify-between gap-4 md:gap-8 w-full max-w-5xl`}>
        {/* Desktop Nav - SRP: Delegated to DesktopNav */}
        <DesktopNav />

        {/* Right Side Actions */}
        <div className="flex items-center ml-auto gap-4 flex-shrink-0">
          <div className="hidden md:flex items-center gap-4">
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary text-xs lg:text-sm font-medium transition-colors whitespace-nowrap"
            >
              View Resume
            </a>
          </div>

          {/* Mobile Menu Button - Logic triggers global state */}
          <button
            className="md:hidden text-text p-2 hover:text-primary transition-colors flex items-center justify-center cursor-pointer text-xl"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Toggle Menu"
          >
            {isMobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay - SRP: Delegated to MobileMenu */}
      <MobileMenu isOpen={isMobileOpen} />
    </header>
  );
};

export default Header;
