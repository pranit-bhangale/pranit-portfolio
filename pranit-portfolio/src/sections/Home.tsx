import React from 'react';
import SectionWrapper from '../components/common/SectionWrapper';
import StatsSection from '../components/common/StatsSection';
import TypewriterText from '../components/common/TypewriterText';
import { useTypewriter } from '../hooks/useTypewriter';
import { motion } from 'framer-motion';
import { homeData } from '../assets/data/home';

const Home: React.FC = () => {
  const el = useTypewriter(homeData.typedStrings);

  return (
    <SectionWrapper id="home" className="min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-6 text-center">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 text-text">
            {homeData.greeting || "Hi, I'm"} <span className="text-primary">{homeData.name || "Pranit"}</span>
          </h1>
          <h3 className="text-lg sm:text-2xl md:text-3xl text-muted mb-12">
            <span ref={el} className="text-primary border-r-2 border-primary pr-1"></span>
          </h3>
        </motion.div>

        {/* About Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-16">
          {/* Text Column (LEFT) */}
          <div className="md:w-1/2 text-left space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl font-bold text-text mb-6"
            >
              {homeData.about.title}
            </motion.h2>

            <TypewriterText text={homeData.about.text} showCursor={false} />
          </div>

          {/* Image Column (RIGHT) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/3"
          >
            <div className="relative w-64 h-64 mx-auto glass-card p-2 rounded-full overflow-hidden flex items-center justify-center animate-float">
              <img
                src={homeData.heroImage || "https://plus.unsplash.com/premium_photo-1685086785636-2a1a0e5b591f?q=80&w=1932&auto=format&fit=crop"}
                alt={homeData.name || "Java Technology"}
                loading="eager"
                width={256}
                height={256}
                className="w-full h-full object-cover rounded-full opacity-90 transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/10 rounded-full mix-blend-overlay"></div>
            </div>
          </motion.div>
        </div>

        {/* Statistics Sections */}
        <div className="mt-20 space-y-12">
          <StatsSection title="Professional Impact" stats={homeData.professionalStats} />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Home;
