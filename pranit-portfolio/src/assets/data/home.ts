import {
  FcApproval,
  FcCommandLine,
  FcBusiness
} from "react-icons/fc";
import { codingAchievementsData } from "./achievements";
import type { HomeData } from "./types";

export const homeData: HomeData = {
  greeting: "Hi, I'm",
  name: "Pranit",
  heroImage: "https://plus.unsplash.com/premium_photo-1685086785636-2a1a0e5b591f?q=80&w=1932&auto=format&fit=crop",
  typedStrings: [
    'Java',
    'Spring Boot Developer',
    'AI Application Builder',
    'Generative AI Explorer',
    'Backend Systems Engineer',
    'Problem Solver',
    'Tech Enthusiast'
  ],
  about: {
    title: 'About',
    text: 'Backend Developer specializing in Java and Spring Boot, building scalable, secure, and production-ready RESTful APIs. I apply Clean Architecture, SOLID principles, and strong system design to create efficient and maintainable backend solutions. I’m also exploring AI agents and intelligent systems to develop smarter, future-ready applications.'
  },
  professionalStats: [
    { label: 'Completed Projects', value: 3, icon: FcApproval },
    { label: 'Industry Projects', value: 0, icon: FcCommandLine },
    { label: 'Companies Worked', value: 1, icon: FcBusiness },
  ],
  codingStats: codingAchievementsData.map((achievement) => ({
    label: `${achievement.platform} Solved`,
    value: achievement.count,
    icon: achievement.icon,
    link: achievement.link
  }))
};
