import React, { Suspense } from 'react';
import Home from '../sections/Home';

// Lazy load below-the-fold sections for performance
const Contact = React.lazy(() => import('../sections/Contact'));
const Skills = React.lazy(() => import('../sections/Skills'));
const Projects = React.lazy(() => import('../sections/Projects'));
const Qualification = React.lazy(() => import('../sections/Qualification'));
const Experience = React.lazy(() => import('../sections/Experience'));
const CodingAchievements = React.lazy(() => import('../sections/CodingAchievements'));
const Blog = React.lazy(() => import('../sections/Blog'));

const Portfolio: React.FC = () => {
  return (
    <>
      <Home />
      <Suspense fallback={<div className="min-h-[300px]" />}><Skills /></Suspense>
      <Suspense fallback={<div className="min-h-[400px]" />}><Projects /></Suspense>
      <Suspense fallback={<div className="min-h-[400px]" />}><Experience /></Suspense>
      <Suspense fallback={<div className="min-h-[300px]" />}><Qualification /></Suspense>
      <Suspense fallback={<div className="min-h-[300px]" />}><CodingAchievements /></Suspense>
      <Suspense fallback={<div className="min-h-[300px]" />}><Blog /></Suspense>
      <Suspense fallback={<div className="min-h-[300px]" />}><Contact /></Suspense>
    </>
  );
};

export default Portfolio;
