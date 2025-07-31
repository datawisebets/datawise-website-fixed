
import { PlanFeatureList } from "./PlanFeatureList";
import { ArrowRight, Shield } from "lucide-react";
import { TrackedCTA } from "@/components/ui/TrackedCTA";

interface YearlyPlanCardProps {
  onSignup: () => void;
}

export const YearlyPlanCard = ({ onSignup }: YearlyPlanCardProps) => {
  
  const features = [
    "+EV Betting Software",
    "Daily Sharp Bets",
    "Real-time Alerts",
    "Profitable Community",
    "1 on 1 support",
    "Premium Discord Access"
  ];

  return (
    <div 
      key="yearly"
      className="bg-black/60 p-4 sm:p-6 md:p-8 relative rounded-2xl border-2 border-gold/40 overflow-hidden transition-colors duration-300 hover:border-gold/50 shadow-[0_8px_30px_rgba(255,215,0,0.1)]"
    >
      {/* "SAVE 33%" banner */}
      <div className="absolute top-0 left-0 bg-gold text-black px-4 py-1 rounded-br-lg text-xs font-bold shadow-lg z-20">
        SAVE 33%
      </div>
      
      {/* "Most Popular" flag */}
      <div className="absolute top-4 right-4 bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
        Most Popular
      </div>

      
      <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6 relative">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gold">Premium Annual</h3>
      </div>
      
      <div className="mb-1 relative">
        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">$399.99</span>
        <span className="text-xs sm:text-sm text-gray-400 ml-1">/year</span>
      </div>
      
      <div className="mb-2 text-base sm:text-lg md:text-xl font-semibold text-gold">
        Just $33.33/month when paid annually
      </div>
      
      <div className="mb-3 sm:mb-4 md:mb-6 relative flex items-center">
        <span className="text-xs sm:text-sm text-gray-400 line-through mr-2">$599.88</span>
        <span className="text-xs sm:text-sm bg-gold/20 text-gold px-2 py-0.5 rounded-full font-medium">Save $200 per year</span>
      </div>
      
      <TrackedCTA
        ctaLocation="pricing_section_yearly"
        ctaVariant="primary"
        planType="yearly"
        onClick={onSignup}
        className="block w-full py-2 sm:py-2.5 md:py-3 mb-3 sm:mb-4 md:mb-6 bg-gold hover:bg-gold/90 text-black font-medium rounded-xl text-center transition-colors btn-interactive relative group overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/20 animate-pulse rounded-lg"></span>
        <span className="relative text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5">
          Claim Best Value
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </TrackedCTA>

      <div className="flex flex-col items-center justify-center mb-4 text-xs text-center text-gray-400 space-y-1">
        <div className="flex items-center">
          <Shield className="w-3 h-3 text-gold mr-1.5" />
          <span>30-day money-back guarantee</span>
        </div>
        <span className="text-gray-500">Cancel anytime • No questions asked</span>
      </div>
      
      <div className="mb-2 text-xs text-center text-gray-300">
        <span>Trusted by 1,000+ bettors worldwide</span>
      </div>
      
      <PlanFeatureList features={features} highlightIndices={[0, 1]} />
    </div>
  );
};
