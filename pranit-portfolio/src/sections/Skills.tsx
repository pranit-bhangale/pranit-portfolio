import React from 'react';
import SectionWrapper from '../components/common/SectionWrapper';
import { skillCategories } from '../assets/data/skills';
import SectionHeader from '../components/common/SectionHeader';
import type { SkillItem } from '../assets/data/types';

interface SkillCategoryProps {
  title: string;
  skills: SkillItem[];
}

const SkillCategory: React.FC<SkillCategoryProps> = React.memo(({ title, skills }) => (
  <div className="mb-8 sm:mb-10 text-center">
    <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-primary uppercase tracking-wide">
      {title}
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
      {skills.map((skill) => (
        <div key={skill.name} className="p-3 sm:p-4 glass-card flex flex-col items-center justify-center cursor-default">
          {skill.icon ? (
            <div className="mb-2">{skill.icon}</div>
          ) : (
            <img src={skill.image} alt={skill.name} loading="lazy" className="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain" />
          )}
          <h4 className="text-xs sm:text-sm font-bold text-text text-center">{skill.name}</h4>
          <p className="text-[10px] sm:text-xs text-muted mt-1">{skill.level}</p>
        </div>
      ))}
    </div>
  </div>
));

SkillCategory.displayName = 'SkillCategory';

const Skills: React.FC = () => {
  const categories = skillCategories;

  return (
    <SectionWrapper id="skills">
      <div className="container mx-auto px-6">
        <SectionHeader title="Tech Stack" subtitle="Technical Proficiency" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {categories.map((cat, idx) => (
            <SkillCategory key={idx} title={cat.title} skills={cat.skills} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Skills;
