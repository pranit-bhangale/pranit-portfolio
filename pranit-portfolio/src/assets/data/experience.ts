import habitTrackerExp from '../markdown/experience/habit-tracker.md?raw';
import type { ExperienceItem } from './types';

export const experienceData: ExperienceItem[] = [
  {
    id: 1,
    company: "Habit Tracker – Production Deployed Full Stack Application",
    role: "Full Stack Developer",
    period: "Dec 2025 – Jan 2026",
    description: habitTrackerExp,
    techStack: ["React", "Spring Boot", "MySQL", "JWT", "Tailwind CSS", "Deployment"]
  }
];
