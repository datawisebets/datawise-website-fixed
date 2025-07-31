
import { PlanFeatureList } from "./PlanFeatureList";
import { ArrowRight, Shield } from "lucide-react";
import { TrackedCTA } from "@/components/ui/TrackedCTA";

export const MonthlyPlanCard = () => {
  
  const features = [
    "+EV Betting Software",
    "Daily Sharp Bets",
    "Real-time Alerts",
    "Profitable Community",
    "1 on 1 support",
    "Premium Discord Access (Limited)"
  ];

  return (
    <div 
      key="monthly"
      className="bg-black/60 p-4 sm:p-6 md:p-8 relative rounded-2xl border border-gray-800 overflow-hidden transition-colors duration-300 hover:border-gold/30"
    >
      
      <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6 relative">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gold">Premium Plan</h3>
        <span className="bg-gold text-black px-2 py-0.5 text-xs font-medium rounded-full shadow-[0_0_10px_rgba(255,215,0,0.3)]">
          3 Day Trial
        </span>
      </div>
      
      <div className="mb-3 sm:mb-4 md:mb-6 relative">
        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">$49.99</span>
        <span className="text-xs sm:text-sm text-gray-400 ml-1">/month</span>
      </div>
      
      <TrackedCTA
        ctaLocation="pricing_section_monthly"
        ctaVariant="primary"
        planType="monthly"
        className="block w-full py-2 sm:py-2.5 md:py-3 mb-3 sm:mb-4 md:mb-6 bg-gold hover:bg-gold/90 text-black font-medium rounded-xl text-center transition-colors btn-interactive relative group overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/20 animate-pulse rounded-lg"></span>
        <span className="relative text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5">
          Start 3-Day Free Trial Now
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </TrackedCTA>

      <div className="flex items-center justify-center mb-4 text-xs text-center text-gray-400">
        <Shield className="w-3 h-3 text-gold mr-1.5" />
        <span>Cancel anytime • No questions asked</span>
      </div>
      
      <div className="mb-2 text-xs text-center text-gray-300">
        <span>Trusted by 1,000+ bettors worldwide</span>
      </div>
      
      <PlanFeatureList features={features} highlightIndices={[0, 1]} />
    </div>
  );
};
