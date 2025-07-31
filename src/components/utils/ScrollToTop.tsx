import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls the window to the top
 * when the route changes or when the page is refreshed
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Scroll to top on page refresh
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };

    // Additional handler for when the page loads/reloads
    // Using modern Navigation Timing API instead of deprecated performance.navigation
    const navigationType = window.performance?.getEntriesByType('navigation')?.[0] as PerformanceNavigationTiming | undefined;
    if (navigationType?.type === 'reload') {
      // This is a page refresh
      window.scrollTo(0, 0);
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return null;
};

export default ScrollToTop;
