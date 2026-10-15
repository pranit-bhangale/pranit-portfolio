import React from 'react';
import { BiLogoLinkedin, BiLogoGithub, BiLogoGmail } from 'react-icons/bi';
import { socialLinks, personalInfo } from '../../assets/data/navigation';

const CURRENT_YEAR = new Date().getFullYear();

const Footer: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'linkedin': return <BiLogoLinkedin size={22} />;
      case 'github': return <BiLogoGithub size={22} />;
      case 'email': return <BiLogoGmail size={22} />;
      default: return null;
    }
  };

  return (
    <footer className="mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="glass-panel py-6 px-8 flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h2 className="text-base font-bold text-text">{personalInfo.name}</h2>
            <p className="text-sm text-muted">
              © {CURRENT_YEAR} All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.type !== 'email' ? "_blank" : undefined}
                rel={link.type !== 'email' ? "noopener noreferrer" : undefined}
                className="text-muted hover:text-primary transition-all hover:scale-110 duration-300 flex items-center justify-center bg-white/5 border border-white/10 dark:border-white/20 p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/20"
                aria-label={link.name}
              >
                {getIcon(link.type)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
