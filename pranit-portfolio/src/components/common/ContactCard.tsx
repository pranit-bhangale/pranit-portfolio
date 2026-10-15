import React from 'react';
import type { IconType } from 'react-icons';

interface ContactCardProps {
  icon: IconType;
  title: string;
  value: string;
  link: string;
  linkText: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon: Icon, title, value, link, linkText }) => {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
      <Icon className="text-2xl text-text mb-2" />
      <h4 className="text-text font-medium text-lg">{title}</h4>
      <p className="text-muted text-sm mb-4">{value}</p>
      <a
        href={link}
        target={link.startsWith('http') ? "_blank" : "_self"}
        rel={link.startsWith('http') ? "noopener noreferrer" : undefined}
        className="text-text text-sm flex items-center gap-1 hover:translate-x-1 transition-transform"
      >
        {linkText} <span className="text-lg">→</span>
      </a>
    </div>
  );
};

export default ContactCard;
