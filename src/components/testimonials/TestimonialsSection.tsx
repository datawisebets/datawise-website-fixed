
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TestimonialGrid from "./TestimonialGrid";
import TestimonialNavigation from "./TestimonialNavigation";
import TestimonialPagination from "./TestimonialPagination";
import { testimonials } from "./testimonialData";

const TESTIMONIALS_PER_PAGE = 3;

const TestimonialsSection = () => {
  const [visibleIndices, setVisibleIndices] = useState<number[]>([0, 1, 2]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setVisibleIndices(prev => {
      const newIndices = prev.map(index => (index + TESTIMONIALS_PER_PAGE) % testimonials.length);
      return newIndices;
    });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setVisibleIndices(prev => {
      const newIndices = prev.map(index => 
        (index - TESTIMONIALS_PER_PAGE + testimonials.length) % testimonials.length
      );
      return newIndices;
    });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handlePageClick = (pageIndex: number) => {
    setIsAnimating(true);
    const firstIndex = (pageIndex * TESTIMONIALS_PER_PAGE) % testimonials.length;
    setVisibleIndices([
      firstIndex,
      (firstIndex + 1) % testimonials.length,
      (firstIndex + 2) % testimonials.length
    ]);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section id="testimonials" className="container mx-auto px-4 py-24 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Background blur effects removed for Safari performance */}
      </div>

      <div className="text-center mb-20 relative z-10">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gold">Success Stories</span>
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          See how Datawise has helped bettors increase their profits and gain a competitive edge
        </motion.p>
      </div>
      
      <TestimonialNavigation 
        onPrev={handlePrev}
        onNext={handleNext}
        isAnimating={isAnimating}
      />
      
      <TestimonialGrid 
        visibleIndices={visibleIndices}
        testimonials={testimonials}
        isAnimating={isAnimating}
      />
      
      <TestimonialPagination 
        totalPages={Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE)}
        visibleIndices={visibleIndices}
        onPageClick={handlePageClick}
        isAnimating={isAnimating}
        testimonialsPerPage={TESTIMONIALS_PER_PAGE}
      />
    </section>
  );
};

export default TestimonialsSection;
