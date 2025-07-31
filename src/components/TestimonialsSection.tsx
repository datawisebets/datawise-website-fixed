
import { useEffect, useReducer, useRef, useCallback } from "react";
import TestimonialGrid from "./testimonials/TestimonialGrid";
import TestimonialPagination from "./testimonials/TestimonialPagination";
import { testimonials } from "./testimonials/testimonialData";

const TESTIMONIALS_PER_PAGE = 4;
const ROTATION_INTERVAL = 15000; // Rotation interval for mobile auto-play

// State interface for testimonials component
interface TestimonialsState {
  visibleIndices: number[];
  isMobile: boolean;
}

// Action types for state management
type TestimonialsAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_PAGE'; pageIndex: number }
  | { type: 'SET_MOBILE'; isMobile: boolean };

// Initial state
const initialState: TestimonialsState = {
  visibleIndices: [0, 1, 2, 3],
  isMobile: false,
};

// Helper function to calculate new indices
const calculateIndices = (firstIndex: number): number[] => [
  firstIndex,
  (firstIndex + 1) % testimonials.length,
  (firstIndex + 2) % testimonials.length,
  (firstIndex + 3) % testimonials.length,
];

// Reducer function for centralized state management
function testimonialsReducer(state: TestimonialsState, action: TestimonialsAction): TestimonialsState {
  switch (action.type) {
    case 'NEXT': {
      const currentFirst = state.visibleIndices[0] ?? 0;
      const firstIndex = (currentFirst + TESTIMONIALS_PER_PAGE) % testimonials.length;
      return {
        ...state,
        visibleIndices: calculateIndices(firstIndex),
      };
    }
    case 'PREV': {
      const currentFirst = state.visibleIndices[0] ?? 0;
      const firstIndex = (currentFirst - TESTIMONIALS_PER_PAGE + testimonials.length) % testimonials.length;
      return {
        ...state,
        visibleIndices: calculateIndices(firstIndex),
      };
    }
    case 'SET_PAGE': {
      const firstIndex = (action.pageIndex * TESTIMONIALS_PER_PAGE) % testimonials.length;
      return {
        ...state,
        visibleIndices: calculateIndices(firstIndex),
      };
    }
    case 'SET_MOBILE': {
      return {
        ...state,
        isMobile: action.isMobile,
      };
    }
    default:
      return state;
  }
}

const TestimonialsSection = () => {
  const [state, dispatch] = useReducer(testimonialsReducer, initialState);
  const autoRotateTimeoutRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Check for mobile once on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      dispatch({ type: 'SET_MOBILE', isMobile: window.innerWidth < 768 });
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener with debounce
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkIfMobile, 200);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Memoized handlers using dispatch for centralized state management
  const handleNext = useCallback(() => {
    dispatch({ type: 'NEXT' });
  }, []);

  const handlePageClick = useCallback((pageIndex: number) => {
    dispatch({ type: 'SET_PAGE', pageIndex });
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    // Only auto-rotate on mobile
    if (!state.isMobile) return;
    
    // Clear any existing timeout
    if (autoRotateTimeoutRef.current) {
      clearTimeout(autoRotateTimeoutRef.current);
    }
    
    // Set up new timeout for continuous rotation
    autoRotateTimeoutRef.current = window.setTimeout(() => {
      handleNext();
    }, ROTATION_INTERVAL);
    
    // Cleanup
    return () => {
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
    };
  }, [state.isMobile, state.visibleIndices, handleNext]);

  return (
    <section 
      id="testimonials" 
      className="container mx-auto px-4 py-12 md:py-20 relative" 
      ref={sectionRef}
      style={{ 
        contain: 'paint layout style'
      }}
    >

      <div className="text-center mb-6 md:mb-8 relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-3 leading-tight">
          <span className="text-gold">Success Stories</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
          See how Datawise has helped bettors increase their profits and gain a competitive edge
        </p>
      </div>
      
      <TestimonialGrid 
        visibleIndices={state.visibleIndices}
        testimonials={testimonials}
      />
      
      {state.isMobile && (
        <TestimonialPagination 
          totalPages={Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE)}
          visibleIndices={state.visibleIndices}
          onPageClick={handlePageClick}
          testimonialsPerPage={TESTIMONIALS_PER_PAGE}
        />
      )}
    </section>
  );
};

export default TestimonialsSection;
