
import { motion } from "framer-motion";

export const PricingTitle = () => {
  return (
    <div className="text-center mb-6 sm:mb-8 relative z-10">
      <motion.h2 
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-gold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Pricing
      </motion.h2>
      <motion.p 
        className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Make sports betting profitable. Join the 1% today.
      </motion.p>
    </div>
  );
};
