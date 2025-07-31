/**
 * Standardized Lazy Loading System
 * 
 * Provides consistent lazy loading patterns across the application
 * with optimized performance and minimal layout shifts.
 */

import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { SectionFallback, MinimalFallback } from '@/components/ui/LoadingFallback';

interface LazyLoaderOptions {
  preloadMargin?: string;
  threshold?: number;
  fallback?: ReactNode;
  minHeight?: string;
  enablePreloading?: boolean;
}

interface LazyComponentProps {
  fallback?: ReactNode;
  minHeight?: string;
  className?: string;
  id?: string;
}

/**
 * Creates a lazy-loaded component with intersection observer
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoaderOptions = {}
) {
  const {
    preloadMargin = '500px',
    threshold = 0,
    fallback = null,
    minHeight = '100px',
    enablePreloading = true,
  } = options;

  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: P & LazyComponentProps) {
    const { fallback: propFallback, minHeight: propMinHeight, className, id, ...componentProps } = props;
    
    const [ref, isVisible] = useIntersectionObserver({
      rootMargin: preloadMargin,
      threshold,
    });

    const finalFallback = propFallback || fallback;
    const finalMinHeight = propMinHeight || minHeight;

    return (
      <div ref={ref} className={className} id={id} style={{ minHeight: finalMinHeight }}>
        {isVisible ? (
          <Suspense fallback={finalFallback}>
            <LazyComponent {...(componentProps as P)} />
          </Suspense>
        ) : (
          finalFallback || <div style={{ minHeight: finalMinHeight }} />
        )}
      </div>
    );
  };
}

/**
 * Higher-order component for lazy loading existing components
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  options: LazyLoaderOptions = {}
) {
  const {
    preloadMargin = '500px',
    threshold = 0,
    fallback = null,
    minHeight = '100px',
  } = options;

  return function LazyWrappedComponent(props: P & LazyComponentProps) {
    const { fallback: propFallback, minHeight: propMinHeight, className, id, ...componentProps } = props;
    
    const [ref, isVisible] = useIntersectionObserver({
      rootMargin: preloadMargin,
      threshold,
    });

    const finalFallback = propFallback || fallback;
    const finalMinHeight = propMinHeight || minHeight;

    return (
      <div ref={ref} className={className} id={id} style={{ minHeight: finalMinHeight }}>
        {isVisible ? (
          <Suspense fallback={finalFallback}>
            <Component {...(componentProps as P)} />
          </Suspense>
        ) : (
          finalFallback || <div style={{ minHeight: finalMinHeight }} />
        )}
      </div>
    );
  };
}

/**
 * Lazy loading priorities for different content types
 */
export const LAZY_LOADING_PRESETS = {
  // Critical content - loads immediately when visible
  critical: {
    preloadMargin: '200px',
    threshold: 0,
    minHeight: '50px',
    fallback: <MinimalFallback height="50px" />,
  },

  // Above-the-fold content - aggressive preloading
  aboveFold: {
    preloadMargin: '500px',
    threshold: 0,
    minHeight: '100px',
    fallback: <MinimalFallback height="100px" />,
  },

  // Below-the-fold content - moderate preloading
  belowFold: {
    preloadMargin: '800px',
    threshold: 0,
    minHeight: '200px',
    fallback: <SectionFallback height="200px" />,
  },

  // Deferred content - conservative preloading
  deferred: {
    preloadMargin: '1000px',
    threshold: 0,
    minHeight: '300px',
    fallback: <SectionFallback height="300px" />,
  },
} as const;

/**
 * Pre-configured lazy components for common use cases
 */

// Critical sections (hero, navigation)
export const createCriticalLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) => createLazyComponent(importFn, LAZY_LOADING_PRESETS.critical);

// Above-the-fold sections (features, logos)
export const createAboveFoldLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) => createLazyComponent(importFn, LAZY_LOADING_PRESETS.aboveFold);

// Below-the-fold sections (testimonials, pricing)
export const createBelowFoldLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) => createLazyComponent(importFn, LAZY_LOADING_PRESETS.belowFold);

// Deferred sections (footer, non-critical content)
export const createDeferredLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) => createLazyComponent(importFn, LAZY_LOADING_PRESETS.deferred);

/**
 * Utility for batch lazy loading multiple components
 */
export function createLazyComponents<T extends Record<string, () => Promise<{ default: ComponentType<any> }>>>(
  imports: T,
  options: LazyLoaderOptions = {}
): { [K in keyof T]: ReturnType<typeof createLazyComponent> } {
  const result = {} as any;
  
  for (const [key, importFn] of Object.entries(imports)) {
    result[key] = createLazyComponent(importFn, options);
  }
  
  return result;
}

/**
 * Hook for manual lazy loading control
 */
export function useLazyLoading(options: LazyLoaderOptions = {}) {
  const {
    preloadMargin = '500px',
    threshold = 0,
  } = options;

  const [ref, isVisible] = useIntersectionObserver({
    rootMargin: preloadMargin,
    threshold,
  });

  return {
    ref,
    isVisible,
    shouldLoad: isVisible,
  };
}

export default createLazyComponent;
