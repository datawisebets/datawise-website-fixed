
import { memo } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
}

// Format time with leading zeros
const formatTime = (value: number) => value.toString().padStart(2, '0');

// Memoize the component to prevent unnecessary rerenders
export const CountdownTimer = memo(({ hours, minutes, seconds }: CountdownTimerProps) => {
  return (
    <div className="flex justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-5">
      <div className="flex flex-col items-center">
        <div className="bg-black/30 px-2 py-1 sm:px-3 sm:py-2 rounded-md border border-white/5 font-mono text-lg sm:text-xl font-bold text-white">
          {formatTime(hours)}
        </div>
        <span className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">Hours</span>
      </div>
      <div className="text-white font-bold text-lg sm:text-xl flex items-center pb-4 sm:pb-5">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-black/30 px-2 py-1 sm:px-3 sm:py-2 rounded-md border border-white/5 font-mono text-lg sm:text-xl font-bold text-white">
          {formatTime(minutes)}
        </div>
        <span className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">Minutes</span>
      </div>
      <div className="text-white font-bold text-lg sm:text-xl flex items-center pb-4 sm:pb-5">:</div>
      <div className="flex flex-col items-center">
        <motion.div 
          className="bg-black/30 px-2 py-1 sm:px-3 sm:py-2 rounded-md border border-white/5 font-mono text-lg sm:text-xl font-bold text-white"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          {formatTime(seconds)}
        </motion.div>
        <span className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">Seconds</span>
      </div>
    </div>
  );
});

// Add display name for React DevTools
CountdownTimer.displayName = "CountdownTimer";
