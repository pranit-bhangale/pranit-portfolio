# Portfolio Website

A professional personal portfolio built with **React** and **Tailwind CSS**, featuring a modern **glassmorphism** design and smooth, interactive animations via **Framer Motion**.

---

## 🎨 Advanced UI Techniques
-   **Custom Glassmorphism:** Developed a custom set of Tailwind utilities for `backdrop-blur`, `bg-opacity`, and `border-opacity` to achieve a consistent "frosty" look across the app.
-   **Dynamic Theming:** Implemented a robust dark/light mode toggle with theme persistence using local storage and CSS variables.
-   **Micro-interactions:** Integrated magnetic button effects and subtle hover states to enhance user engagement and provide immediate feedback.

## 🚀 Performance Optimization
-   **Image Optimization:** Used modern formats (WebP) and responsive image sizes to minimize load times.
-   **Code Splitting:** Implemented lazy loading for heavy components and routes to reduce initial bundle size.
-   **Efficient Animations:** Leveraged Framer Motion's `layout` prop and `AnimatePresence` for smooth mounting/unmounting without layout shifts.

## 🛠️ Software Architecture (SOLID)
-   **Single Responsibility:** Each component (e.g., `ProjectCard`, `Terminal`, `Navbar`) is focused on a single piece of functionality.
-   **Open-Closed Principle:** The project detail system is open for extension (adding new MD files) but closed for modification of the core rendering logic.
-   **Interface Segregation:** Components receive only the specific data props they need, preventing unnecessary re-renders.

## 🌍 Accessibility & SEO
-   **Semantic HTML:** Used standard elements like `<main>`, `<section>`, and `<article>` for better screen reader support and SEO.
-   **ARIA Attributes:** Added descriptive ARIA labels to interactive elements and icons.
-   **SEO Best Practices:** Optimized meta tags, established a clear heading hierarchy (H1-H6), and ensured fast Time to Interactive (TTI).

---

## Project Conclusion

This portfolio serves as a live demonstration of modern web development best practices. By combining aesthetic excellence with a robust, scalable codebase, it reflects a commitment to delivering high-quality user experiences.
