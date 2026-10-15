import React from 'react';
import { toast } from 'react-toastify';

interface ProjectActionsProps {
  demoLink?: string;
  className?: string;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ demoLink, className = "" }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!demoLink || demoLink === '#' || demoLink === '') {
      e.preventDefault();
      toast.info("Live link will be available soon!", {
        position: "bottom-center",
        theme: "dark",
      });
    }
  };

  if (!demoLink) return null;

  return (
    <div className={className}>
      <a
        href={demoLink.startsWith('http') ? demoLink : (demoLink === '#' ? '#' : `https://${demoLink}`)}
        target={demoLink && demoLink !== '#' ? "_blank" : undefined}
        rel={demoLink && demoLink !== '#' ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-10 py-3.5 sm:py-4 bg-primary text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 group text-center"
      >
        View Web Application
        <span className="transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </a>
    </div>
  );
};

export default ProjectActions;
