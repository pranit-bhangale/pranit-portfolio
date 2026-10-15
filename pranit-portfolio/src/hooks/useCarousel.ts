import { useState, useEffect, useCallback, useMemo } from 'react';

export function useCarousel<T>(items: T[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [itemsPerPage, setItemsPerPage] = useState(2);

  // Update items per page based on window size
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pagination logic
  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (items.length === 0) return 0;
      const nextIndex = prev + newDirection;
      if (nextIndex < 0) return items.length - 1;
      if (nextIndex >= items.length) return 0;
      return nextIndex;
    });
  }, [items.length]);

  // Handle direct dot navigation
  const navigateTo = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Dynamic Circular Slicing
  const visibleItems = useMemo(() => {
    if (items.length === 0) return [];
    const visible: T[] = [];
    for (let i = 0; i < Math.min(itemsPerPage, items.length); i++) {
      visible.push(items[(currentIndex + i) % items.length]);
    }
    return visible;
  }, [currentIndex, itemsPerPage, items]);

  return {
    currentIndex,
    direction,
    itemsPerPage,
    visibleItems,
    paginate,
    navigateTo
  };
}
