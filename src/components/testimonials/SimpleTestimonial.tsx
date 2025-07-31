import { useEffect, useState, memo, useCallback, useRef } from "react";
import { SimpleTestimonialData } from "./simpleTestimonialData";
import { Quote } from "lucide-react";

interface SimpleTestimonialProps {
  testimonials: SimpleTestimonialData[];
  autoRotateInterval?: number;
}

// Format name to show first name and first letter of last name with period
const formatName = (name: string) => {
  const nameParts = name.trim().split(' ');
  if (nameParts.length > 1) {
    return `${nameParts[0]} ${nameParts[1].charAt(0)}.`;
  }
  return name;
};

// Memoized testimonial content component to prevent unnecessary re-renders
const TestimonialContent = memo(({ content, name }: { content: string; name: string }) => (
  <>
    <p className="text-gray-200 text-sm sm:text-base italic mb-3 leading-relaxed line-clamp-4">
      "{content}"
    </p>
    <p className="text-gold font-medium text-sm">— {formatName(name)}</p>
  </>
));

TestimonialContent.displayName = "TestimonialContent";

const SimpleTestimonial = ({ 
  testimonials,
  autoRotateInterval = 5000 
}: SimpleTestimonialProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing timeouts to prevent memory leaks
  const clearRotationTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Set up auto-rotation with refs to avoid unnecessary re-renders
  const setupAutoRotation = useCallback(() => {
    clearRotationTimeout();
    
    timeoutRef.current = setTimeout(() => {
      if (!animatingRef.current) {
        animatingRef.current = true;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        
        // Reset animating flag after animation completes
        setTimeout(() => {
          animatingRef.current = false;
          setupAutoRotation();
        }, 500); // Match this with animation duration
      }
    }, autoRotateInterval);
  }, [testimonials.length, autoRotateInterval, clearRotationTimeout]);

  // Set up auto-rotation effect with proper cleanup
  useEffect(() => {
    setupAutoRotation();
    
    return () => {
      clearRotationTimeout();
    };
  }, [setupAutoRotation, clearRotationTimeout]);

  // Handle manual navigation
  const handleDotClick = useCallback((index: number) => {
    if (animatingRef.current || index === currentIndex) return;
    
    clearRotationTimeout();
    animatingRef.current = true;
    setCurrentIndex(index);
    
    // Reset animating flag after animation completes
    setTimeout(() => {
      animatingRef.current = false;
      setupAutoRotation();
    }, 500); // Match this with animation duration
  }, [currentIndex, clearRotationTimeout, setupAutoRotation]);

  return (
    <div className="relative overflow-hidden py-2 max-w-2xl mx-auto">
      <div className="absolute left-3 top-0 opacity-20">
        <Quote className="w-10 h-10 text-gold" />
      </div>
      
      <div className="min-h-[180px] flex items-center justify-center">
        {testimonials.map((testimonial, index) => (
          <div 
            key={`testimonial-${index}`}
            className={`text-center px-8 pt-2 w-full absolute inset-0 flex items-center justify-center transform smooth-fade ${
              index === currentIndex ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-8 -z-10"
            }`}
            aria-hidden={index !== currentIndex}
          >
            <div className="w-full">
              <TestimonialContent 
                content={testimonial.content} 
                name={testimonial.name} 
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-2 gap-1">
        {testimonials.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => handleDotClick(index)}
            className={`simple-testimonial-dot rounded-full ${
              index === currentIndex ? "bg-gold" : "bg-gray-600"
            }`}
            style={{
              width: '8px',
              height: '8px',
              minWidth: '8px',
              minHeight: '8px',
              fontSize: '0',
            }}
            aria-label={`View testimonial ${index + 1}`}
            disabled={animatingRef.current}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleTestimonial;
