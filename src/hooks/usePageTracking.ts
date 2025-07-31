import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics } from '@/utils/analytics';

interface PageTrackingOptions {
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  trackEngagement?: boolean;
}

export const usePageTracking = (options: PageTrackingOptions = {}) => {
  const {
    trackScrollDepth = true,
    trackTimeOnPage = true,
    trackEngagement = true,
  } = options;

  const location = useLocation();
  const pageLoadTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const engagementRef = useRef<boolean>(false);
  const lastPathRef = useRef<string>('');
  const trackedMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Only track if the path has changed
    if (currentPath === lastPathRef.current) {
      return;
    }
    
    // Track page exit from previous page
    if (lastPathRef.current && trackTimeOnPage) {
      const timeOnPage = Math.round((Date.now() - pageLoadTimeRef.current) / 1000);
      Analytics.trackEvent('page_exited', {
        path: lastPathRef.current,
        time_on_page_seconds: timeOnPage,
        max_scroll_depth: Math.round(maxScrollDepthRef.current),
        engaged: engagementRef.current,
      });
    }

    // Reset tracking variables for new page
    pageLoadTimeRef.current = Date.now();
    maxScrollDepthRef.current = 0;
    engagementRef.current = false;
    lastPathRef.current = currentPath;
    trackedMilestonesRef.current.clear();

    // Track page view
    Analytics.trackPageView(currentPath, {
      referrer: document.referrer,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      user_agent: navigator.userAgent,
      language: navigator.language,
      url: window.location.href,
      title: document.title,
    });

    // Track specific page sections
    const pageSection = getPageSection(currentPath);
    if (pageSection) {
      Analytics.trackEvent('section_viewed', {
        section: pageSection,
        path: currentPath,
      });
    }
  }, [location.pathname, trackTimeOnPage]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      
      if (scrollDepth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = scrollDepth;
        
        // Track milestone scroll depths
        const milestones = [25, 50, 75, 90, 100];
        for (const milestone of milestones) {
          // Check if we've reached this milestone and haven't tracked it yet
          if (maxScrollDepthRef.current >= milestone && !trackedMilestonesRef.current.has(milestone)) {
            trackedMilestonesRef.current.add(milestone);
            Analytics.trackEvent('scroll_milestone_reached', {
              milestone,
              path: location.pathname,
            });
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, trackScrollDepth]);

  // Track user engagement
  useEffect(() => {
    if (!trackEngagement) return;

    const engagementEvents = ['click', 'scroll', 'keydown', 'touchstart'];
    let engagementTimer: NodeJS.Timeout;

    const handleEngagement = () => {
      if (!engagementRef.current) {
        engagementRef.current = true;
        Analytics.trackEvent('user_engaged', {
          path: location.pathname,
          time_to_engage_seconds: Math.round((Date.now() - pageLoadTimeRef.current) / 1000),
        });
      }
      
      // Reset engagement timer
      clearTimeout(engagementTimer);
      engagementTimer = setTimeout(() => {
        engagementRef.current = false;
      }, 30000); // Consider user disengaged after 30 seconds of inactivity
    };

    engagementEvents.forEach(event => {
      window.addEventListener(event, handleEngagement, { passive: true });
    });

    return () => {
      engagementEvents.forEach(event => {
        window.removeEventListener(event, handleEngagement);
      });
      clearTimeout(engagementTimer);
    };
  }, [location.pathname, trackEngagement]);

  // Track page unload
  useEffect(() => {
    const handleUnload = () => {
      if (trackTimeOnPage) {
        const timeOnPage = Math.round((Date.now() - pageLoadTimeRef.current) / 1000);
        
        // Use sendBeacon for reliable tracking on page unload
        const data = {
          event: 'page_unloaded',
          properties: {
            path: location.pathname,
            time_on_page_seconds: timeOnPage,
            max_scroll_depth: Math.round(maxScrollDepthRef.current),
            engaged: engagementRef.current,
          },
        };
        
        // Attempt to send via beacon API
        if (navigator.sendBeacon && window.posthog) {
          navigator.sendBeacon('/api/analytics', JSON.stringify(data));
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [location.pathname, trackTimeOnPage]);
};

// Helper function to categorize pages into sections
function getPageSection(path: string): string | null {
  if (path === '/') return 'landing';
  if (path.startsWith('/guides/')) return 'guides';
  if (path === '/guides') return 'guides_index';
  if (path.startsWith('/blog/')) return 'blog';
  if (path === '/blog') return 'blog_index';
  if (path === '/simulator') return 'simulator';
  return null;
}