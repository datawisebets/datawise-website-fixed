# Analytics Testing Guide

## Overview

This guide documents the comprehensive analytics testing infrastructure implemented to prevent runtime errors and ensure all analytics functionality works correctly before deployment.

## Problem Statement

Previously, new features would pass build verification but fail at runtime with errors like:
- `Analytics.trackPageView is not a function`
- Missing method implementations
- Type mismatches between components and analytics utilities

## Solution Architecture

### 1. Runtime Validation System

**File**: `/src/utils/analyticsValidator.ts`

The `AnalyticsValidator` class validates all analytics methods at runtime:
- Checks if methods exist and are callable
- Tests each method with sample parameters
- Reports errors and warnings
- Runs automatically in development when PostHog loads

### 2. Development Test Harness

**URL**: `http://localhost:8080/dev/analytics-test` (DEV only)

Interactive page for testing all analytics methods:
- Visual validation results
- Test buttons for each analytics method
- Event log to see tracked events
- Export functionality for debugging

### 3. E2E Testing with Puppeteer

**Files**: 
- `/tests/e2e/analytics.integration.test.ts`
- `/tests/e2e/helpers/analyticsMock.ts`

Comprehensive integration tests that:
- Mock PostHog at the window level
- Test page tracking, CTA clicks, checkout flow
- Validate event queuing system
- Test error tracking

### 4. CI/CD Integration

**Scripts**:
```bash
npm run test:e2e        # Run full E2E suite
npm run test:e2e:dev    # Run against dev server
npm run test:analytics  # Run only analytics tests
```

## How to Use

### During Development

1. **Automatic Validation**: Analytics methods are validated automatically when PostHog loads in development.

2. **Manual Testing**: Visit `/dev/analytics-test` to:
   - Run validation manually
   - Test specific analytics methods
   - See event logs in real-time

3. **Console Output**: Watch for validation results:
   ```
   ✅ Analytics Validation Passed
   Tested 13 methods successfully
   ```

### Before Committing

1. **Run Build**: `npm run build`
2. **Run E2E Tests**: `npm run test:e2e`
3. **Check Test Harness**: Manually test new analytics methods

### Adding New Analytics Methods

1. **Add to Analytics Object** (`/src/utils/analytics.ts`):
   ```typescript
   export const Analytics = {
     // ... existing methods
     trackNewFeature: (data: any) => {
       trackEvent('new_feature_used', data);
     }
   };
   ```

2. **Add to Validator** (`/src/utils/analyticsValidator.ts`):
   ```typescript
   const methodTests = [
     // ... existing tests
     { method: 'trackNewFeature', args: [{ test: true }] }
   ];
   ```

3. **Add to Test Harness** (`/src/pages/DevAnalyticsTest.tsx`):
   ```typescript
   {
     name: 'Track New Feature',
     action: () => {
       Analytics.trackNewFeature({ source: 'test' });
       captureEvent('trackNewFeature', [{ source: 'test' }]);
     }
   }
   ```

4. **Add E2E Test** (`/tests/e2e/analytics.integration.test.ts`):
   ```typescript
   test('should track new feature', async () => {
     // Test implementation
   });
   ```

## Common Issues and Solutions

### Issue: Method Not Found at Runtime

**Symptom**: `Analytics.someMethod is not a function`

**Solution**:
1. Add method to Analytics object in `/src/utils/analytics.ts`
2. Run validation to confirm: Visit `/dev/analytics-test`

### Issue: PostHog Not Loading

**Symptom**: Validation warnings about PostHog not loaded

**Solution**:
1. Check network tab for PostHog script
2. Verify environment variables are set
3. Events will queue until PostHog loads

### Issue: E2E Tests Failing

**Symptom**: Puppeteer tests timeout or fail

**Solution**:
1. Ensure build is complete: `npm run build`
2. Check test server is running on correct port
3. Review mock implementation in test helpers

## Best Practices

1. **Always Validate**: Run the test harness after adding new analytics
2. **Test Early**: Don't wait until PR to test analytics
3. **Use TypeScript**: Define proper types for all analytics methods
4. **Mock in Tests**: Use the analytics mock helpers for unit tests
5. **Document Events**: Keep a list of all tracked events and their properties

## Architecture Benefits

1. **Compile-Time Safety**: TypeScript catches missing methods
2. **Runtime Validation**: Catches implementation errors early
3. **Visual Testing**: Test harness provides immediate feedback
4. **Automated Testing**: E2E tests prevent regressions
5. **Development Confidence**: Know analytics work before deployment

## Future Improvements

1. **Event Schema Validation**: Validate event properties match expected schema
2. **Performance Monitoring**: Track analytics impact on page performance
3. **Event Documentation**: Auto-generate docs from analytics methods
4. **Production Monitoring**: Add runtime validation in production (with sampling)
5. **Analytics Dashboard**: Build internal dashboard showing all tracked events