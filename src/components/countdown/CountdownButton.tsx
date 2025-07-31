
import { memo } from "react";
import { motion } from "framer-motion";
import { TrackedCTA } from "@/components/ui/TrackedCTA";

interface CountdownButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

// Memoize the button to prevent unnecessary rerenders
export const CountdownButton = memo(({ onClick, children }: CountdownButtonProps) => {
  return (
    <TrackedCTA
      ctaLocation="countdown_popup"
      ctaVariant="primary"
      planType="exclusive"
      ctaText={typeof children === 'string' ? children : 'Start Trial'}
      onClick={onClick}
      redirectToCheckout={false}
      className="w-full py-2 sm:py-2.5 bg-gold hover:bg-gold/90 text-black text-sm sm:text-base font-medium rounded-lg text-center transition-colors btn-interactive relative overflow-hidden group"
    >
      <motion.span 
        className="absolute inset-0 bg-white/20 rounded-lg"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ 
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      />
      <span className="relative">{children}</span>
    </TrackedCTA>
  );
});

// Add display name for React DevTools
CountdownButton.displayName = "CountdownButton";
