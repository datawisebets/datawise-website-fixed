/**
 * Analytics Runtime Validator
 * Validates that all analytics methods exist and work correctly
 * This runs in development to catch errors before production
 */

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  testedMethods: string[];
}

export class AnalyticsValidator {
  private errors: string[] = [];
  private warnings: string[] = [];
  private testedMethods: string[] = [];
  
  constructor(private analytics: any) {}
  
  /**
   * Validate all analytics methods exist and are callable
   */
  async validateAll(): Promise<ValidationResult> {
    this.errors = [];
    this.warnings = [];
    this.testedMethods = [];
    
    // Define all expected methods and their test parameters
    const methodTests = [
      { method: 'trackEvent', args: ['test_event', { test: true }] },
      { method: 'trackPageView', args: ['/test', { test: true }] },
      { method: 'identifyUser', args: ['test_user', { email: 'test@example.com' }] },
      { method: 'captureException', args: [new Error('Test error'), { test: true }] },
      { method: 'trackArticleView', args: ['123', 'Test Article', 'Test Author', 'Test Category'] },
      { method: 'trackButtonClick', args: ['test_button', 'test_location'] },
      { method: 'trackLinkClick', args: ['Test Link', '/test', 'test_location'] },
      { method: 'trackFormSubmit', args: ['test_form', 'test_location', true] },
      { method: 'trackSimulationStart', args: [{ test: true }] },
      { method: 'trackSimulationComplete', args: [{ test: true }, { result: 'test' }] },
      { method: 'trackUserSignUp', args: ['email'] },
      { method: 'trackUserLogIn', args: ['email'] },
      { method: 'trackFeatureUsage', args: ['test_feature', { test: true }] },
    ];
    
    // Test each method
    for (const test of methodTests) {
      await this.testMethod(test.method, test.args);
    }
    
    // Check for PostHog availability (safe for SSR)
    if (typeof window !== 'undefined' && !window.posthog) {
      this.warnings.push('PostHog is not loaded. Events will be queued.');
    }
    
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      testedMethods: this.testedMethods
    };
  }
  
  private async testMethod(methodName: string, args: any[]): Promise<void> {
    try {
      // Check if method exists
      if (!this.analytics[methodName]) {
        this.errors.push(`Method '${methodName}' does not exist on Analytics object`);
        return;
      }
      
      // Check if it's a function
      if (typeof this.analytics[methodName] !== 'function') {
        this.errors.push(`Property '${methodName}' is not a function`);
        return;
      }
      
      // Try to call it (in a safe way that won't actually send events)
      if (typeof window !== 'undefined') {
        const originalPostHog = window.posthog;
        try {
          // Temporarily mock PostHog to prevent actual events
          (window as any).posthog = {
            capture: () => {},
            identify: () => {},
            register: () => {},
            isFeatureEnabled: () => false,
            getFeatureFlag: () => undefined,
            onFeatureFlags: (cb: () => void) => cb()
          };
          
          // Call the method
          await this.analytics[methodName](...args);
          this.testedMethods.push(methodName);
          
        } catch (error) {
          this.errors.push(`Method '${methodName}' threw error: ${error}`);
        } finally {
          // Restore original PostHog
          (window as any).posthog = originalPostHog;
        }
      } else {
        // In SSR environment, just mark as tested
        this.testedMethods.push(methodName);
      }
      
    } catch (error) {
      this.errors.push(`Failed to test method '${methodName}': ${error}`);
    }
  }
  
  /**
   * Log validation results to console
   */
  logResults(results: ValidationResult): void {
    if (results.valid) {
      console.log('%c✅ Analytics Validation Passed', 'color: green; font-weight: bold');
      console.log(`Tested ${results.testedMethods.length} methods successfully`);
    } else {
      console.error('%c❌ Analytics Validation Failed', 'color: red; font-weight: bold');
      results.errors.forEach(error => console.error(`  • ${error}`));
    }
    
    if (results.warnings.length > 0) {
      console.warn('%c⚠️  Analytics Warnings:', 'color: orange; font-weight: bold');
      results.warnings.forEach(warning => console.warn(`  • ${warning}`));
    }
  }
}

/**
 * Run analytics validation in development
 */
export async function validateAnalytics(analytics: any): Promise<void> {
  if (!import.meta.env.DEV) {
    return;
  }
  
  const validator = new AnalyticsValidator(analytics);
  const results = await validator.validateAll();
  validator.logResults(results);
  
  // In development, throw if validation fails
  if (!results.valid) {
    throw new Error('Analytics validation failed. See console for details.');
  }
}