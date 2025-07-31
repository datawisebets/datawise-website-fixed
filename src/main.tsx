import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// React 19 Resource Preloading Example
// In React 19, you can call these functions directly in components:
// import { preload, preinit, prefetchDNS } from 'react-dom';
// 
// function MyComponent() {
//   // Preload resources
//   preload('/api/data.json', { as: 'fetch' });
//   preload('/fonts/custom.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
//   
//   // Preinitialize critical scripts/styles
//   preinit('/critical.css', { as: 'style' });
//   preinit('/analytics.js', { as: 'script' });
//   
//   // Prefetch DNS for external domains
//   prefetchDNS('https://api.example.com');
//   
//   return <div>...</div>;
// }

// Register Service Worker for caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Aggressive instant rendering
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    // Ensure immediate black background
    rootElement.style.backgroundColor = '#000000';
    rootElement.style.minHeight = '100vh';
    
    const root = createRoot(rootElement, {
      // React 19 Error Handling
      onCaughtError: (error, errorInfo) => {
        // Errors caught by Error Boundaries
        console.error('[React 19] Caught Error:', error);
        
        // Send to analytics
        if (window.posthog) {
          window.posthog.capture('$exception', {
            $exception_message: error.message,
            $exception_type: error.name,
            $exception_source: 'error_boundary',
            $exception_level: 'caught',
            $exception_digest: errorInfo.digest,
            componentStack: errorInfo.componentStack,
            errorBoundary: errorInfo.errorBoundary?.displayName,
          });
        }
      },
      
      onUncaughtError: (error, errorInfo) => {
        // Errors not caught by Error Boundaries
        console.error('[React 19] Uncaught Error:', error);
        
        // Send to analytics
        if (window.posthog) {
          window.posthog.capture('$exception', {
            $exception_message: error.message,
            $exception_type: error.name,
            $exception_source: 'uncaught',
            $exception_level: 'fatal',
            $exception_digest: errorInfo.digest,
            componentStack: errorInfo.componentStack,
          });
        }
      },
      
      onRecoverableError: (error, errorInfo) => {
        // Errors that React recovered from automatically
        console.warn('[React 19] Recoverable Error:', error);
        
        // Log to analytics but with lower severity
        if (window.posthog) {
          window.posthog.capture('react_recoverable_error', {
            error_message: error.message,
            error_type: error.name,
            error_digest: errorInfo.digest,
            componentStack: errorInfo.componentStack,
          });
        }
      }
    });
    root.render(<App />);
  }
};

// Render immediately for all devices - React's concurrent rendering handles optimization
renderApp();
