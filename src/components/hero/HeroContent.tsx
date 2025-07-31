import { ArrowRight } from "lucide-react";
import TestimonialSlider from "./TestimonialSlider";
import { TrackedCTA } from "@/components/ui/TrackedCTA";

interface HeroContentProps {
  currentTestimonialIndex: number;
  setCurrentTestimonialIndex: (index: number) => void;
  scrollToSection: (id: string) => void;
}

export default function HeroContent({
  currentTestimonialIndex,
  setCurrentTestimonialIndex,
  scrollToSection,
}: HeroContentProps) {
  
  return (
    <div className="w-full mx-0 sm:mx-auto md:mx-0 md:max-w-xl text-center md:text-left space-y-5 md:flex-1">
      <h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
      >
        <span className="text-gold">Stop Guessing, Start Winning:</span>{" "}
        Sports Betting{" "}
        <span className="text-gold">Backed by Data</span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed">
        Our tools and community of profitable bettors help turn sports betting
        into a reliable side income.
      </p>
      <div className="space-y-3">
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <span className="bg-gold/10 text-gold px-3 py-1 text-xs font-medium rounded-full border border-gold/20 shadow-[0_0_20px_rgba(247,197,72,0.15)]">
            Limited Time - 7 Day Trial
          </span>
        </div>
        <div className="flex flex-row gap-3 justify-center md:justify-start">
          <TrackedCTA
            ctaLocation="hero_section"
            ctaVariant="primary"
            planType="standard"
            className="btn-primary px-4 py-3 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center whitespace-nowrap flex-1 sm:flex-none sm:w-auto relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gold/20 rounded-lg"></span>
            <span className="relative flex items-center">
              <span className="sm:hidden">Start Free Trial</span>
              <span className="hidden sm:inline">Start Winning Today</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </TrackedCTA>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="btn-outline px-4 py-3 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap flex-1 sm:flex-none sm:w-auto"
          >
            Learn More
          </button>
        </div>
      </div>
      <TestimonialSlider
        currentTestimonialIndex={currentTestimonialIndex}
        setCurrentTestimonialIndex={setCurrentTestimonialIndex}
      />
    </div>
  );
}