import React from 'react';
import type { Project } from '../../assets/data/types';

interface ProjectCardProps {
  project: Project;
  isActive?: boolean;
  onClick: (e: React.MouseEvent, project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div
      onClick={(e) => onClick(e, project)}
      className="glass-card flex flex-col items-stretch h-full relative group cursor-pointer"
    >
      <div className="p-6 sm:p-8 relative z-10 flex flex-col h-full w-full">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-primary text-xs font-bold uppercase tracking-widest">
            {project.category}
          </h4>
        </div>
        <h3 className="text-2xl font-bold text-text dark:text-white mb-4">{project.title}</h3>
        
        {/* Truncated description */}
        <p className="text-muted dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 overflow-hidden text-ellipsis font-medium">
          {project.description}
        </p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Read More Link forced to bottom */}
        <div className="pt-4 flex justify-between items-center w-full border-t border-glass-border">
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

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
