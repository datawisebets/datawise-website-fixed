import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { testimonials } from "../testimonials/testimonialData";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

// Lazy load non-critical components
const BackgroundElements = lazy(() => import("./BackgroundElements"));
const CountdownPopup = lazy(() => import("../countdown").then(mod => ({ default: mod.CountdownPopup })));

const HeroSection = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  
  // State for deferred content rendering
  const [showBackground, setShowBackground] = useState(false);
  const [showTestimonialSlider, setShowTestimonialSlider] = useState(false);
  const [showCountdownTimer, setShowCountdownTimer] = useState(false);
  
  // Load background elements immediately
  useEffect(() => {
    setShowBackground(true);
    // Load testimonial slider after 100ms
    const sliderTimer = setTimeout(() => setShowTestimonialSlider(true), 100);
    // Enable countdown after 3 seconds
    const countdownTimer = setTimeout(() => setShowCountdownTimer(true), 3000);
    
    return () => {
      clearTimeout(sliderTimer);
      clearTimeout(countdownTimer);
    };
  }, []);

  
  // Testimonial slider logic with useRef for robust cleanup
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!showTestimonialSlider) return;
    
    // Simple 5s auto-slide for testimonials.
    intervalRef.current = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [showTestimonialSlider]);

  // Countdown popup logic
  useEffect(() => {
    if (!showCountdownTimer) return;

    // Show popup after delay
    const popupTimer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenTrialPopup');
      // Don't show popup if user has seen it before
      if (!hasSeenPopup) {
        setShowCountdown(true);
      }
    }, 8000);

    return () => {
      clearTimeout(popupTimer);
    };
  }, [showCountdownTimer]);

  // Simple scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartTrial = () => {
    localStorage.setItem('hasSeenTrialPopup', 'true');
  };

  const handleCloseCountdown = () => {
    localStorage.setItem('hasSeenTrialPopup', 'true');
    setShowCountdown(false);
  };

  return (
    <section className="relative w-full overflow-hidden px-0 sm:px-4 pt-24 pb-12 md:pt-36 md:pb-16">
      {/* Decorative background - lazy loaded */}
      {showBackground && (
        <Suspense fallback={null}>
          <BackgroundElements />
        </Suspense>
      )}

      <div className="container mx-auto px-4 sm:px-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-12">
          {/* The text content */}
          <HeroContent 
            currentTestimonialIndex={currentTestimonialIndex}
            setCurrentTestimonialIndex={setCurrentTestimonialIndex}
            scrollToSection={scrollToSection}
          />
          {/* Hero image - highest priority */}
          <HeroImage />
        </div>
      </div>

      {/* Delayed popup - Temporarily disabled */}
      {/* showCountdown && showCountdownTimer && (
        <Suspense fallback={null}>
          <CountdownPopup
            initialTimeInHours={0.25}
            onClose={handleCloseCountdown}
            onStartTrial={handleStartTrial}
          />
        </Suspense>
      ) */}
    </section>
  );
};

export default HeroSection;