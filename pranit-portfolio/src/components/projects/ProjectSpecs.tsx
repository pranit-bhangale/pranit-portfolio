import React from 'react';

interface ProjectSpecsProps {
  features?: string[];
  techStack: string[];
}

const ProjectSpecs: React.FC<ProjectSpecsProps> = ({ features, techStack }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-glass-border pt-10 mb-16">
      {/* Features */}
      {features && features.length > 0 && (
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold text-text dark:text-white mb-6">Key Features</h3>
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mt-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                <span className="text-muted dark:text-zinc-300 leading-relaxed font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Stack */}
      <div className="flex flex-col gap-8">
        <div className="glass-card p-8 flex flex-col h-full">
          <h3 className="text-2xl font-bold text-text dark:text-white mb-6">Tech Stack</h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/5 text-text dark:text-zinc-200 text-sm font-medium rounded-lg border border-glass-border hover:border-primary/50 transition-colors shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSpecs;
