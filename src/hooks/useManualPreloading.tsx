/**
 * Manual preloading utilities
 * Separated from ResourcePreloader to avoid circular dependencies
 */

import { useEffect } from 'react';
import type { PreloadOptions } from '@/types/resourcePreloading';

/**
 * Higher-order component to wrap components with resource preloading
 */
export function withResourcePreloading<P extends object>(
  Component: React.ComponentType<P>,
  resources: Array<{ href: string; options: PreloadOptions }>
) {
  return function WrappedComponent(props: P) {
    useEffect(() => {
      import('@/lib/resourcePreloading').then(({ preload }) => {
        resources.forEach(({ href, options }) => {
          preload(href, options);
        });
      });
    }, []);
    
    return <Component {...props} />;
  };
}

/**
 * Hook for manual resource preloading in components
 */
export function useManualPreloading() {
  const preloadResources = (resources: Array<{ href: string; options: PreloadOptions }>) => {
    import('@/lib/resourcePreloading').then(({ preload }) => {
      resources.forEach(({ href, options }) => {
        preload(href, options);
      });
    });
  };
  
  const preloadOnInteraction = (resources: Array<{ href: string; options: PreloadOptions }>) => {
    return {
      onMouseEnter: () => preloadResources(resources),
      onFocus: () => preloadResources(resources)
    };
  };
  
  return { preloadResources, preloadOnInteraction };
}