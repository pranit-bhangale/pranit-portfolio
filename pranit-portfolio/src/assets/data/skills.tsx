import { FaJs, FaJava, FaGitAlt, FaReact, FaDocker, FaAws, FaCube, FaGithub } from 'react-icons/fa';
import { SiSpring, SiSpringboot, SiHibernate, SiMysql, SiPostgresql, SiTailwindcss, SiPostman } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import type { SkillsData, SkillCategoryGroup } from './types';

export const skillsData: SkillsData = {
  coreTechnologies: [
    { name: 'Java', level: '', icon: <FaJava className="text-red-500 text-5xl mb-2" /> },
    { name: 'Data Structure', level: '', image: '/hierarchy-structure.png' },
    { name: 'OOPs', level: '', icon: <FaCube className="text-yellow-600 text-5xl mb-2" /> },
  ],
  frontend: [
    { name: 'JavaScript', level: '', icon: <FaJs className="text-yellow-400 text-5xl mb-2" /> },
    { name: 'React', level: '', icon: <FaReact className="text-cyan-400 text-5xl mb-2" /> },
    { name: 'Tailwind CSS', level: '', icon: <SiTailwindcss className="text-teal-400 text-5xl mb-2" /> },
  ],
  backend: [
    { name: 'Spring Boot', level: '', icon: <SiSpringboot className="text-green-500 text-5xl mb-2" /> },
    { name: 'Spring', level: '', icon: <SiSpring className="text-green-500 text-5xl mb-2" /> },
    { name: 'Hibernate', level: '', icon: <SiHibernate className="text-gray-400 text-5xl mb-2" /> },
  ],
  database: [
    { name: 'MySQL', level: '', icon: <SiMysql className="text-blue-500 text-5xl mb-2" /> },
    { name: 'PostgreSQL', level: '', icon: <SiPostgresql className="text-blue-400 text-5xl mb-2" /> },
  ],
  devops: [
    { name: 'Docker', level: '', icon: <FaDocker className="text-blue-500 text-5xl mb-2" /> },
    { name: 'AWS', level: '', icon: <FaAws className="text-orange-400 text-5xl mb-2" /> },
  ],
  tools: [
    { name: 'Git', level: '', icon: <FaGitAlt className="text-red-500 text-5xl mb-2" /> },
    { name: 'GitHub', level: '', icon: <FaGithub className="text-gray-400 text-5xl mb-2" /> },
    { name: 'Postman', level: '', icon: <SiPostman className="text-orange-600 text-5xl mb-2" /> },
    { name: 'IntelliJ IDEA', level: '', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/IntelliJ_IDEA_Icon.svg' },
    { name: 'VS Code', level: '', icon: <VscVscode className="text-blue-500 text-5xl mb-2" /> },
  ],
};

export const skillCategories: SkillCategoryGroup[] = [
  { title: 'Core Technologies', skills: skillsData.coreTechnologies },
  { title: 'Frontend', skills: skillsData.frontend },
  { title: 'Backend', skills: skillsData.backend },
  { title: 'Database', skills: skillsData.database },
  { title: 'DevOps', skills: skillsData.devops },
  { title: 'Tools', skills: skillsData.tools },
];
