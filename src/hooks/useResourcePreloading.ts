/**
 * React Hooks for Resource Preloading
 * 
 * Provides React hooks that integrate with the resource preloading system
 * and follow React 19 patterns for resource management.
 */

import { useEffect, useCallback, useMemo } from 'react';
import type { PreloadOptions, PreinitOptions } from '@/types/resourcePreloading';

/**
 * Hook to preload a single resource
 */
export function usePreload(href: string | null, options: PreloadOptions) {
  useEffect(() => {
    if (href) {
      import('@/lib/resourcePreloading').then(({ preload }) => {
        preload(href, options);
      });
    }
  }, [href, options.as, options.crossOrigin, options.type, options.fetchPriority]);
}

/**
 * Hook to preload multiple resources
 */
export function usePreloadResources(resources: Array<{ href: string; options: PreloadOptions }>) {
  useEffect(() => {
    if (resources.length > 0) {
      import('@/lib/resourcePreloading').then(({ preload }) => {
        resources.forEach(({ href, options }) => {
          preload(href, options);
        });
      });
    }
  }, [resources]);
}

/**
 * Hook to preinitialize a resource
 */
export function usePreinit(href: string | null, options: PreinitOptions) {
  useEffect(() => {
    if (href) {
      import('@/lib/resourcePreloading').then(({ preinit }) => {
        preinit(href, options);
      });
    }
  }, [href, options.as, options.crossOrigin, options.precedence]);
}

/**
 * Hook to prefetch DNS for domains
 */
export function usePrefetchDNS(domains: string[]) {
  useEffect(() => {
    if (domains.length > 0) {
      import('@/lib/resourcePreloading').then(({ prefetchDNS }) => {
        domains.forEach(domain => {
          prefetchDNS(domain);
        });
      });
    }
  }, [domains]);
}

/**
 * Hook to preconnect to domains
 */
export function usePreconnect(domains: string[], crossOrigin?: 'anonymous' | 'use-credentials') {
  useEffect(() => {
    if (domains.length > 0) {
      import('@/lib/resourcePreloading').then(({ preconnect }) => {
        domains.forEach(domain => {
          preconnect(domain, { crossOrigin });
        });
      });
    }
  }, [domains, crossOrigin]);
}

/**
 * Hook for route-based resource preloading
 * Preloads resources when a route is about to be navigated to
 */
export function useRoutePreloading(routeResources: Record<string, Array<{ href: string; options: PreloadOptions }>>) {
  const preloadForRoute = useCallback((route: string) => {
    const resources = routeResources[route];
    if (resources) {
      import('@/lib/resourcePreloading').then(({ preload }) => {
        resources.forEach(({ href, options }) => {
          preload(href, options);
        });
      });
    }
  }, [routeResources]);

  return { preloadForRoute };
}

/**
 * Hook for critical resource preloading
 * Preloads resources that are critical for the initial page load
 */
export function useCriticalResourcePreloading() {
  useEffect(() => {
    // Note: Fonts are now loaded from Google Fonts CDN, no need to preload local fonts

    // Preload critical images with proper types
    const isMobile = window.innerWidth <= 640;
    const heroImageSrc = isMobile
      ? '/lovable-uploads/HeroImage-400.png'
      : '/lovable-uploads/HeroImage.webp';
    const heroImageType = isMobile ? 'image/png' : 'image/webp';

    import('@/lib/resourcePreloading').then(({ preload, prefetchDNS, preconnect }) => {
      preload(heroImageSrc, {
        as: 'image',
        type: heroImageType,
        fetchPriority: 'high'
      });

      preload('/lovable-uploads/DatawiseLogo.webp', {
        as: 'image',
        type: 'image/webp',
        fetchPriority: 'high'
      });

      // Prefetch DNS for external domains (including Google Fonts)
      prefetchDNS('https://fonts.googleapis.com');
      prefetchDNS('https://fonts.gstatic.com');
      prefetchDNS('https://www.googletagmanager.com');
      
      // Preconnect to critical domains (including Google Fonts)
      preconnect('https://fonts.googleapis.com', { crossOrigin: 'anonymous' });
      preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' });
    });
  }, []);
}

/**
 * Hook for sportsbook logo preloading
 * Preloads sportsbook logos for the carousel
 */
