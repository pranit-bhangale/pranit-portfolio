import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`text-center mb-10 sm:mb-16 ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-text to-text/60 dark:from-white dark:to-white/60 bg-clip-text text-transparent inline-block">
        {title}
      </h2>
      <div className="text-sm sm:text-base text-muted dark:text-gray-400">{subtitle}</div>
    </div>
  );
};

export default React.memo(SectionHeader);
