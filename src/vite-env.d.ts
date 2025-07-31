/// <reference types="vite/client" />

interface PostHogInstance {
  identify: (userId: string, userProperties?: Record<string, any>) => void;
  capture: (eventName: string, properties?: Record<string, any>) => void;
  register: (properties: Record<string, any>) => void;
  isFeatureEnabled: (flagName: string) => boolean;
  getFeatureFlag: (flagName: string) => boolean | string | undefined;
  onFeatureFlags: (callback: () => void) => void;
}

declare global {
  interface Window {
    posthog?: PostHogInstance;
    Whop?: {
      init?: () => void;
      mount?: () => void;
      scan?: () => void;
    };
  }
}

export {};
