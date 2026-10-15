import React, { useCallback } from 'react';
import SectionWrapper from '../components/common/SectionWrapper';
import { useCarousel } from '../hooks/useCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { projectsData } from '../assets/data/projects';
import ScrollReveal from '../components/common/ScrollReveal';
import { slideVariants } from '../constants/animations';
import SectionHeader from '../components/common/SectionHeader';
import ProjectCard from '../components/projects/ProjectCard';
import type { Project } from '../assets/data/types';

const Projects: React.FC = () => {
  const projects = projectsData;
  const navigate = useNavigate();

  const {
    currentIndex,
    direction,
    visibleItems: visibleProjects,
    paginate,
    navigateTo
  } = useCarousel<Project>(projects);

  const handleOpenAsset = useCallback((e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    navigate(`/project/${project.id}`);
  }, [navigate]);

  return (
    <SectionWrapper id="portfolio">
      <ScrollReveal className="container mx-auto px-6 max-w-6xl relative">
        {/* Header */}
        <SectionHeader title="Projects" subtitle="Most recent Work" />

        <div className="relative group/carousel">
          {/* Navigation Arrows */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 p-2 text-text/60 hover:text-primary transition-all duration-300 md:opacity-40 group-hover/carousel:opacity-100 hidden md:block"
            aria-label="Previous project"
          >
            <BiChevronLeft size={48} />
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 p-2 text-text/60 hover:text-primary transition-all duration-300 md:opacity-40 group-hover/carousel:opacity-100 hidden md:block"
            aria-label="Next project"
          >
            <BiChevronRight size={48} />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden min-h-[520px] py-6 px-2 -my-4 -mx-2">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_e, { offset, velocity }) => {
                  if (offset.x < -50 || velocity.x < -200) {
                    paginate(1);
                  } else if (offset.x > 50 || velocity.x > 200) {
                    paginate(-1);
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-stretch cursor-grab active:cursor-grabbing"
              >
                {visibleProjects.map((project, idx) => (
                  <ProjectCard
                    key={`${currentIndex}-${project.id}-${idx}`}
                    project={project}
                    isActive={currentIndex === idx}
                    onClick={handleOpenAsset}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination & Responsive Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
          {/* Mobile Prev Arrow */}
          <button
            onClick={() => paginate(-1)}
            className="md:hidden p-2 rounded-xl glass-card text-text hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Previous project"
          >
            <BiChevronLeft size={22} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {projects.map((_, index) => {
              const isActive = currentIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => navigateTo(index)}
                  className="relative py-2 px-1 focus:outline-none group/dot cursor-pointer"
                  aria-label={`Go to project ${index + 1}`}
                >
                  <motion.div
                    animate={{
                      width: isActive ? 36 : 10,
                      backgroundColor: isActive ? "var(--primary)" : "rgba(255, 255, 255, 0.3)",
                      boxShadow: isActive ? "0 0 20px rgba(var(--primary-rgb), 0.4)" : "none"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="h-2 sm:h-2.5 rounded-full"
                  />
                </button>
              );
            })}
          </div>

          {/* Mobile Next Arrow */}
          <button
            onClick={() => paginate(1)}
            className="md:hidden p-2 rounded-xl glass-card text-text hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Next project"
          >
            <BiChevronRight size={22} />
          </button>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
};

export default Projects;
