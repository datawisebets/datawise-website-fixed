import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { toast } from "sonner";
import { CountdownTimer } from "./CountdownTimer";
import { CountdownButton } from "./CountdownButton";
import { Analytics } from '@/utils/analytics';

interface CountdownPopupProps {
  initialTimeInHours: number;
  onClose: () => void;
  onStartTrial: () => void;
}

export const CountdownPopup = ({ initialTimeInHours, onClose, onStartTrial }: CountdownPopupProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Convert hours to milliseconds for calculation
  const calculateTimeLeft = useCallback(() => {
    // Get the stored end time or create a new one
    const storedEndTime = localStorage.getItem('trialOfferEndTime');
    const endTime = storedEndTime 
      ? parseInt(storedEndTime, 10)
      : Date.now() + (initialTimeInHours * 60 * 60 * 1000);
    
    // If we're creating a new end time, store it
    if (!storedEndTime) {
      localStorage.setItem('trialOfferEndTime', endTime.toString());
    }
    
    const difference = endTime - Date.now();
    
    if (difference <= 0) {
      // Offer expired
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }, [initialTimeInHours]);

  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update timer every second
    const timer = setInterval(() => {
      const calculated = calculateTimeLeft();
      setTimeLeft(calculated);

      // Check if timer has expired
      if (calculated.hours === 0 && calculated.minutes === 0 && calculated.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);


  const handleClose = () => {
    // First set the local state to start exit animation
    setIsVisible(false);
    // Wait for the exit animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleStartTrial = () => {
    // Prevent multiple clicks
    if (isRedirecting) return;
    
    setIsRedirecting(true);
    setIsVisible(false);
    
    // Track the redirect
    Analytics.trackEvent('checkout_redirect', {
      plan_type: 'exclusive',
      redirect_url: 'https://whop.com/checkout/plan_HWbsU2z2SEzH7?d2c=true',
      cta_location: 'countdown_popup',
      cta_text: 'Start Winning Today - 7 Day Trial',
    });
    
    toast.success("Extended 7-day trial initialized! Redirecting to signup...", {
      description: "You're getting our BEST trial offer - 7 full days of premium access!",
      duration: 5000,
    });
    
    onStartTrial();
    
    // Open immediately to avoid popup blockers
    window.open('https://whop.com/checkout/plan_HWbsU2z2SEzH7?d2c=true', '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-sm"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="glass-card p-3 sm:p-5 rounded-xl border border-white/10 bg-black/50 shadow-xl">
            {/* Decorative elements removed for Safari performance */}
            
            {/* Close button - Increased clickable area */}
            <button 
              onClick={handleClose}
              className="absolute top-0 right-0 sm:top-1 sm:right-1 text-gray-400 hover:text-white p-2 transition-colors z-20 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center cursor-pointer"
              aria-label="Close popup"
              type="button"
              style={{ touchAction: "manipulation" }}
            >
              <X size={18} className="sm:hidden" strokeWidth={2.5} />
              <X size={20} className="hidden sm:block" strokeWidth={2.5} />
            </button>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                <Clock className="text-gold w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="text-sm sm:text-base font-semibold text-white">EXCLUSIVE: 7-Day Free Trial</h3>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                Limited time offer: Get our <span className="text-gold font-medium">extended 7-day trial</span> instead of the standard 3 days. Unlock all premium features instantly!
              </p>
              
              {/* Timer display */}
              <CountdownTimer 
                hours={timeLeft.hours}
                minutes={timeLeft.minutes}
                seconds={timeLeft.seconds}
              />
              
              {/* CTA Button */}
              <CountdownButton onClick={handleStartTrial}>
                {isRedirecting ? 'Redirecting...' : 'Start Winning Today - 7 Day Trial'}
              </CountdownButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CountdownPopup;
