import { useEffect, useState } from 'react';

interface HealthCheckResult {
  envVars: boolean;
  cssLoaded: boolean;
  jsExecuting: boolean;
  assetsAccessible: boolean;
  errors: string[];
}

export const DeploymentHealthCheck = () => {
  const [healthCheck, setHealthCheck] = useState<HealthCheckResult | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Only show in production if there's an issue
    if (import.meta.env.DEV) return;

    const runHealthCheck = async () => {
      const errors: string[] = [];
      let envVars = false;
      let cssLoaded = false;
      let assetsAccessible = false;

      // Check environment variables
      try {
        const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
        const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
        
        if (posthogKey && posthogHost) {
          envVars = true;
        } else {
          errors.push('Missing PostHog environment variables');
        }
      } catch (error) {
        errors.push(`Environment variable check failed: ${error}`);
      }

      // Check CSS loading
      try {
        const computedStyle = window.getComputedStyle(document.body);
        const backgroundColor = computedStyle.backgroundColor;
        
        // Check if our dark theme is applied
        if (backgroundColor.includes('0, 0, 0') || backgroundColor === 'rgb(0, 0, 0)') {
          cssLoaded = true;
        } else {
          errors.push('CSS not loaded properly - background color not applied');
        }
      } catch (error) {
        errors.push(`CSS check failed: ${error}`);
      }

      // Check asset accessibility
      try {
        const response = await fetch('/favicon/favicon.ico', { method: 'HEAD' });
        if (response.ok) {
          assetsAccessible = true;
        } else {
          errors.push('Assets not accessible - favicon check failed');
        }
      } catch (error) {
        errors.push(`Asset accessibility check failed: ${error}`);
        assetsAccessible = false;
      }

      setHealthCheck({
        envVars,
        cssLoaded,
        jsExecuting: true,
        assetsAccessible,
        errors
      });

      // Show debug panel if there are any issues
      if (errors.length > 0) {
        setShowDebug(true);
      }
    };

    runHealthCheck();
  }, []);

  if (!showDebug || !healthCheck) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-red-900/90 text-white rounded-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">Deployment Health Check</h3>
      <ul className="text-sm space-y-1">
        <li>✅ JavaScript: Executing</li>
        <li>{healthCheck.envVars ? '✅' : '❌'} Environment Variables</li>
        <li>{healthCheck.cssLoaded ? '✅' : '❌'} CSS Loaded</li>
        <li>{healthCheck.assetsAccessible ? '✅' : '❌'} Assets Accessible</li>
      </ul>
      {healthCheck.errors.length > 0 && (
        <div className="mt-2 pt-2 border-t border-red-700">
          <p className="text-xs font-semibold">Errors:</p>
          <ul className="text-xs mt-1">
            {healthCheck.errors.map((error, i) => (
              <li key={i} className="text-red-200">• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};