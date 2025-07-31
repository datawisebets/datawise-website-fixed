// Define proper types for each event type
type QueuedEvent = 
  | { type: 'track'; eventName: string; properties?: Record<string, any> }
  | { type: 'identify'; userId: string; userProperties?: Record<string, any> }
  | { type: 'setProperties'; properties: Record<string, any> };

// Event queue for events that are tracked before PostHog is loaded
const MAX_QUEUE_SIZE = 100;
const eventQueue: QueuedEvent[] = [];

// Process queued events when PostHog becomes available
const processEventQueue = () => {
  const posthog = window.posthog;
  if (!posthog || eventQueue.length === 0) return;
  
  eventQueue.forEach((event) => {
    switch (event.type) {
      case 'track':
        posthog.capture(event.eventName, event.properties);
        break;
      case 'identify':
        posthog.identify(event.userId, event.userProperties);
        break;
      case 'setProperties':
        posthog.register(event.properties);
        break;
    }
  });
  
  // Clear the queue after processing
  eventQueue.length = 0;
};

// Get PostHog instance if it's loaded
const getPostHog = () => {
  const posthog = window.posthog;
  
  // If PostHog just became available, process any queued events
  if (posthog && eventQueue.length > 0) {
    processEventQueue();
  }
  
  return posthog;
};

// User identification and properties
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  const posthog = getPostHog();
  if (posthog && userId) {
    posthog.identify(userId, userProperties);
  } else if (userId) {
    // Queue the event if PostHog isn't loaded yet
    const event: QueuedEvent = userProperties 
      ? { type: 'identify', userId, userProperties }
      : { type: 'identify', userId };
    // Prevent unbounded queue growth
    if (eventQueue.length >= MAX_QUEUE_SIZE) {
      eventQueue.shift(); // Remove oldest event
    }
    eventQueue.push(event);
  }
};

// Track specific events with properties
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  const posthog = getPostHog();
  if (posthog) {
    posthog.capture(eventName, properties);
  } else {
    // Queue the event if PostHog isn't loaded yet
    const event: QueuedEvent = properties 
      ? { type: 'track', eventName, properties }
      : { type: 'track', eventName };
    // Prevent unbounded queue growth
    if (eventQueue.length >= MAX_QUEUE_SIZE) {
      eventQueue.shift(); // Remove oldest event
    }
    eventQueue.push(event);
  }
};

// Capture exceptions using PostHog's $exception event
export const captureException = (error: Error | string, context?: Record<string, any>) => {
  const posthog = getPostHog();
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  if (posthog) {
    // Use PostHog's standard $exception event format
    posthog.capture('$exception', {
      $exception_message: errorObj.message,
      $exception_type: errorObj.name || 'Error',
      $exception_source: context?.source || 'manual',
      stack: errorObj.stack,
      ...context
    });
  } else {
    // Queue the exception for later if PostHog isn't loaded
    trackEvent('$exception', {
      $exception_message: errorObj.message,
      $exception_type: errorObj.name || 'Error',
      $exception_source: context?.source || 'manual',
      stack: errorObj.stack,
      ...context
    });
  }
};

// Common analytics events
export const Analytics = {
  // Generic event tracking
  trackEvent,
  
  // Exception tracking
  captureException,
  
  // User identification
  identifyUser,
  
  // Page tracking
  trackPageView: (path: string, properties?: Record<string, any>) => {
    trackEvent('$pageview', { 
      path,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      ...properties 
    });
  },
  
  // Content engagement events
  trackArticleView: (articleId: string, title: string, author: string, category: string) => {
    trackEvent('article_view', { article_id: articleId, title, author, category });
  },
  
  trackArticleRead: (articleId: string, title: string, readTimeSeconds: number, readPercentage: number) => {
    trackEvent('article_read', { 
      article_id: articleId, 
      title, 
      read_time_seconds: readTimeSeconds,
      read_percentage: readPercentage
    });
  },
  
  // User interaction events
  trackButtonClick: (buttonName: string, buttonLocation: string) => {
    trackEvent('button_click', { button_name: buttonName, location: buttonLocation });
  },
  
  trackLinkClick: (linkText: string, linkUrl: string, linkLocation: string) => {
    trackEvent('link_click', { link_text: linkText, url: linkUrl, location: linkLocation });
  },
  
  // Form interactions
  trackFormSubmit: (formName: string, formLocation: string, success: boolean) => {
    trackEvent('form_submit', { form_name: formName, location: formLocation, success });
  },
  
  trackFormFieldInteraction: (formName: string, fieldName: string, action: 'focus' | 'blur' | 'change') => {
    trackEvent('form_field_interaction', { form_name: formName, field_name: fieldName, action });
  },
  
  // Betting simulator events
  trackSimulationStart: (parameters: Record<string, any>) => {
    trackEvent('simulation_start', parameters);
  },
  
  trackSimulationComplete: (parameters: Record<string, any>, results: Record<string, any>) => {
    trackEvent('simulation_complete', { ...parameters, ...results });
  },
  
  // User journey
  trackUserSignUp: (method: string) => {
    trackEvent('user_sign_up', { method });
  },
  
  trackUserLogIn: (method: string) => {
    trackEvent('user_log_in', { method });
  },
  
  // Feature usage
  trackFeatureUsage: (featureName: string, details?: Record<string, any>) => {
    trackEvent('feature_used', { feature_name: featureName, ...details });
  },
  
  // Errors and issues (legacy method - use captureException for better error tracking)
  trackError: (errorType: string, errorMessage: string, errorContext?: Record<string, any>) => {
    // Use captureException for better error tracking
    captureException(new Error(errorMessage), {
      error_type: errorType,
      ...errorContext
    });
  }
};

