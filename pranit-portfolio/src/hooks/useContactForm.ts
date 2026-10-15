import { useState, type ChangeEvent, type FormEvent } from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const useContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending securely...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('Message securely sent!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus(`Failed to send: ${data.error || 'Unknown secure server error.'}`);
      }
    } catch (error) {
      console.error('Form Submission Error:', error);
      setStatus('Failed to send: Server might be unavailable or network error.');
    } finally {
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return {
    formData,
    status,
    handleChange,
    handleSubmit
  };
};
