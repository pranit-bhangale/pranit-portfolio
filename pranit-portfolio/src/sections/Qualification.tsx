import React from 'react';
import { useNavigate } from 'react-router-dom';
import SectionWrapper from '../components/common/SectionWrapper';
import { FaGraduationCap, FaCertificate } from 'react-icons/fa';
import { educationData, certificationData } from '../assets/data/qualification';
import SectionHeader from '../components/common/SectionHeader';

const Qualification: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SectionWrapper id="qualification">
      <div className="container mx-auto px-6">
        <SectionHeader title="Qualification" subtitle="Experience & Education" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 max-w-5xl mx-auto">
          {/* Education Column */}
          <div>
            <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
              <FaGraduationCap className="text-white" /> Education
            </h3>
            <div className="space-y-8 border-l-2 border-white/20 pl-6 ml-2 relative">
              {educationData.map((edu, index) => (
                <div className="relative" key={index}>
                  <div className="absolute -left-[31px] top-1 w-4 h-4 bg-white rounded-full shadow-lg shadow-primary/20"></div>
                  <h4 className="text-lg font-bold text-text">{edu.title}</h4>
                  <p className="text-sm text-muted">{edu.institution}</p>
                  <span className="text-sm text-muted/80 block mt-1">{edu.period}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Column */}
          <div>
            <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
              <FaCertificate className="text-white" /> Certification
            </h3>
            <div className="space-y-6">
              {certificationData.map((cert) => (
                <div
                  key={cert.id}
                  className="glass-card p-4 cursor-pointer group relative overflow-hidden"
                  onClick={() => navigate(`/certification/${cert.id}`)}
                >
                  <h4 className="text-lg font-bold text-text relative z-10">{cert.title}</h4>
                  <p className="text-xs text-white mt-2 font-medium flex items-center gap-1 relative z-10 cursor-pointer hover:text-primary hover:underline transition-all duration-300">
                    {cert.description} <span>↗</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Qualification;
