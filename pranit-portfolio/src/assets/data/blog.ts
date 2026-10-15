import javaFundamentals from '../markdown/blogs/java-fundamentals.md?raw';
import reactPerformance from '../markdown/blogs/react-performance.md?raw';
import cleanArchitecture from '../markdown/blogs/clean-architecture.md?raw';
import jvmArchitecture from '../markdown/blogs/jvm-architecture.md?raw';
import type { BlogPost } from './types';

export const blogData: BlogPost[] = [
  {
    id: 1,
    title: "Java Fundamentals",
    excerpt: "A complete guide to Java fundamentals, Object-Oriented Programming concepts, and SOLID principles for writing clean and maintainable code.",
    date: "Sep 01, 2025",
    tags: ["Java", "OOP", "SOLID"],
    content: javaFundamentals,
    link: "#"
  },
  {
    id: 2,
    title: "Optimizing React Application Performance",
    excerpt: "Learn how to significantly reduce re-renders and boost your React application's speed using memoization, lazy loading, and custom hooks.",
    date: "Nov 05, 2024",
    tags: ["React", "Performance", "Frontend"],
    content: reactPerformance,
    link: "#"
  },
  {
    id: 3,
    title: "The Power of Clean Architecture in Backend Systems",
    excerpt: "Exploring the principles of Clean Architecture and how separating concerns leads to highly maintainable, testable, and robust enterprise applications.",
    date: "Dec 20, 2024",
    tags: ["Architecture", "System Design", "Backend"],
    content: cleanArchitecture,
    link: "#"
  },
  {
    id: 4,
    title: "JVM Architecture: A Complete End-to-End Explanation",
    excerpt: "Deep dive into the JVM — Class Loader Subsystem, Delegation Principle, Runtime Memory Areas, Execution Engine, JIT Compiler, Garbage Collector, and JNI explained with code examples.",
    date: "Mar 23, 2026",
    tags: ["Java", "JVM", "Performance", "Architecture"],
    content: jvmArchitecture,
    link: "#"
  }
];
