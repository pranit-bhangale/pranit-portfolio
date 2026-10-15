import { useEffect, useRef } from 'react';
import Typed, { type TypedOptions } from 'typed.js';

export const useTypewriter = (strings: string[], options: Partial<TypedOptions> = {}) => {
  const el = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!el.current) return;

    const typed = new Typed(el.current, {
      strings,
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
      ...options
    });

    return () => {
      typed.destroy();
    };
  }, [strings, options]);

  return el;
};
