/**
 * Progressive Loader Component
 * 
 * Implements aggressive progressive loading with skeleton screens and priority-based content loading
 * to ensure smooth 60fps scrolling performance.
 */

import { useState, useEffect, useRef, ReactNode, Suspense } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ProgressiveLoaderProps {
  children: ReactNode;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'deferred';
  skeleton?: ReactNode;
  minHeight?: string;
  preloadMargin?: string;
  id?: string;
  onLoad?: () => void;
  enableVirtualization?: boolean;
}

// Skeleton components for different content types
export const SkeletonCard = ({ height = "200px" }: { height?: string }) => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" style={{ height }}>
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="animate-pulse space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-300 dark:bg-gray-600 rounded"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

export const SkeletonImage = ({ aspectRatio = "16/9" }: { aspectRatio?: string }) => (
  <div 
    className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded-lg w-full"
    style={{ aspectRatio }}
  />
);

export const SkeletonSection = ({ height = "400px" }: { height?: string }) => (
  <div className="animate-pulse space-y-6 py-12" style={{ minHeight: height }}>
    <div className="text-center space-y-4">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mx-auto"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mx-auto"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

// Priority-based loading delays
const LOADING_DELAYS = {
  critical: 0,      // Load immediately
  high: 100,        // Load after 100ms
  medium: 300,      // Load after 300ms
  low: 800,         // Load after 800ms
  deferred: 2000,   // Load after 2 seconds
};

// Intersection observer margins based on priority
const PRELOAD_MARGINS = {
  critical: '0px',
  high: '200px',
  medium: '500px',
  low: '800px',
  deferred: '1000px',
};

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  children,
  priority,
  skeleton,
  minHeight = '100px',
  preloadMargin,
  id,
  onLoad,
  enableVirtualization = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(priority === 'critical');
  const [shouldRender, setShouldRender] = useState(priority === 'critical');
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const renderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Use intersection observer for non-critical content
  const [ref, isVisible] = useIntersectionObserver({
    rootMargin: preloadMargin || PRELOAD_MARGINS[priority],
    threshold: 0,
  });

  // Progressive loading logic
  useEffect(() => {
    if (priority === 'critical') {
      return; // Critical content loads immediately
    }

    if (isVisible && !shouldRender) {
      // Start rendering process when visible
      const delay = LOADING_DELAYS[priority];

      // Clear any existing render timeout
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }

      renderTimeoutRef.current = setTimeout(() => {
        setShouldRender(true);

        // Clear any existing load timeout
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }

        // Load content after a brief delay to prevent blocking
        loadTimeoutRef.current = setTimeout(() => {
          setIsLoaded(true);
          onLoad?.();
        }, 50);
      }, delay);
    }

    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current);
    };
  }, [isVisible, priority, shouldRender, onLoad]);

  // Virtualization for off-screen content
  if (enableVirtualization && !isVisible && !shouldRender) {
    return (
      <div 
        ref={ref} 
        id={id}
        style={{ minHeight }}
        className="w-full"
      />
    );
  }

  // Default skeleton based on priority
  const defaultSkeleton = skeleton || (
    priority === 'critical' ? null : <SkeletonSection height={minHeight} />
  );

  return (
    <div ref={ref} id={id} className="w-full">
      {shouldRender ? (
        isLoaded ? (
          <Suspense fallback={defaultSkeleton}>
            {children}
          </Suspense>
        ) : (
          defaultSkeleton
        )
      ) : (
        <div style={{ minHeight }} className="w-full" />
      )}
    </div>
  );
};

// Higher-order component for easy wrapping
export function withProgressiveLoading<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProgressiveLoaderProps, 'children'>
) {
  return function ProgressiveComponent(props: P) {
    return (
      <ProgressiveLoader {...options}>
        <Component {...props} />
      </ProgressiveLoader>
    );
  };
}

// Hook for manual progressive loading control
export function useProgressiveLoading(priority: ProgressiveLoaderProps['priority']) {
  const [isLoaded, setIsLoaded] = useState(priority === 'critical');
  const [isVisible, setIsVisible] = useState(false);
  
  const triggerLoad = () => {
    const delay = LOADING_DELAYS[priority];
    setTimeout(() => setIsLoaded(true), delay);
  };

  return {
    isLoaded,
    isVisible,
    triggerLoad,
    setIsVisible,
  };
}

// Performance-optimized intersection observer for multiple elements
export class ProgressiveLoadingManager {
  private observer: IntersectionObserver;
  private elements = new Map<Element, () => void>();

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = this.elements.get(entry.target);
            if (callback) {
              // Use requestIdleCallback for non-blocking execution
              if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(callback, { timeout: 100 });
              } else {
                setTimeout(callback, 0);
              }
              this.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '500px 0px',
        threshold: 0,
      }
    );
  }

  observe(element: Element, callback: () => void) {
    this.elements.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
    this.observer.unobserve(element);
  }

  disconnect() {
    this.observer.disconnect();
    this.elements.clear();
  }
}

// Global progressive loading manager instance
export const progressiveLoadingManager = new ProgressiveLoadingManager();

export default ProgressiveLoader;
