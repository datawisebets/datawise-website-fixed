import { ReactNode, Suspense } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyLoadSectionProps {
  children: ReactNode;
  preloadMargin?: string;
  threshold?: number;
  fallback?: ReactNode;
  id?: string;
}

/**
 * Component that lazy loads its children when they enter the viewport
 */
export default function LazyLoadSection({
  children,
  preloadMargin = '800px', // More aggressive preloading
  threshold = 0,
  fallback = null, // Remove loading spinner to prevent layout shift
  id,
}: LazyLoadSectionProps) {
  const [ref, isVisible] = useIntersectionObserver({
    rootMargin: preloadMargin,
    threshold,
  });

  return (
    <div ref={ref} id={id}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        <div className="min-h-[50px]" /> // Smaller placeholder to reduce layout shift
      )}
    </div>
  );
}
