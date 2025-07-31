import { Page } from 'puppeteer';

export interface MockedAnalyticsCall {
  type: 'track' | 'identify' | 'page' | 'exception' | 'beacon';
  timestamp: number;
  eventName?: string;
  userId?: string;
  properties?: Record<string, any>;
  path?: string;
  url?: string;
  data?: any;
}

// This function will be injected into the browser context
const mockInjector = () => {
  // Store all analytics calls
  (window as any).mockedAnalyticsCalls = [];
  
  // Mock PostHog
  (window as any).posthog = {
    capture: (eventName: string, properties?: Record<string, any>) => {
      (window as any).mockedAnalyticsCalls.push({
        type: 'track',
        eventName,
        properties,
        timestamp: Date.now()
      });
    },
    
    identify: (userId: string, userProperties?: Record<string, any>) => {
      (window as any).mockedAnalyticsCalls.push({
        type: 'identify',
        userId,
        properties: userProperties,
        timestamp: Date.now()
      });
    },
    
    register: (properties: Record<string, any>) => {
      // Global properties - store them separately if needed
      (window as any).posthogGlobalProperties = properties;
    },
    
    isFeatureEnabled: (flagName: string) => false,
    getFeatureFlag: (flagName: string) => undefined,
    onFeatureFlags: (callback: () => void) => callback(),
  };
  
  // Also mock navigator.sendBeacon for page exit tracking
  const originalSendBeacon = navigator.sendBeacon;
  (navigator as any).sendBeacon = (url: string, data: any) => {
    (window as any).mockedAnalyticsCalls.push({
      type: 'beacon',
      url,
      data: data ? JSON.parse(data) : null,
      timestamp: Date.now()
    });
    return originalSendBeacon ? originalSendBeacon.call(navigator, url, data) : true;
  };
};

export async function setupAnalyticsMock(page: Page): Promise<void> {
  // Inject mock before any page scripts run
  await page.evaluateOnNewDocument(mockInjector);
}

export async function getAnalyticsCalls(page: Page): Promise<MockedAnalyticsCall[]> {
  return page.evaluate(() => (window as any).mockedAnalyticsCalls || []);
}

export async function clearAnalyticsCalls(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as any).mockedAnalyticsCalls = [];
  });
}

export async function waitForAnalyticsCall(
  page: Page,
  predicate: (call: MockedAnalyticsCall) => boolean,
  timeout: number = 5000
): Promise<MockedAnalyticsCall> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const calls = await getAnalyticsCalls(page);
    const matchingCall = calls.find(predicate);
    
    if (matchingCall) {
      return matchingCall;
    }
    
    await page.waitForTimeout(100);
  }
  
  throw new Error(`Analytics call matching predicate not found within ${timeout}ms`);
}

export async function assertAnalyticsCall(
  page: Page,
  expectedCall: Partial<MockedAnalyticsCall>
): Promise<void> {
  const calls = await getAnalyticsCalls(page);
  const matchingCall = calls.find(call => {
    if (expectedCall.type && call.type !== expectedCall.type) return false;
    if (expectedCall.eventName && call.eventName !== expectedCall.eventName) return false;
    if (expectedCall.userId && call.userId !== expectedCall.userId) return false;
    return true;
  });
  
  if (!matchingCall) {
    throw new Error(`Expected analytics call not found. Expected: ${JSON.stringify(expectedCall)}, Got: ${JSON.stringify(calls)}`);
  }
}