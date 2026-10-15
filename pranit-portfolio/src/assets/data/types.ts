import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';

export interface ProjectDemoAssets {
  video?: string;
  document?: string;
  image?: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  fullDescription?: string;
  techStack: string[];
  features?: string[];
  demoLink?: string;
  demoAssets?: ProjectDemoAssets;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  content?: string;
  link?: string;
}

export interface ExperienceItem {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  techStack: string[];
}

export interface EducationItem {
  title: string;
  institution: string;
  period: string;
}

export interface CertificationItem {
  id: number;
  title: string;
  link: string;
  description: string;
  aspectRatio?: number;
}

export interface ContactInfoItem {
  title: string;
  value: string;
  link: string;
  icon: IconType;
  linkText: string;
  type: 'email' | 'whatsapp' | string;
}

export interface CodingAchievement {
  id: number;
  platform: string;
  count: number;
  label: string;
  icon: string | IconType;
  link: string;
}

export interface StatItem {
  label: string;
  value: number;
  icon?: IconType | string;
  link?: string;
}

export interface HomeAbout {
  title: string;
  text: string;
}

export interface HomeData {
  greeting?: string;
  name?: string;
  heroImage?: string;
  typedStrings: string[];
  about: HomeAbout;
  professionalStats: StatItem[];
  codingStats: StatItem[];
}

export interface PersonalInfo {
  name: string;
  firstName: string;
  role: string;
  resumeUrl: string;
}

export interface NavLink {
  name: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  type: 'linkedin' | 'github' | 'email' | string;
}

export interface SkillItem {
  name: string;
  level: string;
  icon?: ReactNode;
  image?: string;
}

export interface SkillCategoryGroup {
  title: string;
  skills: SkillItem[];
}

export interface SkillsData {
  coreTechnologies: SkillItem[];
  frontend: SkillItem[];
  backend: SkillItem[];
  database: SkillItem[];
  devops: SkillItem[];
  tools: SkillItem[];
}
