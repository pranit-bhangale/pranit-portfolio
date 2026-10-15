import type { EducationItem, CertificationItem } from './types';

export const educationData: EducationItem[] = [
  {
    title: "Post Graduation in Advanced Computing (PG-DAC)",
    institution: "Institute of Emerging Technologies (IET)",
    period: "2025 - 2026"
  },
  {
    title: "Bachelor of Engineering in Electronics and Telecommunication Engineering (E&TC)",
    institution: "Savitribai Phule Pune University",
    period: "2021 - 2025"
  },
  {
    title: "Higher Secondary Education (12th - Science)",
    institution: "Maharashtra State Board",
    period: "2019 - 2021"
  },
  {
    title: "Secondary Education (10th)",
    institution: "Maharashtra State Board",
    period: "2018 - 2019"
  }
];

export const certificationData: CertificationItem[] = [
  {
    id: 1,
    title: "Post Graduation in Advanced Computing (PgDAC)",
    link: "/CDAC.jpeg",
    description: "Click to view certificate",
    aspectRatio: 1.414 // Standard A4 Aspect ratio constraint
  },
  {
    id: 2,
    title: "Fundamentals of Java Programming",
    link: "/FJP CQYSM9433FZG.jpg",
    description: "Click to view certificate",
    aspectRatio: 1.2941 // US Letter Format for Coursera Certificates
  }
];
