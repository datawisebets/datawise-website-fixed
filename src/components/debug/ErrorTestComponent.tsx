import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Analytics } from '@/utils/analytics';

/**
 * Test component for verifying error tracking functionality
 * Only visible in development mode
 */
export const ErrorTestComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  // Throw an error during render to test Error Boundary
  if (shouldThrow) {
    throw new Error('Test Error: React component error triggered intentionally');
  }

  const handleManualError = () => {
    Analytics.captureException(new Error('Test Error: Manual error tracking'), {
      source: 'error_test_component',
      type: 'manual_test',
      timestamp: new Date().toISOString()
    });
    alert('Error tracked! Check PostHog dashboard.');
  };

  const handleUnhandledError = () => {
    // This will trigger the global error handler
    setTimeout(() => {
      // @ts-ignore - Intentionally accessing undefined property
      window.nonExistentObject.doSomething();
    }, 100);
  };

  const handlePromiseRejection = () => {
    // This will trigger the unhandled promise rejection handler
    Promise.reject(new Error('Test Error: Unhandled promise rejection'));
  };

  const handleComponentError = () => {
    setShouldThrow(true);
  };

  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold mb-3 text-gray-300">Error Tracking Tests</h3>
      <div className="space-y-2">
        <Button
          onClick={handleManualError}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          Test Manual Error
        </Button>
        <Button
          onClick={handleUnhandledError}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          Test Unhandled Error
        </Button>
        <Button
          onClick={handlePromiseRejection}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          Test Promise Rejection
        </Button>
        <Button
          onClick={handleComponentError}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          Test Component Error
        </Button>
      </div>
    </div>
  );
};

export default ErrorTestComponent;