
import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { 
  PricingToggle, 
  MonthlyPlanCard, 
  YearlyPlanCard, 
  PricingTitle, 
  PricingStyles 
} from "./pricing";
import SimpleTestimonial from "./testimonials/SimpleTestimonial";
import { simpleTestimonials } from "./testimonials/simpleTestimonialData";

// Memoized testimonial section to prevent unnecessary rerenders
const MemoizedTestimonialSection = memo(() => (
  <div className="mt-6 md:mt-10 max-w-3xl mx-auto">
    <h3 className="text-xl sm:text-2xl font-bold text-center mb-1 text-gold">
      What Our Members Say
    </h3>
    <SimpleTestimonial testimonials={simpleTestimonials} />
  </div>
));

MemoizedTestimonialSection.displayName = "MemoizedTestimonialSection";

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  return (
    <section id="pricing" className="container mx-auto px-4 py-12 sm:py-20 relative">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background blur effects removed for Safari performance */}
      </div>
      
      <PricingTitle />
      <PricingToggle isYearly={isYearly} onToggle={toggleBilling} />
      
      <div className="max-w-md mx-auto relative z-10">
        {!isYearly && <MonthlyPlanCard />}
        {isYearly && <YearlyPlanCard onSignup={() => {}} />}
      </div>

      <MemoizedTestimonialSection />

      {/* Legal and policy links */}
      <div className="mt-8 text-center text-xs sm:text-sm text-gray-400">
        <p className="mb-2">Cancel anytime. No questions asked.</p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <Link to="/return-policy" className="hover:text-gold transition-colors">
            30-Day Money Back Guarantee
          </Link>
          <span className="text-gray-600">•</span>
          <Link to="/terms-of-service" className="hover:text-gold transition-colors">
            Terms of Service
          </Link>
          <span className="text-gray-600">•</span>
          <Link to="/privacy-policy" className="hover:text-gold transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>

      <PricingStyles />
    </section>
  );
};

export default PricingSection;
