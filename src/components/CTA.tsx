import { ArrowRight } from "lucide-react";
import { TrackedCTA } from "@/components/ui/TrackedCTA";

const CTA = () => {
  const scrollToPrice = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-28">
      <div className="glass-card p-6 md:p-12 lg:p-16 relative overflow-hidden">
        
        {/* Decorative dot pattern */}
        <div className="absolute top-10 left-10 w-32 h-32 dot-pattern opacity-50 -z-10"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 dot-pattern opacity-50 rotate-45 -z-10"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gold">
            Transform Your Betting Strategy with Data
          </h2>
          <p className="text-xs sm:text-sm md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join 1,000+ bettors who've earned $1M+ in collective profits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <TrackedCTA
              ctaLocation="cta_section"
              ctaVariant="primary"
              planType="standard"
              className="btn-primary inline-flex items-center justify-center btn-interactive relative overflow-hidden group text-xs sm:text-sm py-2 sm:py-3 px-3 sm:px-5"
            >
              <span className="absolute inset-0 bg-gold/20 rounded-lg"></span>
              <span className="relative">
                Start Winning Today - 3 Day Free Trial
                <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 inline group-hover:translate-x-1 transition-transform" />
              </span>
            </TrackedCTA>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CTA;