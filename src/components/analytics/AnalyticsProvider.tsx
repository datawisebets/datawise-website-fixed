import { useEffect } from 'react';
import { Analytics } from '@/utils/analytics';
import { validateAnalytics } from '@/utils/analyticsValidator';

// Helper function to set up error handlers
const setupErrorHandlers = (posthog: any) => {
  // Rate limiting for error reporting
  let errorCount = 0;
  const ERROR_LIMIT = 10;
  const resetInterval = setInterval(() => { errorCount = 0; }, 60000); // Reset every minute

  // Set up global error handlers with cleanup
  const errorHandler = (event: ErrorEvent) => {
    if (errorCount >= ERROR_LIMIT) return;
    errorCount++;
    
    const error = event.error || new Error(event.message);
    posthog.capture('$exception', {
      $exception_message: error.message?.substring(0, 500), // Limit message length
      $exception_type: error.name || 'Error',
      $exception_source: 'window_error',
      filename: event.filename?.replace(/^.*\//, ''), // Remove full paths for privacy
      lineno: event.lineno,
      colno: event.colno,
      stack: error.stack?.substring(0, 1000) // Limit stack trace length
    });
  };
  
  const rejectionHandler = (event: PromiseRejectionEvent) => {
    if (errorCount >= ERROR_LIMIT) return;
    errorCount++;
    
    let error;
    const { reason } = event;

    if (reason instanceof Error) {
      error = reason;
    } else {
      // Create a new error to generate a stack trace.
      // The message will indicate the type of the original rejection reason.
      let message = `Non-Error promise rejection. Reason: ${String(reason)}`;
      if (reason === undefined) {
          message = 'Promise rejected with undefined value. This often happens in third-party scripts or iframes.';
      } else if (reason === null) {
          message = 'Promise rejected with null value.';
      }
      error = new Error(message);
    }
    
    posthog.capture('$exception', {
      $exception_message: error.message?.substring(0, 500),
      $exception_type: 'UnhandledPromiseRejection',
      $exception_source: 'window_unhandledrejection',
      reason: String(reason)?.substring(0, 500),
      // The stack trace from the newly created Error object will be more useful.
      stack: error.stack?.substring(0, 1000)
    });
  };

  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', rejectionHandler);
  
  // Store cleanup function on the window
  (window as any).__posthogCleanup = () => {
    window.removeEventListener('error', errorHandler);
    window.removeEventListener('unhandledrejection', rejectionHandler);
    clearInterval(resetInterval);
  };
};

/**
 * Lazy-loaded analytics provider that initializes PostHog only when needed
 * This reduces the initial bundle size by ~188KB
 */
export const AnalyticsProvider = () => {
  useEffect(() => {
    // Only load analytics after main content has loaded
    const loadAnalytics = async () => {
      // Don't load analytics in development unless explicitly enabled
      if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_DEV_ANALYTICS) {
        return;
      }

      // Check if required environment variables are available
      const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
      const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

      if (!posthogKey || !posthogHost) {
        if (import.meta.env.DEV) {
          console.warn('PostHog environment variables not set. Analytics disabled.');
        }
        return;
      }

      try {
        // Check if PostHog is already loaded from HTML
        // PostHog adds __SV property when loaded
        if (window.posthog && (window.posthog as any).__SV) {
          if (import.meta.env.DEV) {
            console.log('PostHog already loaded from HTML');
          }
          
          // Wait for PostHog to be fully initialized
          const waitForInit = setInterval(() => {
            if (window.posthog && typeof window.posthog.capture === 'function') {
              clearInterval(waitForInit);
              // Set up error handlers for the existing instance
              setupErrorHandlers(window.posthog);
              
              // Capture initial pageview if not already done
              // Use window object to track pageview state
              if (!(window as any).__posthogPageviewCaptured) {
                window.posthog.capture('$pageview');
                (window as any).__posthogPageviewCaptured = true;
              }
            }
          }, 100);
          
          // Timeout after 5 seconds
          setTimeout(() => clearInterval(waitForInit), 5000);
          return;
        }

        // Dynamically import PostHog to keep it out of the main bundle
        const { default: posthog } = await import('posthog-js');

        // Initialize with optimized configuration
        posthog.init(
          posthogKey,
          {
            api_host: posthogHost,
            // Only enable debug in development
            debug: import.meta.env.DEV,
            // Disable automatic page view tracking - we'll do it manually
            autocapture: false,
            // Only load core features to reduce bundle size
            disable_session_recording: true,
            disable_persistence: false,
            // Use performance-optimized settings
            capture_pageview: false,
            capture_pageleave: false,
            // Privacy settings
            ip: false, // Don't collect IP addresses
            respect_dnt: true, // Respect Do Not Track
            property_blacklist: ['email', 'password', 'credit_card'],
            // Load callback
            loaded: (posthog) => {
              // Manually capture page view after initialization
              if (!(window as any).__posthogPageviewCaptured) {
                posthog.capture('$pageview');
                (window as any).__posthogPageviewCaptured = true;
              }

              // Set up error handlers
              setupErrorHandlers(posthog);

              if (import.meta.env.DEV) {
                console.log('PostHog loaded successfully with error tracking');
                
                // Run analytics validation in development
                setTimeout(async () => {
                  try {
                    await validateAnalytics(Analytics);
                  } catch (error) {
                    console.error('Analytics validation failed:', error);
                  }
                }, 1000); // Small delay to ensure everything is initialized
              }
            }
          }
        );
      } catch (error) {
        // Fail silently - analytics should not break the app
        if (import.meta.env.DEV) {
          console.error('Failed to load analytics:', error);
        }
      }
    };

    // Use requestIdleCallback to load analytics when browser is idle
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => loadAnalytics());
      return () => {
        cancelIdleCallback(handle);
        // Clean up error handlers if they were set up
        if ((window as any).__posthogCleanup) {
          (window as any).__posthogCleanup();
          delete (window as any).__posthogCleanup;
        }
      };
    } else {
      // Fallback: load after a delay
      const timer = setTimeout(loadAnalytics, 2000);
      return () => {
        clearTimeout(timer);
        // Clean up error handlers if they were set up
        if ((window as any).__posthogCleanup) {
          (window as any).__posthogCleanup();
          delete (window as any).__posthogCleanup;
        }
      };
    }
  }, []);

  return null;
};

export default AnalyticsProvider;