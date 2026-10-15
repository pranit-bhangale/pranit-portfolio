import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import InteractiveBackground from './components/layout/InteractiveBackground';
import Loader from './components/common/Loader';
import { useScrollRestore } from './hooks/useScrollRestore';

// Lazy load pages
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const ProjectDetailsPage = React.lazy(() => import('./pages/ProjectDetailsPage'));
const ExperienceDetailsPage = React.lazy(() => import('./pages/ExperienceDetailsPage'));
const CertificationDetailsPage = React.lazy(() => import('./pages/CertificationDetailsPage'));

const App: React.FC = () => {
  useScrollRestore(); // Handle scroll restoration

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans text-text transition-colors duration-300 relative">
      <InteractiveBackground />
      <ToastContainer />
      <Header />

      <main className="flex-grow pt-16 relative z-10">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/project/:id" element={<ProjectDetailsPage />} />
            <Route path="/experience/:id" element={<ExperienceDetailsPage />} />
            <Route path="/certification/:id" element={<CertificationDetailsPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
