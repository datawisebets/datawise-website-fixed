
import { ReactNode, memo } from "react";
import { motion, AnimationControls } from "framer-motion";

interface CarouselContainerProps {
  children: ReactNode;
  controls: AnimationControls;
}

// Custom comparison function for CarouselContainer
const arePropsEqual = (prevProps: CarouselContainerProps, nextProps: CarouselContainerProps) => {
  // Since children will always be the same array of logos (just animated),
  // we only need to check if the controls object has changed reference
  return prevProps.controls === nextProps.controls;
};

const CarouselContainer = ({ children, controls }: CarouselContainerProps) => {
  return (
    <div 
      className="container mx-auto overflow-hidden relative"
      style={{ 
        isolation: "isolate"
      }}
    >
      <div className="relative w-full flex items-center">
        <motion.div
          className="flex space-x-8 md:space-x-12 lg:space-x-16 items-center infinite-carousel"
          animate={controls}
          style={{ 
            WebkitFontSmoothing: "subpixel-antialiased",
            contain: "layout paint style",
            isolation: "isolate"
          }}
        >
          {children}
        </motion.div>
      </div>
      
      {/* Gradient fade effects removed for Safari performance */}
    </div>
  );
};

// Apply memo with custom comparison function
const MemoizedCarouselContainer = memo(CarouselContainer, arePropsEqual);

// Set displayName for debugging
MemoizedCarouselContainer.displayName = "CarouselContainer";

export default MemoizedCarouselContainer;
