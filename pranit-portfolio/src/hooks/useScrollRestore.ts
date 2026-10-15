import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollRestore = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Short delay to ensure layout is complete before scrolling
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      // No hash, default scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
};
