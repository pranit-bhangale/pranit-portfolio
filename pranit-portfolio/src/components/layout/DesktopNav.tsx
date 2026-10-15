import React from 'react';
import { navLinks } from '../../assets/data/navigation';

const DesktopNav: React.FC = () => {
  return (
    <ul className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-8">
      {navLinks.map((link) => (
        <li key={link.name} className="flex-shrink-0">
          <a
            href={link.href}
            className="text-muted hover:text-primary font-medium transition-colors text-xs lg:text-sm tracking-wide whitespace-nowrap"
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default DesktopNav;
