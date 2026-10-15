import React from 'react';
import type { ProjectDemoAssets } from '../../assets/data/types';

interface ProjectAssetsProps {
  assets?: ProjectDemoAssets;
  title: string;
}

const ProjectAssets: React.FC<ProjectAssetsProps> = ({ assets, title }) => {
  if (!assets) return null;

  return (
    <div className="mt-12 space-y-8">
      {assets.video && (
        <div className="glass-panel p-2 overflow-hidden">
          <video
            src={assets.video}
            controls
            className="w-full h-auto rounded-xl shadow-lg border border-glass-border"
            style={{ maxHeight: '70vh' }}
          >
            Your browser does not support the video tag.
          </video>
          <p className="text-center text-sm text-muted mt-3 mb-1 font-medium tracking-wide">Project Demo Video</p>
        </div>
      )}

      {assets.document && (
        <div className="glass-panel p-2 overflow-hidden h-[60vh] sm:h-[80vh] min-h-[400px] sm:min-h-[600px] flex flex-col">
          <div className="flex-grow rounded-xl overflow-hidden border border-glass-border relative">
            <iframe
              src={`${assets.document}#toolbar=0`}
              title="Project Document"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-2 gap-1">
            <p className="text-xs sm:text-sm text-muted font-medium tracking-wide">Project Documentation (PDF)</p>
            <a
              href={assets.document}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-semibold"
            >
              Open in new tab ↗
            </a>
          </div>
        </div>
      )}

      {assets.image && (
        <div className="glass-panel p-2 overflow-hidden">
          <img
            src={assets.image}
            alt={`${title} screenshot`}
            loading="lazy"
            className="w-full h-auto rounded-xl shadow-lg border border-glass-border object-contain"
            style={{ maxHeight: '70vh' }}
          />
          <p className="text-center text-sm text-muted mt-3 mb-1 font-medium tracking-wide">Project Architecture / Screenshot</p>
        </div>
      )}
    </div>
  );
};

ProjectAssets.displayName = 'ProjectAssets';

export default ProjectAssets;
