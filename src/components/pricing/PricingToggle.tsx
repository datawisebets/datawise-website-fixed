
import { ToggleLeft, ToggleRight } from "lucide-react";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: () => void;
}

export const PricingToggle = ({ isYearly, onToggle }: PricingToggleProps) => {
  return (
    <div className="flex flex-col items-center mb-8 sm:mb-10 relative z-10">
      <div className="flex justify-center items-center gap-3 mb-1 sm:mb-2">
        <button 
          onClick={() => isYearly && onToggle()}
          className={`text-sm sm:text-base transition-colors duration-200 ${!isYearly ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-300'} cursor-pointer`}
          aria-label="Switch to monthly billing"
        >
          Monthly
        </button>
        <button 
          onClick={onToggle}
          className="relative inline-flex items-center cursor-pointer hover:opacity-90 transition-all duration-300"
          aria-label="Toggle billing cycle"
        >
          {isYearly ? (
            <ToggleRight className="w-10 h-10 text-gold transition-all duration-300 transform" />
          ) : (
            <ToggleLeft className="w-10 h-10 text-gray-400 transition-all duration-300 transform" />
          )}
          <span className="sr-only">{isYearly ? 'Switch to monthly billing' : 'Switch to yearly billing'}</span>
        </button>
        <div className="flex items-center">
          <button
            onClick={() => !isYearly && onToggle()}
            className={`text-sm sm:text-base transition-colors duration-200 ${isYearly ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-300'} cursor-pointer`}
            aria-label="Switch to yearly billing"
          >
            Yearly
          </button>
          {!isYearly && (
            <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full ml-2">
              Save $200
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
