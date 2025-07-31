/**
 * ResourcePreloader Component
 * 
 * Centralized component for managing resource preloading across the application.
 * Implements React 19-style resource preloading patterns.
 * 
 * React 19 Note: In React 19, you can call preload/preinit directly in components.
 * This implementation provides a compatible approach that works today.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useCriticalResourcePreloading,
  useSportsbookLogoPreloading,
  useThirdPartyPreloading,
  useRoutePreloading,
  usePrefetchDNS,
  usePreconnect
} from '@/hooks/useResourcePreloading';

// Route-specific resource configurations
const ROUTE_RESOURCES = {
  '/': [
    // Home page specific resources - responsive hero images
    { href: '/lovable-uploads/HeroImage.webp', options: { as: 'image' as const, fetchPriority: 'high' as const, type: 'image/webp' } },
    { href: '/lovable-uploads/HeroImage-400.png', options: { as: 'image' as const, fetchPriority: 'high' as const, type: 'image/png' } },
    { href: '/lovable-uploads/DatawiseLogo.webp', options: { as: 'image' as const, fetchPriority: 'high' as const, type: 'image/webp' } }
  ],
  '/blog': [
    // Blog page specific resources
    { href: '/lovable-uploads/blog_post_luck_in_betting.webp', options: { as: 'image' as const, fetchPriority: 'low' as const } }
  ],
  '/betting-simulator': [
    // Betting simulator specific resources - charts and interactive elements
    { href: '/lovable-uploads/feature_positive_ev_betting.webp', options: { as: 'image' as const, fetchPriority: 'low' as const } }
  ]
};

// Critical external domains that need DNS prefetching
const CRITICAL_DOMAINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://www.googletagmanager.com',
  'https://analytics.google.com',
  'https://identity.netlify.com',
  'https://cdn.gpteng.co'
];

// Domains that need preconnection (DNS + TCP + TLS)
const PRECONNECT_DOMAINS = [
  'https://fonts.gstatic.com',
  'https://www.googletagmanager.com'
];

interface ResourcePreloaderProps {
  /**
   * Whether to enable performance monitoring and logging
   */
  enablePerformanceMonitoring?: boolean;
  
  /**
   * Whether to preload route-specific resources on route change
   */
  enableRoutePreloading?: boolean;
  
  /**
   * Whether to preload third-party resources
   */
  enableThirdPartyPreloading?: boolean;
  
  /**
   * Custom domains to prefetch DNS for
   */
  customDomains?: string[];
}

export const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({
  enablePerformanceMonitoring = true,
  enableRoutePreloading = true,
  enableThirdPartyPreloading = true,
  customDomains = []
}) => {
  const location = useLocation();
  
  // Initialize critical resource preloading
  useCriticalResourcePreloading();
  
  // Initialize sportsbook logo preloading
  useSportsbookLogoPreloading();
  
  // Initialize third-party preloading - always call hook to avoid Rules of Hooks violation
  useThirdPartyPreloading(enableThirdPartyPreloading);
  
  // Setup DNS prefetching for critical domains
  usePrefetchDNS([...CRITICAL_DOMAINS, ...customDomains]);
  
  // Setup preconnections for critical domains
  usePreconnect(PRECONNECT_DOMAINS, 'anonymous');
  
  // Setup route-based preloading
  const { preloadForRoute } = useRoutePreloading(ROUTE_RESOURCES);
  
  // Handle route changes for preloading
  useEffect(() => {
    if (enableRoutePreloading) {
      preloadForRoute(location.pathname);
    }
  }, [location.pathname, preloadForRoute, enableRoutePreloading]);
  
  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring) return;
    
    // Log performance metrics after initial load
    const timer = setTimeout(() => {
      import('@/lib/resourcePreloading').then(({ getPreloadPerformanceSummary }) => {
        const summary = getPreloadPerformanceSummary();
        console.group('🚀 Resource Preloading Performance');
        console.log('Total resources:', summary.total);
        console.log('Completed:', summary.completed);
        console.log('Success rate:', `${(summary.successRate * 100).toFixed(1)}%`);
        console.log('Average load time:', `${summary.averageLoadTime.toFixed(2)}ms`);
        console.log('Preloaded resources:', summary.preloadedResources);
        console.log('Preinitialized resources:', summary.preinitializedResources);
        console.log('Prefetched domains:', summary.prefetchedDomains);
        console.groupEnd();
      });
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [enablePerformanceMonitoring]);
  
  // Intelligent preloading based on user behavior
  useEffect(() => {
    // Preload resources when user hovers over navigation links
    const handleLinkHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        const pathname = new URL(link.href).pathname;
        const resources = ROUTE_RESOURCES[pathname as keyof typeof ROUTE_RESOURCES];
        
        if (resources) {
          import('@/lib/resourcePreloading').then(({ preload }) => {
            resources.forEach(({ href, options }) => {
              preload(href, options);
            });
          });
        }
      }
    };
    
    // Add hover listeners to navigation elements
    document.addEventListener('mouseover', handleLinkHover);
    
    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
    };
  }, []);
  
  // Intersection-based preloading for below-the-fold content
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const preloadAttribute = element.getAttribute('data-preload');
          
          if (preloadAttribute) {
            try {
              const resources = JSON.parse(preloadAttribute);
              import('@/lib/resourcePreloading').then(({ preload }) => {
                resources.forEach(({ href, options }: { href: string; options: any }) => {
                  preload(href, options);
                });
              });
            } catch (error) {
              console.warn('Failed to parse preload data:', error);
            }
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });
    
    // Observe elements with data-preload attributes
    const preloadElements = document.querySelectorAll('[data-preload]');
    preloadElements.forEach(element => observer.observe(element));
    
    return () => observer.disconnect();
  }, [location.pathname]);
  
  // This component doesn't render anything - it's purely for side effects
  return null;
};

export default ResourcePreloader;
