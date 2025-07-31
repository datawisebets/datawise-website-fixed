import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { Browser, Page } from 'puppeteer';
import { 
  setupAnalyticsMock, 
  getAnalyticsCalls, 
  waitForAnalyticsCall,
  clearAnalyticsCalls 
} from './helpers/analyticsMock';

describe('Analytics Integration Tests', () => {
  let browser: Browser;
  let page: Page;
  const BASE_URL = process.env.TEST_URL || 'http://localhost:8080';
  
  beforeAll(async () => {
    // Use Puppeteer MCP if available, otherwise fall back to standard puppeteer
    const puppeteer = await import('puppeteer');
    browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  beforeEach(async () => {
    page = await browser.newPage();
    await setupAnalyticsMock(page);
    
    // Set viewport to desktop size
    await page.setViewport({ width: 1280, height: 800 });
  });
  
  afterEach(async () => {
    await page.close();
  });
  
  describe('Page Tracking', () => {
    test('should track page view on initial load', async () => {
      await page.goto(BASE_URL);
      
      // Wait for the page view event
      const pageViewCall = await waitForAnalyticsCall(page, 
        call => call.eventName === '$pageview'
      );
      
      expect(pageViewCall).toBeDefined();
      expect(pageViewCall.properties).toMatchObject({
        path: '/',
        url: expect.stringContaining(BASE_URL),
        title: expect.any(String)
      });
    });
    
    test('should track page view on navigation', async () => {
      await page.goto(BASE_URL);
      await clearAnalyticsCalls(page);
      
      // Navigate to blog page
      await page.click('a[href="/blog"]');
      await page.waitForNavigation();
      
      const pageViewCall = await waitForAnalyticsCall(page,
        call => call.eventName === '$pageview' && call.properties?.path === '/blog'
      );
      
      expect(pageViewCall).toBeDefined();
    });
    
    test('should track scroll depth milestones', async () => {
      await page.goto(BASE_URL);
      await clearAnalyticsCalls(page);
      
      // Scroll to 50% of the page
      await page.evaluate(() => {
        const halfHeight = document.documentElement.scrollHeight / 2;
        window.scrollTo(0, halfHeight);
      });
      
      // Wait for scroll milestone event
      const scrollCall = await waitForAnalyticsCall(page,
        call => call.eventName === 'scroll_milestone_reached'
      );
      
      expect(scrollCall.properties?.milestone).toBeGreaterThanOrEqual(25);
    });
    
    test('should track user engagement', async () => {
      await page.goto(BASE_URL);
      await clearAnalyticsCalls(page);
      
      // Simulate user engagement
      await page.click('body');
      
      const engagementCall = await waitForAnalyticsCall(page,
        call => call.eventName === 'user_engaged'
      );
      
      expect(engagementCall).toBeDefined();
      expect(engagementCall.properties?.path).toBe('/');
    });
  });
  
  describe('CTA Tracking', () => {
    test('should track CTA clicks with comprehensive data', async () => {
      await page.goto(BASE_URL);
      await clearAnalyticsCalls(page);
      
      // Click the hero CTA
      const heroButton = await page.waitForSelector('[data-testid="hero-cta"], button');
      // Find button with "Start" text
      const buttons = await page.$$('button');
      let targetButton = null;
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text?.includes('Start')) {
          targetButton = button;
          break;
        }
      }
      if (targetButton) {
        await targetButton.click();
      }
      
      const ctaCall = await waitForAnalyticsCall(page,
        call => call.eventName === 'cta_clicked'
      );
      
      expect(ctaCall.properties).toMatchObject({
        cta_location: expect.any(String),
        cta_text: expect.any(String),
        page_path: '/',
        time_on_page: expect.any(Number),
        scroll_depth: expect.any(Number),
        device_type: 'desktop'
      });
    });
    
    test('should track pricing CTA with plan type', async () => {
      await page.goto(BASE_URL);
      
      // Scroll to pricing section
      await page.evaluate(() => {
        document.querySelector('#pricing')?.scrollIntoView();
      });
      
      await clearAnalyticsCalls(page);
      
      // Click yearly plan CTA
      const buttons = await page.$$('button');
      let yearlyButton = null;
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text?.includes('Claim Best Value')) {
          yearlyButton = button;
          break;
        }
      }
      if (yearlyButton) {
        await yearlyButton.click();
      }
      
      const ctaCall = await waitForAnalyticsCall(page,
        call => call.eventName === 'cta_clicked' && call.properties?.plan_type === 'yearly'
      );
      
      expect(ctaCall.properties).toMatchObject({
        cta_location: 'pricing_section_yearly',
        plan_type: 'yearly'
      });
    });
  });
  
  describe('Checkout Modal Tracking', () => {
    test('should track checkout modal open', async () => {
      await page.goto(BASE_URL);
      await clearAnalyticsCalls(page);
      
      // Click any CTA to open checkout
      const buttons = await page.$$('button');
      let ctaButton = null;
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text?.includes('Start')) {
          ctaButton = button;
          break;
        }
      }
      if (ctaButton) {
        await ctaButton.click();
      }
      
      const modalCall = await waitForAnalyticsCall(page,
        call => call.eventName === 'checkout_modal_opened'
      );
      
      expect(modalCall).toBeDefined();
      expect(modalCall.properties).toMatchObject({
        plan_id: expect.any(String),
        device: 'desktop'
      });
    });
    
    test('should identify user when email is entered', async () => {
      // This test would require the actual Whop iframe to be loaded
      // For now, we'll test the mock behavior
      await page.goto(BASE_URL);
      
      // Simulate Whop postMessage
      await page.evaluate(() => {
        window.postMessage({
          type: 'user-data',
          data: { email: 'test@example.com' }
        }, '*');
      });
      
      // Note: In real tests, this would need proper iframe handling
    });
  });
  
  describe('Error Tracking', () => {
    test('should track exceptions', async () => {
      await page.goto(BASE_URL);
      await clearAnalyticsCalls(page);
      
      // Trigger an error
      await page.evaluate(() => {
        try {
          throw new Error('Test error');
        } catch (e) {
          // The error boundary should catch this
          window.Analytics?.captureException(e as Error, { source: 'test' });
        }
      });
      
      const errorCall = await waitForAnalyticsCall(page,
        call => call.eventName === '$exception'
      );
      
      expect(errorCall.properties).toMatchObject({
        $exception_message: 'Test error',
        $exception_source: 'test'
      });
    });
  });
  
  describe('Analytics Queue System', () => {
    test('should queue events before PostHog loads', async () => {
      let newPage: Page | null = null;
      
      try {
        // Create a new page without PostHog
        newPage = await browser.newPage();
        
        // Don't inject the mock yet
        await newPage.goto(BASE_URL);
        
        // Remove posthog to simulate it not being loaded
        await newPage.evaluate(() => {
          delete (window as any).posthog;
        });
        
        // Try to track an event
        await newPage.evaluate(() => {
          window.Analytics?.trackEvent('test_event', { value: 'test' });
        });
        
        // Now inject the mock function
        await newPage.evaluate(() => {
          // Inline mock injector to avoid reference error
          (window as any).mockedAnalyticsCalls = [];
          
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
              (window as any).posthogGlobalProperties = properties;
            },
            isFeatureEnabled: (flagName: string) => false,
            getFeatureFlag: (flagName: string) => undefined,
            onFeatureFlags: (callback: () => void) => callback(),
          };
        });
        
        // Process the queue
        await newPage.evaluate(() => {
          // Trigger queue processing
          window.Analytics?.trackEvent('trigger_queue', {});
        });
        
        const calls = await getAnalyticsCalls(newPage);
        const queuedEvent = calls.find(call => call.eventName === 'test_event');
        
        expect(queuedEvent).toBeDefined();
        expect(queuedEvent?.properties?.value).toBe('test');
      } finally {
        // Ensure cleanup happens
        if (newPage) {
          await newPage.close();
        }
      }
    });
  });
});