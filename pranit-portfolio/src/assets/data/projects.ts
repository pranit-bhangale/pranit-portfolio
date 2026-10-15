import portfolioWebsiteDesc from '../markdown/projects/portfolio-website.md?raw';
import habitTrackerDesc from '../markdown/projects/habit-tracker.md?raw';
import smartCleanerDesc from '../markdown/projects/smart-cleaner.md?raw';
import type { Project } from './types';

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Portfolio Website",
    category: "Web Development",
    description: "A professional personal portfolio built with React and Tailwind CSS, featuring glassmorphism design and smooth animations.",
    fullDescription: portfolioWebsiteDesc,
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
    features: [
      "Glassmorphism UI Design",
      "Responsive across all devices",
      "Smooth Framer Motion animations",
      "Decoupled data architecture (SOLID)"
    ],
    demoLink: "pranitbhangale.vercel.app"
  },
  {
    id: 2,
    title: "Habit Tracker Website",
    category: "Full Stack Web Development",
    description: "A scalable full-stack Habit Tracker application built with Spring Boot, Hibernate, and React, enabling users to build and maintain productive daily habits with real-time progress tracking and secure authentication.",
    fullDescription: habitTrackerDesc,
    techStack: ["React", "Spring Boot", "Hibernate (JPA)", "MySQL", "JWT Authentication"],
    features: [
      "User Authentication & Authorization (JWT-based)",
      "Create, Update, Delete Daily/Weekly Habits",
      "Real-time Habit Progress Tracking",
      "RESTful APIs with layered architecture (Controller-Service-Repository)",
      "Secure role-based access control",
      "Responsive UI with modern dashboard design"
    ],
    demoLink: "#"
  },
  {
    id: 3,
    title: "IoT-Based Smart Floor Cleaning Robot",
    category: "IoT",
    description: "Developed an IoT-based smart floor cleaning robot using ESP32 microcontroller and ultrasonic sensors for real-time obstacle detection and navigation.",
    fullDescription: smartCleanerDesc,
    techStack: ["ESP32", "ESP32-CAM", "Ultrasonic Sensor", "Motor Driver", "Blynk"],
    features: [
      "Real-time obstacle detection using ultrasonic sensor",
      "Live video streaming via ESP32-CAM",
      "Wireless control using Blynk IoT platform",
      "Autonomous navigation with motor driver integration",
      "WiFi-based communication system"
    ],
    demoAssets: {
      video: "/SFCB.mp4",
      document: "/SFCB.pdf",
      image: "/SFCB.jpeg"
    }
  }
];
