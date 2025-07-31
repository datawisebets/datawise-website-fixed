import FeatureCard from "@/components/FeatureCard";
import { DollarSign, Zap, Users, Headset, BarChart2, LineChart } from "lucide-react";
import { memo } from "react";
import { TrackedCTA } from "@/components/ui/TrackedCTA";

// Memoize the component to prevent unnecessary re-renders
const FeaturesSection = memo(() => {
  
  const features = [
    {
      title: "+EV Bets",
      icon: <DollarSign className="w-6 h-6 md:w-7 md:h-7" />,
      description: "Identify bets where the math is in your favor"
    },
    {
      title: "Real Time Alerts",
      icon: <Zap className="w-6 h-6 md:w-7 md:h-7" />,
      description: "Get mobile alerts for profitable opportunities"
    },
    {
      title: "Community",
      icon: <Users className="w-6 h-6 md:w-7 md:h-7" />,
      description: "Learn from successful bettors in our community"
    },
    {
      title: "1 on 1 Support",
      icon: <Headset className="w-6 h-6 md:w-7 md:h-7" />,
      description: "Expert guidance tailored to your betting strategy"
    },
    {
      title: "Odds Comparison",
      icon: <BarChart2 className="w-6 h-6 md:w-7 md:h-7" />,
      description: "Compare odds across major sportsbooks instantly"
    },
    {
      title: "Daily Sharp Bets",
      icon: <LineChart className="w-6 h-6 md:w-7 md:h-7" />,
      description: "Access curated picks from professional bettors"
    },
  ];

  const stats = [
    {
      value: "1,000+",
      label: "Active Members",
    },
    {
      value: "$1M+",
      label: "Generated Profit",
    },
    {
      value: "5-20%",
      label: "Average ROI Gains",
    }
  ];

  return (
    <section id="features" className="container mx-auto px-3 py-8 sm:py-10 md:py-14 relative">
      <div className="text-center mb-6 sm:mb-8 md:mb-10 relative z-10">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 sm:mb-2 md:mb-3 text-gold">
          Sports Betting Backed by Data
        </h2>
        <p className="text-xs sm:text-sm md:text-lg max-w-3xl mx-auto text-gray-300">
          Datawise takes the emotion out of sports betting. Achieve long term success with a statistical edge.
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 relative z-10 mb-8">
        {features.map((feature) => {
          const stableKey = feature.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          return (
            <FeatureCard 
              key={stableKey}
              title={feature.title} 
              icon={feature.icon} 
              description={feature.description}
            />
          );
        })}
      </div>

      {/* Stats Banner */}
      <div className="mt-8 bg-black/60 rounded-xl p-4 sm:p-5 border border-gold/10 relative">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
          {stats.map((stat) => {
            const stableKey = stat.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return (
              <div key={stableKey} className="text-center">
              <div className="text-gold text-lg sm:text-2xl md:text-4xl font-bold mb-0.5 sm:mb-1">
                {stat.value}
              </div>
              <div className="text-white text-xs sm:text-sm md:text-base font-semibold">
                {stat.label}
              </div>
            </div>
            );
          })}
        </div>

        <div className="text-gray-500 text-[10px] text-center italic mb-3">
          *Results vary based on bankroll size, bet selection, and market conditions. Past performance does not guarantee future results.
        </div>

        <div className="text-center">
          <TrackedCTA
            ctaLocation="features_section"
            ctaVariant="primary"
            planType="standard"
            ctaText="Start Your 3-Day Free Trial"
            className="bg-gold hover:bg-gold/90 text-black font-bold py-2 px-6 rounded-full text-sm md:text-base transition-all duration-300"
          >
            Start Your 3-Day Free Trial
          </TrackedCTA>
        </div>
      </div>
    </section>
  );
});

// Add display name for debugging
FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
