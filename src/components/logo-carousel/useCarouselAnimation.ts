
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useAnimation } from "framer-motion";
import logoData from "./logoData";

interface UseCarouselAnimationProps {
  speed?: number;
}

const useCarouselAnimation = ({ speed = 30 }: UseCarouselAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true); // Default to true to start instantly
  const controls = useAnimation();
  const animationStarted = useRef(false);
  
  // Memoize the duplicated logos to prevent recreation on every render
  const dupeLogos = useMemo(() => [
    ...logoData, ...logoData, ...logoData, 
    ...logoData, ...logoData, ...logoData
  ], []);
  
  // Memoize animation duration calculation
  const animationDuration = useMemo(() => {
    return logoData.length * 3 * (100 / speed);
  }, [speed]);
  
  // Create memoized animation start handler
  const startAnimation = useCallback(() => {
    // Only start animation if it hasn't been started yet
    if (!animationStarted.current) {
      controls.start({
        x: [`0%`, `-${100 / 6}%`], // Adjusted for 6x repeated logos
        transition: {
          x: {
            duration: animationDuration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }
        }
      });
      animationStarted.current = true;
    }
  }, [controls, animationDuration]);
  
  // React 19 ref callback with cleanup function
  const carouselRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // Setup: Create observer when ref is attached
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
          
          if (entry.isIntersecting && !animationStarted.current) {
            startAnimation();
          }
        },
        { 
          threshold: 0.01,
          rootMargin: "1000px 0px 1000px 0px"
        }
      );
      
      observer.observe(node);
      
      // React 19: Return cleanup function
      return () => {
        observer.unobserve(node);
        observer.disconnect();
      };
    }
  }, [startAnimation]);
  
  useEffect(() => {
    // Start animation immediately on mount
    startAnimation();
    
    // Handle visibility change events for background tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When returning to tab, check if we need to restart the animation
        // but don't reset it if it's already running
        if (!animationStarted.current) {
          startAnimation();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startAnimation]);

  return {
    carouselRef,
    controls,
    dupeLogos,
    isVisible
  };
};

export default useCarouselAnimation;
