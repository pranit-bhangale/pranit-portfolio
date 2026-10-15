import React from 'react';
import type { ExperienceItem } from '../../assets/data/types';

interface ExperienceCardProps {
  exp: ExperienceItem;
  onClick: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ exp, onClick }) => {
  // Strip markdown to create a clean text excerpt for the card preview
  const plainTextDescription = (exp.description || '')
    .replace(/[*-]\s/g, '') // remove list bullets
    .replace(/#{1,6}\s?/g, '') // remove headings
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // replace links with text
    .replace(/\n/g, ' ') // replace newlines with space
    .trim();

  return (
    <div
      onClick={onClick}
      className="w-full h-full glass-card p-6 sm:p-8 rounded-[18px] relative group flex flex-col justify-between cursor-pointer"
    >

      <div className="relative z-10 flex-grow flex flex-col h-full w-full">
        <div className="mb-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-1 xl:gap-4 mb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-primary">{exp.company}</h3>
            <span className="text-primary/70 font-mono text-xs tracking-wider whitespace-nowrap">{exp.period}</span>
          </div>
          <span className="font-semibold text-text/90 dark:text-zinc-100 block">{exp.role}</span>
        </div>

        <p className="mt-2 text-sm sm:text-base text-muted/90 dark:text-zinc-400 line-clamp-3 overflow-hidden text-ellipsis mb-6 font-medium">
          {plainTextDescription}
        </p>
        
        {/* Tech Stack Pills at bottom */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
          {exp.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-4 py-1.5 bg-primary/15 text-primary rounded-full text-xs font-bold tracking-wide"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* View Details Link forces to bottom */}
        <div className="pt-4 flex justify-between items-center w-full border-t border-glass-border mt-6">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] flex items-center group-hover:opacity-80 transition-opacity">
            View Details
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

ExperienceCard.displayName = 'ExperienceCard';

export default ExperienceCard;
