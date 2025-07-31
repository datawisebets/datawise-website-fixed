import { usePageTracking } from '@/hooks/usePageTracking';

export const PageTracker = () => {
  // Enable all tracking features
  usePageTracking({
    trackScrollDepth: true,
    trackTimeOnPage: true,
    trackEngagement: true,
  });

  // This component doesn't render anything
  return null;
};