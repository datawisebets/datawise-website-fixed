
import { TrendingUp, Search, LayoutDashboard, Zap } from "lucide-react";
import { TrackedCTA } from "@/components/ui/TrackedCTA";

const HowItWorks = () => {
  
  const features = [
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />,
      title: "Positive Expected Value (EV) Betting",
      description: "Find bets where sportsbooks have underpriced odds, giving you a mathematical edge.",
      image: "/lovable-uploads/feature_positive_ev_betting.webp",
      alt: "Positive EV betting dashboard showing multiple betting opportunities"
    },
    {
      icon: <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />,
      title: "Props & DFS Analysis",
      description: "Our algorithm identifies the highest-value player props across major sportsbooks and DFS platforms.",
      image: "/lovable-uploads/feature_props_dfs_analysis.webp",
      alt: "Props and DFS analysis dashboard"
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />,
      title: "Game Lines & Spreads",
      description: "Find profitable betting opportunities on game spreads, totals, and moneylines across all major sports.",
      image: "/lovable-uploads/feature_game_lines_spreads.webp",
      alt: "Game lines and spreads dashboard showing EV percentages"
    },
    {
      icon: <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />,
      title: "DFS Discrepancies",
      description: "Spot major discrepancies across fantasy platforms, with specialized focus on eSports markets.",
      image: "/lovable-uploads/feature_dfs_discrepancies.webp",
      alt: "Discrepancies comparison showing different odds across sportsbooks"
    }
  ];

  return (
    <section id="how-it-works" className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Background decorative elements removed for Safari performance */}
      
      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="text-center mb-10 sm:mb-14 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 text-gold">
            How Datawise Works
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Find profitable betting opportunities with our data-driven platform
          </p>
        </div>
        
        <div className="space-y-12 sm:space-y-16 md:space-y-20 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="feature-container">
              <div className={`grid grid-cols-1 ${index % 2 === 0 ? 'lg:grid-cols-[1fr,1.5fr]' : 'lg:grid-cols-[1.5fr,1fr] lg:flex-row-reverse'} gap-6 sm:gap-8 lg:gap-12 items-center`}>
                
                <div className={`feature-content ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-black/30 border border-gold/20">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gold">{feature.title}</h3>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {index === 0 && (
                      <>
                        <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <span className="w-2 h-2 bg-gold rounded-full"></span>
                          <span>Spot profitable opportunities in seconds, not hours</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <span className="w-2 h-2 bg-gold rounded-full"></span>
                          <span>Know your exact mathematical advantage for every bet</span>
                        </li>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <span className="w-2 h-2 bg-gold rounded-full"></span>
                          <span>Compare player projections across multiple fantasy platforms</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <span className="w-2 h-2 bg-gold rounded-full"></span>
                          <span>Spot value in markets overlooked by bettors</span>
                        </li>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <span className="w-2 h-2 bg-gold rounded-full"></span>
                          <span>Leverage sharp sportsbooks to find profitable prop opportunities</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <span className="w-2 h-2 bg-gold rounded-full"></span>
                          <span>Quickly build winning player prop parlays and DFS slips</span>
                        </li>
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <span className="w-2 h-2 bg-gold rounded-full"></span>
                          <span>Real-time updates to capitalize on opportunities before they disapper</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                          <span className="w-2 h-2 bg-gold rounded-full"></span>
                          <span>Compare odds against Pinnacle to identify mispriced lines</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className={`feature-image ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  <div className="relative rounded-xl overflow-hidden border border-gold/20 shadow-lg group">
                    <img 
                      src={feature.image} 
                      alt={feature.alt} 
                      className="w-full h-auto object-cover rounded-xl" 
                    />
                    <div className="absolute inset-0 border-4 border-transparent group-hover:border-gold/20 rounded-xl transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 sm:mt-16">
          <TrackedCTA
            ctaLocation="how_it_works_section"
            ctaVariant="primary"
            planType="standard"
            ctaText="Start Your 3-Day Free Trial"
            className="px-6 py-3 bg-gold hover:bg-gold/90 text-black font-bold rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Start Your 3-Day Free Trial
          </TrackedCTA>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
