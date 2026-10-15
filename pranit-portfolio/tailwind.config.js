import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366F1', // Indigo - Main Brand
        'primary-dark': '#4F46E5', // Accent Hover
        text: '#1F1F2E', // Primary Dark Text
        muted: '#5B5F97', // Subtitle / Secondary Text
        // Glass white with opacity for "Invisible Box"
        'glass-white': 'rgba(255, 255, 255, 0.35)',
        'glass-border': 'rgba(255, 255, 255, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '18px', // Updated radius
        '4xl': '40px',
        '5xl': '50px',
        '6xl': '60px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(99, 102, 241, 0.12)', // Soft shadow with indigo tint
        'glass-hover': '0 8px 32px rgba(99, 102, 241, 0.20)',
        'glass-purple': '0 20px 80px rgba(99, 102, 241, 0.15), 0 0 40px rgba(99, 102, 241, 0.05)',
        'glass-purple-sm': '0 10px 40px rgba(99, 102, 241, 0.1)',
      },
    },
  },
  plugins: [
    typography,
  ],
};
