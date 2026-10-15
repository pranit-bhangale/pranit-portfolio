import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { certificationData } from '../assets/data/qualification';
import { cardVariants } from '../constants/animations';

const CertificationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const certIndex = id ? parseInt(id, 10) : -1;
  const cert = useMemo(() => certificationData.find(c => c.id === certIndex) || (certIndex >= 0 && certIndex < certificationData.length ? certificationData[certIndex] : undefined), [certIndex]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!cert) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-text mb-4">Certification Not Found</h2>
        <Link to="/#qualification" className="text-primary hover:underline">
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  const isPdf = cert.link?.toLowerCase().endsWith('.pdf');

  return (
    <motion.article
      className="container mx-auto px-6 max-w-4xl py-24"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Link to="/#qualification" className="inline-flex items-center text-primary text-sm font-bold uppercase tracking-widest mb-10 hover:opacity-80 transition-opacity">
        <span className="mr-2 transform transition-transform group-hover:-translate-x-1">←</span> Back to Portfolio
      </Link>

      <header className="mb-12 border-b border-glass-border pb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-text dark:text-white mb-4 leading-tight">
          {cert.title}
        </h1>
        {cert.description && cert.description !== "Click to view certificate" && (
          <h2 className="text-xl font-semibold text-text/80 dark:text-zinc-200 mb-6">
            {cert.description}
          </h2>
        )}
      </header>

      <div className="flex items-center justify-center w-full mt-10">
        <div className="w-full relative glass-card p-4 sm:p-8 rounded-[2rem]">
          {isPdf ? (
            <div className="flex flex-col items-center w-full">
              <iframe
                src={`${cert.link}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                title={cert.title || "Certificate"}
                className="w-full bg-transparent border-none rounded-xl"
                style={{
                  height: '70vh',
                  maxHeight: '1000px',
                  minHeight: '400px'
                }}
              />
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                Open Certificate in New Tab ↗
              </a>
            </div>
          ) : (
            <img
              src={cert.link}
              alt={cert.title || "Certificate image"}
              className="w-full h-auto object-contain rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] pointer-events-none select-none mx-auto"
              style={{ maxHeight: '85vh' }}
            />
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default CertificationDetailsPage;
