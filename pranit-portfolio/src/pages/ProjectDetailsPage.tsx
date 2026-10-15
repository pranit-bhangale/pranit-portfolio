import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsData } from '../assets/data/projects';
import { cardVariants } from '../constants/animations';
import ProjectAssets from '../components/projects/ProjectAssets';
import MarkdownRenderer from '../components/common/MarkdownRenderer';
import ProjectHeader from '../components/projects/ProjectHeader';
import ProjectSpecs from '../components/projects/ProjectSpecs';
import ProjectActions from '../components/projects/ProjectActions';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = useMemo(() => projectsData.find(p => p.id === (id ? parseInt(id, 10) : -1)), [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-text mb-4">Project Not Found</h2>
        <Link to="/#portfolio" className="text-primary hover:underline">
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <motion.article
      className="container mx-auto px-6 max-w-5xl py-24"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Link to="/#portfolio" className="inline-flex items-center text-primary text-sm font-bold uppercase tracking-widest mb-10 hover:opacity-80 transition-opacity group">
        <span className="mr-2 transform transition-transform group-hover:-translate-x-1">←</span> Back to Portfolio
      </Link>

      {/* Project Header */}
      <ProjectHeader title={project.title} category={project.category} />

      {/* Features and Tech Stack Grid */}
      <ProjectSpecs features={project.features} techStack={project.techStack} />

      {/* View Web Application Link (Fallback if no full description) */}
      {!project.fullDescription && (
        <ProjectActions demoLink={project.demoLink} className="mt-8 border-t border-glass-border pt-10" />
      )}

      {/* Markdown Detailed Information */}
      {project.fullDescription && (
        <div className="border-t border-glass-border pt-16">
          <MarkdownRenderer content={project.fullDescription} />

          {/* Final CTA link for rich content */}
          <ProjectActions 
            demoLink={project.demoLink} 
            className="mt-16 pt-10 border-t border-glass-border flex justify-center md:justify-start" 
          />
        </div>
      )}

      {/* Render any associated media assets */}
      <ProjectAssets assets={project.demoAssets} title={project.title} />

    </motion.article>
  );
};

export default ProjectDetailsPage;
