import { Button } from '@/components/ui/button';
import { Analytics } from '@/utils/analytics';
import { useEffect, useState, useRef } from 'react';
import { type VariantProps } from 'class-variance-authority';

// Twitter pixel type declaration
declare global {
  interface Window {
    twq: (action: string, eventId: string, params?: any) => void;
  }
}

interface TrackedCTAProps extends React.ComponentProps<typeof Button> {
  ctaLocation: string;
  ctaVariant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  planType?: 'standard' | 'exclusive' | 'yearly' | 'monthly';
  ctaText?: string;
  redirectToCheckout?: boolean;
}

export const TrackedCTA: React.FC<TrackedCTAProps> = ({
  children,
  ctaLocation,
  ctaVariant = 'primary',
  planType = 'standard',
  ctaText,
  redirectToCheckout = true,
  onClick,
  ...buttonProps
}) => {
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const pageLoadTime = useRef(Date.now());
  
  useEffect(() => {
    // Track time on page
    const interval = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - pageLoadTime.current) / 1000));
    }, 1000);
    
    // Track scroll depth
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const depth = Math.round((scrolled / (fullHeight - viewportHeight)) * 100);
      setScrollDepth(Math.min(100, Math.max(0, depth)));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Get initial scroll position
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track the CTA click with comprehensive data
    Analytics.trackEvent('cta_clicked', {
      // CTA specific data
      cta_location: ctaLocation,
      cta_text: ctaText || (typeof children === 'string' ? children : 'CTA'),
      cta_variant: ctaVariant,
      plan_type: planType,
      
      // Page context
      page_path: window.location.pathname,
      page_title: document.title,
      page_section: ctaLocation,
      
      // User engagement metrics
      time_on_page: timeOnPage,
      scroll_depth: scrollDepth,
      
      // Device and viewport
      device_type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      
      // Traffic source
      referrer: document.referrer,
      utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
      
      // Timestamp
      timestamp: new Date().toISOString(),
      
      // Performance metrics
      page_load_time: (() => {
        // Use modern Navigation Timing API instead of deprecated performance.timing
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
          const nav = navEntries[0];
          return Math.round(nav.loadEventEnd - nav.fetchStart);
        }
        return null;
      })(),
    });
    
    // Call original onClick if provided
    onClick?.(e);
    
    // Fire Twitter conversion tracking event - Begin Checkout
    if (window.twq) {
      try {
        window.twq('event', 'tw-odsbs-pqsql', {
          value: planType === 'yearly' ? 397 : 47,
          currency: 'USD',
          contents: [{
            content_type: 'product',
            content_id: planType,
            content_name: `Datawise ${planType} Plan`,
            content_price: planType === 'yearly' ? 397 : 47,
            num_items: 1,
            content_group_id: 'sports-betting-subscription'
          }],
          conversion_id: `${Date.now()}_${ctaLocation}`,
          email_address: null,
          phone_number: null
        });
      } catch (error) {
        console.error('Twitter pixel error:', error);
      }
    }
    
    // Only redirect to checkout if explicitly enabled
    if (redirectToCheckout) {
      // Use the new checkout URL for all plan types
      const checkoutUrl = 'https://whop.com/checkout/plan_HWbsU2z2SEzH7?d2c=true';
      
      // Track the checkout redirect
      Analytics.trackEvent('checkout_redirect', {
        plan_type: planType,
        redirect_url: checkoutUrl,
        cta_location: ctaLocation,
        cta_text: ctaText || (typeof children === 'string' ? children : 'CTA'),
        time_on_page: timeOnPage,
        scroll_depth: scrollDepth,
      });
      
      // Redirect to Whop checkout
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Map our ctaVariant to Button variant prop
  const buttonVariant = ctaVariant === 'primary' ? 'default' : ctaVariant;
  
  return (
    <Button 
      {...buttonProps} 
      onClick={handleClick} 
      variant={buttonVariant as VariantProps<typeof Button>['variant']}
      data-cta-location={ctaLocation}
      data-cta-variant={ctaVariant}
    >
      {children}
    </Button>
  );
};