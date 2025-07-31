
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to track scroll position and determine if the page has been scrolled past a threshold
 * Optimized for performance with throttling and passive listeners
 * @param threshold The scroll threshold in pixels
 * @returns Whether the user has scrolled past the threshold
 */
export const useScrollPosition = (threshold = 10) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const rafId = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    // Cancel any pending animation frame
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    // Use requestAnimationFrame for throttling
    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      
      // Only update state if we've crossed the threshold
      if ((lastScrollY.current <= threshold && currentScrollY > threshold) ||
          (lastScrollY.current > threshold && currentScrollY <= threshold)) {
        setIsScrolled(currentScrollY > threshold);
      }
      
      lastScrollY.current = currentScrollY;
    });
  }, [threshold]);

  useEffect(() => {
    // Initial check
    handleScroll();
    
    // Add passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll]);

  return isScrolled;
};
