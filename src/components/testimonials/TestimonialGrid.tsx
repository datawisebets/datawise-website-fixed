
import { TestimonialData } from "@/types/testimonial";
import { useEffect, useState, memo, useCallback } from "react";
import MobileTestimonialGrid from "./MobileTestimonialGrid";
import DesktopTestimonialGrid from "./DesktopTestimonialGrid";

interface TestimonialGridProps {
  visibleIndices: number[];
  testimonials: TestimonialData[];
}

const TestimonialGrid = ({ 
  visibleIndices, 
  testimonials
}: TestimonialGridProps) => {
  const [isMobile, setIsMobile] = useState(false);

  // Memoized check function to avoid recreation on each render
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Initial check
    checkIfMobile();
    
    // Add debounced resize listener for better performance
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkIfMobile, 200);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize, { passive: true } as any);
      clearTimeout(timeoutId);
    };
  }, [checkIfMobile]);

  if (isMobile) {
    return <MobileTestimonialGrid testimonials={testimonials} />;
  }

  // Desktop view
  return <DesktopTestimonialGrid testimonials={testimonials} />;
};

export default memo(TestimonialGrid);
