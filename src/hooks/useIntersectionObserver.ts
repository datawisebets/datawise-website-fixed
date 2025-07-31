import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Custom hook for detecting when an element enters the viewport
 * @param options Intersection Observer API options
 * @returns [ref, isVisible] - Ref to attach to the element and boolean indicating if element is visible
 */
export function useIntersectionObserver(
  options: IntersectionObserverOptions = {
    root: null,
    rootMargin: '800px', // Very aggressive preloading for smooth scroll
    threshold: 0,
  }
): [RefObject<HTMLDivElement>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Once the element has been visible, we don't need to keep observing
    if (isVisible) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Make it more aggressive by triggering even with minimal visibility
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        setIsVisible(true);
        // Once the element is visible, we can stop observing it
        observer.disconnect();
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, options]);

  return [ref, isVisible];
}