export function useSportsbookLogoPreloading() {
  const logoUrls = useMemo(() => [
    '/sportsbook-logos/fanduel.webp',
    '/sportsbook-logos/draftkings.webp',
    '/sportsbook-logos/caesars.webp',
    // Removed non-existent bet365.webp
    '/sportsbook-logos/betmgm.webp',
    '/sportsbook-logos/espn.webp',
    '/sportsbook-logos/bovada.webp',
    '/sportsbook-logos/prizepicks.webp',
    '/sportsbook-logos/underdog.webp',
    '/sportsbook-logos/betonline.webp',
    '/sportsbook-logos/circa.webp',
    '/sportsbook-logos/betr.webp',
    '/sportsbook-logos/fliff.webp',
    '/sportsbook-logos/hardrock.webp'
  ], []);

  useEffect(() => {
    import('@/lib/resourcePreloading').then(({ preload }) => {
      // Preload first 6 logos immediately (above the fold)
      logoUrls.slice(0, 6).forEach(url => {
        preload(url, {
          as: 'image',
          fetchPriority: 'high'
        });
      });

      // Preload remaining logos with lower priority
      setTimeout(() => {
        logoUrls.slice(6).forEach(url => {
          preload(url, {
            as: 'image',
            fetchPriority: 'low'
          });
        });
      }, 1000);
    });
  }, [logoUrls]);
}

/**
 * Hook for blog content preloading
 * Preloads blog-related resources when navigating to blog pages
 */
export function useBlogContentPreloading() {
  const preloadBlogResources = useCallback(() => {
    import('@/lib/resourcePreloading').then(({ preload }) => {
      // Preload blog images
      preload('/lovable-uploads/blog_post_luck_in_betting.webp', {
        as: 'image',
        fetchPriority: 'low'
      });

      // Preload user avatars (commonly used in testimonials)
      const avatarUrls = [
        '/lovable-uploads/392Yoshi_avatar.webp',
        '/lovable-uploads/Joshienoya_avatar.webp',
        '/lovable-uploads/NightRyder_avatar.webp',
        '/lovable-uploads/SwaggaWaggon_avatar.webp',
        '/lovable-uploads/agxbets_avatar.webp'
      ];

      avatarUrls.forEach(url => {
        preload(url, {
          as: 'image',
          fetchPriority: 'low'
        });
      });
    });
  }, []);

  return { preloadBlogResources };
}

/**
 * Hook for performance monitoring
 * Provides access to preloading performance metrics
 */
export function usePreloadingPerformance() {
  const getPerformanceData = useCallback(async () => {
    const { getPreloadPerformanceSummary } = await import('@/lib/resourcePreloading');
    return getPreloadPerformanceSummary();
  }, []);

  return { getPerformanceData };
}

/**
 * Hook for intelligent resource preloading based on user behavior
 * Preloads resources based on hover, intersection, or other user signals
 */
export function useIntelligentPreloading() {
  const preloadOnHover = useCallback((resources: Array<{ href: string; options: PreloadOptions }>) => {
    return (event: React.MouseEvent) => {
      import('@/lib/resourcePreloading').then(({ preload }) => {
        resources.forEach(({ href, options }) => {
          preload(href, options);
        });
      });
    };
  }, []);

  const preloadOnIntersection = useCallback((
    resources: Array<{ href: string; options: PreloadOptions }>,
    threshold = 0.1
  ) => {
    return (element: HTMLElement | null) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              import('@/lib/resourcePreloading').then(({ preload }) => {
                resources.forEach(({ href, options }) => {
                  preload(href, options);
                });
              });
              observer.unobserve(element);
            }
          });
        },
        { threshold }
      );

      observer.observe(element);
      return () => observer.disconnect();
    };
  }, []);

  return { preloadOnHover, preloadOnIntersection };
}

/**
 * Hook for third-party script preloading
 * Manages preloading of analytics, tracking, and other third-party scripts
 */
export function useThirdPartyPreloading(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    import('@/lib/resourcePreloading').then(({ preload, preconnect }) => {
      // Preload Google Analytics
      preload('https://www.googletagmanager.com/gtag/js?id=G-9DJ3SPJRC7', {
        as: 'script',
        fetchPriority: 'low'
      });

      // Preload Netlify Identity Widget
      preload('https://identity.netlify.com/v1/netlify-identity-widget.js', {
        as: 'script',
        fetchPriority: 'low'
      });

      // Preconnect to analytics domains
      preconnect('https://www.google-analytics.com');
      preconnect('https://analytics.google.com');
    });
  }, [enabled]);
}
