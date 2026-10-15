import { BiEnvelope, BiLogoWhatsapp } from 'react-icons/bi';
import type { ContactInfoItem } from './types';

export const contactInfo: ContactInfoItem[] = [
  {
    title: "Email",
    value: "pranitbhangale14@gmail.com",
    link: "mailto:pranitbhangale14@gmail.com",
    icon: BiEnvelope,
    linkText: "Write me",
    type: "email"
  },
  {
    title: "WhatsApp",
    value: "7875952807",
    link: "https://wa.me/917875952807",
    icon: BiLogoWhatsapp,
    linkText: "Write me",
    type: "whatsapp"
  }
];
