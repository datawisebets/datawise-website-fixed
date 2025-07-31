
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "../testimonials/testimonialData";

interface TestimonialSliderProps {
  currentTestimonialIndex: number;
  setCurrentTestimonialIndex: (index: number) => void;
}

// Memoized testimonial content component for better performance
const TestimonialContent = memo(({ 
  testimonial, 
  index 
}: { 
  testimonial: typeof testimonials[0];
  index: number;
}) => (
  <motion.div
    key={`hero-testimonial-${index}`}
    className="absolute inset-0 flex items-center px-2.5 sm:px-4 py-1 sm:py-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1]
    }}
  >
    <div className="flex items-start space-x-2 sm:space-x-3 w-full">
      <motion.img 
        src={testimonial.avatar} 
        alt={testimonial.avatarAlt ?? `${testimonial.name}'s profile picture`}
        className="w-7 h-7 sm:w-10 sm:h-10 rounded-full ring-1 ring-white/10 flex-shrink-0 mt-0.5" 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <div className="flex-1 min-w-0 text-left">
        <motion.p 
          className="text-[0.65rem] sm:text-xs text-white/90 font-medium line-clamp-1 sm:line-clamp-2 leading-tight"
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          "{testimonial.content}"
        </motion.p>
        <div className="flex items-center justify-between mt-0.5 sm:mt-1">
          <motion.p 
            className="text-[0.6rem] sm:text-xs text-gray-400 truncate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {testimonial.name}
          </motion.p>
          <motion.span 
            className="text-[0.6rem] sm:text-xs font-semibold text-gold/90 ml-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            {testimonial.stats}
          </motion.span>
        </div>
      </div>
    </div>
  </motion.div>
));

TestimonialContent.displayName = "TestimonialContent";

const TestimonialSlider = ({ 
  currentTestimonialIndex, 
  setCurrentTestimonialIndex 
}: TestimonialSliderProps) => {
  return (
    <div className="relative h-[4.5rem] sm:h-16 overflow-hidden mt-2.5 sm:mt-4 rounded-lg sm:rounded-xl bg-black/20 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {testimonials.map((testimonial, index) => (
          currentTestimonialIndex === index && (
            <TestimonialContent 
              key={testimonial.name}
              testimonial={testimonial} 
              index={index} 
            />
          )
        ))}
      </AnimatePresence>
      
      {/* Navigation dots with improved hover effect */}
      <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5 sm:space-x-1">
        {testimonials.slice(0, 5).map((_, index) => (
          <motion.button
            key={`dot-${index}`}
            className={`testimonial-nav-dot rounded-full transition-colors duration-300 ${
              currentTestimonialIndex === index ? "bg-gold/80" : "bg-gray-600/50"
            }`}
            onClick={() => setCurrentTestimonialIndex(index)}
            aria-label={`View testimonial ${index + 1}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(TestimonialSlider);