// Set global properties that will be sent with every event
export const setGlobalProperties = (properties: Record<string, any>) => {
  const posthog = getPostHog();
  if (posthog) {
    posthog.register(properties);
  } else {
    // Queue the properties if PostHog isn't loaded yet
    // Prevent unbounded queue growth
    if (eventQueue.length >= MAX_QUEUE_SIZE) {
      eventQueue.shift(); // Remove oldest event
    }
    eventQueue.push({ type: 'setProperties', properties });
  }
};

// Manage feature flags
// Legacy synchronous method - may return false if flags haven't loaded
export const isFeatureEnabled = (flagName: string) => {
  const posthog = getPostHog();
  return posthog ? posthog.isFeatureEnabled(flagName) : false;
};

// Promise-based method that waits for feature flags to load
export const getFeatureFlag = async (flagName: string): Promise<boolean | string | undefined> => {
  // Wait for PostHog to be available
  const waitForPostHog = async (timeout = 10000): Promise<typeof window.posthog | null> => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const posthog = getPostHog();
      if (posthog) {
        // Wait a bit more to ensure flags are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        return posthog;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return null;
  };
  
  const posthog = await waitForPostHog();
  if (!posthog) {
    if (import.meta.env.DEV) {
      console.warn(`Feature flag '${flagName}' check timed out - PostHog not loaded`);
    }
    return undefined;
  }
  
  // Use PostHog's onFeatureFlags callback to ensure flags are loaded
  return new Promise((resolve) => {
    posthog.onFeatureFlags(() => {
      resolve(posthog.getFeatureFlag(flagName));
    });
    
    // In case flags are already loaded, check immediately
    const currentValue = posthog.getFeatureFlag(flagName);
    if (currentValue !== undefined) {
      resolve(currentValue);
    }
  });
};

// Callback-based method for reactive feature flag updates
export const onFeatureFlag = (
  flagName: string, 
  callback: (enabled: boolean | string | undefined) => void
): (() => void) => {
  let cleanup: (() => void) | null = null;
  
  const setupListener = async () => {
    // Wait for PostHog to be available
    const posthog = await new Promise<typeof window.posthog | null>((resolve) => {
      const checkPostHog = () => {
        const ph = getPostHog();
        if (ph) {
          resolve(ph);
        } else {
          setTimeout(checkPostHog, 100);
        }
      };
      checkPostHog();
      
      // Timeout after 10 seconds
      setTimeout(() => resolve(null), 10000);
    });
    
    if (!posthog) return;
    
    // Set up listener for feature flag changes
    const handleFlagChange = () => {
      const value = posthog.getFeatureFlag(flagName);
      callback(value);
    };
    
    // Listen for flag updates
    posthog.onFeatureFlags(handleFlagChange);
    
    // Get initial value
    handleFlagChange();
    
    // Return cleanup function
    cleanup = () => {
      // PostHog doesn't provide a way to remove specific listeners
      // so we'll just flag this as cleaned up
      cleanup = null;
    };
  };
  
  setupListener();
  
  // Return cleanup function
  return () => {
    if (cleanup) cleanup();
  };
};

export default Analytics;
