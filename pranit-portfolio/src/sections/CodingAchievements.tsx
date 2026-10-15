import React from 'react';
import SectionWrapper from '../components/common/SectionWrapper';
import ScrollReveal from '../components/common/ScrollReveal';
import { codingAchievementsData } from '../assets/data/achievements';
import AnimatedCounter from '../components/common/AnimatedCounter';
import SectionHeader from '../components/common/SectionHeader';

const CodingAchievements: React.FC = () => {
  return (
    <SectionWrapper id="achievements">
      <ScrollReveal className="w-full max-w-5xl mx-auto px-6 mb-16">
        {/* Header */}
        <SectionHeader title="Achievements" subtitle="Coding Platforms" />

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {codingAchievementsData.map((achievement, index) => (
            <div
              key={achievement.id}
              title={`${achievement.platform} Stats`}
              className="glass-card p-8 flex flex-col items-center justify-center gap-6 relative z-10"
            >
              {/* Icon Free-floating */}
              <div className="flex items-center justify-center">
                {typeof achievement.icon === 'string' ? (
                  <img src={achievement.icon} alt={achievement.platform} loading="lazy" className="w-12 h-12 object-contain" />
                ) : (
                  <achievement.icon className="w-12 h-12" />
                )}
              </div>

              <div className="flex flex-col items-center gap-1">
                {/* Number and Label */}
                <div className="text-gray-800 dark:text-white text-5xl font-bold transition-colors">
                  <AnimatedCounter
                    value={achievement.count}
                    direction="up"
                    delay={0.1 + (index * 0.1)}
                    className="inline-block"
                  />
                  <span className="text-3xl ml-1 group-hover:text-primary transition-colors">+</span>
                </div>
                <span className="text-xs md:text-sm font-bold text-muted uppercase tracking-[0.2em] text-center mt-2 group-hover:text-text dark:group-hover:text-white transition-colors">
                  {achievement.platform} Solved
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
};

export default CodingAchievements;
