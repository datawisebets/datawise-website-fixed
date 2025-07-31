import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import {
  createAboveFoldLazyComponent,
  createBelowFoldLazyComponent,
  createDeferredLazyComponent
} from "@/components/utils/LazyLoader";

// Above-the-fold lazy components (aggressive preloading)
const LogoCarousel = createAboveFoldLazyComponent(() => import("@/components/logo-carousel"));
const FeaturesSection = createAboveFoldLazyComponent(() => import("@/components/FeaturesSection"));

// Below-the-fold lazy components (moderate preloading)
const HowItWorks = createBelowFoldLazyComponent(() => import("@/components/HowItWorks"));
const TestimonialsSection = createBelowFoldLazyComponent(() => import("@/components/TestimonialsSection"));
const PricingSection = createBelowFoldLazyComponent(() => import("@/components/PricingSection"));
const FAQ = createBelowFoldLazyComponent(() => import("@/components/FAQ"));

// Deferred lazy components (conservative preloading)
const CTA = createDeferredLazyComponent(() => import("@/components/CTA"));
const Footer = createDeferredLazyComponent(() => import("@/components/Footer"));

// Loading fallback component
const SectionFallback = ({ className = "" }: { className?: string }) => (
  <div className={`w-full bg-transparent ${className}`}>
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-3 bg-gray-800 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  </div>
);

export default function Index() {
  // State to handle scroll-to-section on hash change
  const [hashTarget, setHashTarget] = useState<string | null>(null);
  

  // Handle initial load and hash changes
  useEffect(() => {
    // Check if this is a page refresh using modern Navigation Timing API
    const isPageRefresh = window.performance && 
                         window.performance.getEntriesByType && 
                         window.performance.getEntriesByType('navigation').length > 0 &&
                         (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type === 'reload';
    
    if (isPageRefresh || !window.location.hash) {
      // On refresh or no hash, scroll to top and clear any hash
      window.scrollTo(0, 0);
      if (window.location.hash) {
        // Clear the hash without causing a page jump
        history.replaceState(null, '', window.location.pathname);
      }
    } else {
      // Only set hash target for actual navigation (not refresh)
      setHashTarget(window.location.hash.substring(1));
    }
    
    // Add hash change listener for navigation during the session
    const handleHashChange = () => {
      if (window.location.hash) {
        setHashTarget(window.location.hash.substring(1));
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle scrolling when hash target changes
  useEffect(() => {
    if (hashTarget) {
      // Slight delay to ensure React has fully rendered
      setTimeout(() => {
        const element = document.getElementById(hashTarget);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [hashTarget]);
  
  // Progressive loading is now handled by useProgressiveRender hook

  const faqs = [
    {
      question: "What type of subscriptions do you offer?",
      answer: "We offer monthly subscription access: $49.99 Monthly. Start with our 3-day free trial to experience the full power of Datawise before subscribing."
    },
    {
      question: "What sports do you cover?",
      answer: "We cover basically every sport imaginable. If we have an edge we will bet it. Football, Basketball, Baseball, Hockey, Tennis, MMA, Esports and much more."
    },
    {
      question: "What is the minimum bankroll required to use Datawise?",
      answer: "We recommend a minimum bankroll of $500 to fully utilize our platform. However, you can start with as little as $100 with adjusted unit sizes."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription anytime. Simply go to your account settings and select 'Cancel Subscription'. Your access will continue until the end of your billing period."
    },
    {
      question: "Why should I trust Datawise?",
      answer: "Our platform is built on transparent, data-driven analysis. We provide detailed insights on all picks and maintain a verifiable track record. Our models have been developed and tested over years of sports analysis."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Above-the-fold content - eagerly loaded */}
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />

        {/* Secondary above-fold content - loads quickly with new lazy system */}
        <Suspense fallback={<SectionFallback className="mt-2" />}>
          <LogoCarousel className="mt-2" />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FeaturesSection />
        </Suspense>

        {/* Below-the-fold content - optimized lazy loading */}
        <Suspense fallback={<SectionFallback />}>
          <HowItWorks id="how-it-works" />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <TestimonialsSection id="testimonials" />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PricingSection id="pricing" />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FAQ faqs={faqs} id="faq" />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTA id="call-to-action" />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer id="footer" />
      </Suspense>
    </div>
  );
};
