
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface PlanFeatureListProps {
  features: string[];
  highlightIndices?: number[];
}

export const PlanFeatureList = ({ features, highlightIndices = [] }: PlanFeatureListProps) => {
  return (
    <ul className="space-y-2 sm:space-y-3 md:space-y-4 relative text-xs sm:text-sm md:text-base">
      {features.map((feature, index) => {
        const isHighlighted = highlightIndices.includes(index);
        
        return (
          <motion.li 
            key={index}
            className="flex items-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
          >
            <div className="mr-2 sm:mr-3 mt-0.5 h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5 flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gold/20 rounded-full"></div>
              <Check className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5 text-gold relative z-10" />
            </div>
            <span className={isHighlighted ? "font-semibold" : ""}>{feature}</span>
          </motion.li>
        );
      })}
    </ul>
  );
};
