import type { NavLink, SocialLink, PersonalInfo } from './types';

export const personalInfo: PersonalInfo = {
  name: 'Pranit Bhangale',
  firstName: 'Pranit',
  role: 'Backend Developer',
  resumeUrl: '/Pranit Bhangale.pdf',
};

export const navLinks: NavLink[] = [
  { name: 'Home', href: '/#home' },
  { name: 'Tech Stack', href: '/#skills' },
  { name: 'Projects', href: '/#portfolio' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Qualification', href: '/#qualification' },
  { name: 'Achievements', href: '/#achievements' },
  { name: 'Blog', href: '/#blog' },
  { name: 'Contact', href: '/#contact' },
];

export const socialLinks: SocialLink[] = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/pranit-bhangale-236474229/', type: 'linkedin' },
  { name: 'GitHub', href: 'https://github.com/PranitBhangale', type: 'github' },
  { name: 'Email', href: 'mailto:pranitbhangale14@gmail.com', type: 'email' },
];
