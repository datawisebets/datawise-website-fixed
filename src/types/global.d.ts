// Global type declarations for analytics and other window objects

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId?: string,
      config?: Record<string, any>
    ) => void;
    posthog?: {
      capture: (eventName: string, properties?: Record<string, any>) => void;
      identify: (userId: string, properties?: Record<string, any>) => void;
      init: (apiKey: string, config?: Record<string, any>) => void;
      register: (properties: Record<string, any>) => void;
      isFeatureEnabled: (featureName: string) => boolean;
      getFeatureFlag: (featureName: string) => boolean | string | undefined;
      onFeatureFlags: (callback: () => void) => void;
      [key: string]: any;
    };
    WhopCheckout?: {
      init: () => void;
    };
  }
}

export {};