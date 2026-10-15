import React from 'react';

interface ProjectHeaderProps {
  title: string;
  category: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ title, category }) => {
  return (
    <header className="mb-10 text-center md:text-left">
      <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-[0.2em] border border-primary/20">
        {category}
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text via-text to-primary dark:from-white dark:via-white dark:to-white/80 mb-8 leading-tight pb-2">
        {title}
      </h1>
    </header>
  );
};

export default ProjectHeader;
