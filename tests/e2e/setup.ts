import { Browser } from 'puppeteer';

declare global {
  var browser: Browser;
  var page: any;
}

// Extend test timeout for E2E tests
jest.setTimeout(30000);

// Helper to wait for analytics to load
export async function waitForAnalytics(page: any, timeout = 5000): Promise<void> {
  await page.waitForFunction(
    () => window.posthog !== undefined,
    { timeout }
  );
}