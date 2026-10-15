import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import type { StatItem } from '../../assets/data/types';
import type { IconType } from 'react-icons';

interface StatCardProps {
  label: string;
  value: number;
  icon?: IconType | string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, index }) => {
  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center gap-6 group relative overflow-hidden">

      {Icon && (
        <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
          {typeof Icon === 'string' ? (
            <img src={Icon} alt={label} loading="lazy" width={48} height={48} className="w-12 h-12 object-contain" />
          ) : (
            <Icon className="w-12 h-12" />
          )}
        </div>
      )}
      <div className="flex flex-col items-center gap-1 relative z-10">
        <div className="text-gray-800 dark:text-white text-5xl font-bold transition-colors">
          <AnimatedCounter 
            value={value} 
            delay={0.2 + (index * 0.1)} 
            className="inline-block"
          />
          <span className="text-3xl ml-1 group-hover:text-primary transition-colors">+</span>
        </div>
        <span className="text-xs md:text-sm font-bold text-muted uppercase tracking-[0.2em] text-center mt-2 group-hover:text-text dark:group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
    </div>
  );
};

interface StatsSectionProps {
  title?: string;
  stats: StatItem[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ title, stats }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-16 mb-8 px-6">
      {title && (
        <h3 className="text-xl font-bold text-text mb-10 text-center md:text-left opacity-80 uppercase tracking-widest relative inline-block">
          {title}
          <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full md:block hidden" />
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            index={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
