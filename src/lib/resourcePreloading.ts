/**
 * React 19-style Resource Preloading Utilities
 * 
 * This module provides React 19-compatible resource preloading APIs that work with React 18
 * and will be easily upgradeable to React 19's native APIs when available.
 * 
 * Features:
 * - preload() for critical resources
 * - preinit() for early initialization
 * - prefetchDNS() for DNS prefetching
 * - Intelligent resource prioritization
 * - Performance monitoring
 * 
 * Note: React 19 has native preload/preinit but they're not directly exported.
 * This implementation provides a compatible API that can be used today.
 */

// Note: React 19's preload/preinit are designed to be used within React components
// and are not exported as standalone functions. This implementation provides
// a compatible API that can be used outside of components as well.

// Safe URL helper to prevent runtime crashes
function safeOrigin(href: string): string | null {
  try {
    return new URL(href, window.location.origin).origin;
  } catch {
    // Invalid URL or relative path - skip
    return null;
  }
}

import type { PreloadOptions, PreinitOptions } from '@/types/resourcePreloading';
import eventBus from './eventBus';

// Re-export types for dynamic imports
export type { PreloadOptions, PreinitOptions };

// Resource tracking for performance monitoring
interface ResourceMetrics {
  url: string;
  type: string;
  startTime: number;
  endTime?: number;
  success?: boolean;
  error?: string;
}

class ResourcePreloadingManager {
  private preloadedResources = new Set<string>();
  private preinitializedResources = new Set<string>();
  private prefetchedDomains = new Set<string>();
  private metrics: ResourceMetrics[] = [];

  /**
   * Preload a resource for future use
   * Compatible with React 19's preload() API
   */
  preload(href: string, options: PreloadOptions): void {
    if (this.preloadedResources.has(href)) {
      return; // Already preloaded
    }

    const startTime = performance.now();
    this.metrics.push({
      url: href,
      type: `preload-${options.as}`,
      startTime,
    });

    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = options.as;

      if (options.crossOrigin) {
        link.crossOrigin = options.crossOrigin;
      }
      if (options.integrity) {
        link.integrity = options.integrity;
      }
      if (options.type) {
        link.type = options.type;
      }
      if (options.media) {
        link.media = options.media;
      }
      if (options.fetchPriority) {
        link.setAttribute('fetchpriority', options.fetchPriority);
      }
      if (options.importance) {
        link.setAttribute('importance', options.importance);
      }

      // Add load/error event listeners for metrics
      link.addEventListener('load', () => {
        const metric = this.metrics.find(m => m.url === href && !m.endTime);
        if (metric) {
          metric.endTime = performance.now();
          metric.success = true;
        }
        eventBus.emit('preload-complete', this.getPerformanceSummary());
      });

      link.addEventListener('error', (error) => {
        const metric = this.metrics.find(m => m.url === href && !m.endTime);
        if (metric) {
          metric.endTime = performance.now();
          metric.success = false;
          metric.error = error instanceof Error
            ? error.message
            : (error as Event).type ?? String(error);
        }
        eventBus.emit('preload-complete', this.getPerformanceSummary());
      });

      document.head.appendChild(link);
      this.preloadedResources.add(href);
    } catch (error) {
      console.warn(`Failed to preload resource: ${href}`, error);
      const metric = this.metrics.find(m => m.url === href && !m.endTime);
      if (metric) {
        metric.endTime = performance.now();
        metric.success = false;
        metric.error = error instanceof Error
          ? error.message
          : String(error);
      }
      eventBus.emit('preload-complete', this.getPerformanceSummary());
    }
  }

  /**
   * Preinitialize a resource for immediate use
   * Compatible with React 19's preinit() API
   */
  preinit(href: string, options: PreinitOptions): void {
    if (this.preinitializedResources.has(href)) {
      return; // Already preinitialized
    }

    const startTime = performance.now();
    this.metrics.push({
      url: href,
      type: `preinit-${options.as}`,
      startTime,
    });

    try {
      if (options.as === 'script') {
        const script = document.createElement('script');
        script.src = href;
        script.async = true;
        
        if (options.crossOrigin) {
          script.crossOrigin = options.crossOrigin;
        }
        if (options.integrity) {
          script.integrity = options.integrity;
        }

        script.addEventListener('load', () => {
          const metric = this.metrics.find(m => m.url === href && !m.endTime);
          if (metric) {
            metric.endTime = performance.now();
            metric.success = true;
          }
          eventBus.emit('preload-complete', this.getPerformanceSummary());
        });

        script.addEventListener('error', (error) => {
          const metric = this.metrics.find(m => m.url === href && !m.endTime);
          if (metric) {
            metric.endTime = performance.now();
            metric.success = false;
            metric.error = error.toString();
          }
          eventBus.emit('preload-complete', this.getPerformanceSummary());
        });

        document.head.appendChild(script);
      } else if (options.as === 'style') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        
        if (options.crossOrigin) {
          link.crossOrigin = options.crossOrigin;
        }
        if (options.integrity) {
          link.integrity = options.integrity;
        }
        if (options.precedence) {
          link.setAttribute('data-precedence', options.precedence);
        }

        link.addEventListener('load', () => {
          const metric = this.metrics.find(m => m.url === href && !m.endTime);
          if (metric) {
            metric.endTime = performance.now();
            metric.success = true;
          }
          eventBus.emit('preload-complete', this.getPerformanceSummary());
        });

        link.addEventListener('error', (error) => {
          const metric = this.metrics.find(m => m.url === href && !m.endTime);
          if (metric) {
            metric.endTime = performance.now();
            metric.success = false;
            metric.error = error.toString();
          }
          eventBus.emit('preload-complete', this.getPerformanceSummary());
        });

        document.head.appendChild(link);
      }

      this.preinitializedResources.add(href);
    } catch (error) {
      console.warn(`Failed to preinitialize resource: ${href}`, error);
      const metric = this.metrics.find(m => m.url === href && !m.endTime);
      if (metric) {
        metric.endTime = performance.now();
        metric.success = false;
        metric.error = error instanceof Error ? error.message : String(error);
      }
      eventBus.emit('preload-complete', this.getPerformanceSummary());
    }
  }

  /**
   * Prefetch DNS for a domain
   * Compatible with React 19's prefetchDNS() API
   */
  prefetchDNS(href: string, options?: { crossOrigin?: 'anonymous' | 'use-credentials' }): void {
    const domain = safeOrigin(href);
    if (!domain) {
      // Invalid URL - skip without throwing
      return;
    }

    if (this.prefetchedDomains.has(domain)) {
      return; // Already prefetched
    }

    try {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;

      if (options?.crossOrigin) {
        link.crossOrigin = options.crossOrigin;
      }

      document.head.appendChild(link);
      this.prefetchedDomains.add(domain);
    } catch (error) {
      console.warn(`Failed to prefetch DNS for domain: ${href}`, error);
    }
  }

  /**
   * Preconnect to a domain (includes DNS + TCP + TLS)
   */
  preconnect(href: string, options?: { crossOrigin?: 'anonymous' | 'use-credentials' }): void {
    const domain = safeOrigin(href);
    if (!domain) {
      // Invalid URL - skip without throwing
      return;
    }

    try {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;

      if (options?.crossOrigin) {
        link.crossOrigin = options.crossOrigin;
      }

      document.head.appendChild(link);
    } catch (error) {
      console.warn(`Failed to preconnect to domain: ${href}`, error);
    }
  }

  /**
   * Get performance metrics for preloaded resources
   */
  getMetrics(): ResourceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get summary of preloading performance
   */
  getPerformanceSummary() {
    const completed = this.metrics.filter(m => m.endTime);
    const successful = completed.filter(m => m.success);
    const failed = completed.filter(m => !m.success);
    
    const avgLoadTime = completed.length > 0 
      ? completed.reduce((sum, m) => sum + (m.endTime! - m.startTime), 0) / completed.length
      : 0;

    return {
      total: this.metrics.length,
      completed: completed.length,
      successful: successful.length,
      failed: failed.length,
      successRate: completed.length > 0 ? successful.length / completed.length : 0,
      averageLoadTime: avgLoadTime,
      preloadedResources: this.preloadedResources.size,
      preinitializedResources: this.preinitializedResources.size,
      prefetchedDomains: this.prefetchedDomains.size,
    };
  }
}

// Lazy-initialized global instance to prevent TDZ errors
let resourceManager: ResourcePreloadingManager | null = null;

// Lazy initialization function
function getResourceManager(): ResourcePreloadingManager {
  if (!resourceManager) {
    resourceManager = new ResourcePreloadingManager();
  }
  return resourceManager;
}

// Export React 19-compatible API functions
export const preload = (href: string, options: PreloadOptions) => 
  getResourceManager().preload(href, options);

export const preinit = (href: string, options: PreinitOptions) => 
  getResourceManager().preinit(href, options);

export const prefetchDNS = (href: string, options?: { crossOrigin?: 'anonymous' | 'use-credentials' }) => 
  getResourceManager().prefetchDNS(href, options);

export const preconnect = (href: string, options?: { crossOrigin?: 'anonymous' | 'use-credentials' }) => 
  getResourceManager().preconnect(href, options);

// Export performance monitoring functions
export const getPreloadMetrics = () => getResourceManager().getMetrics();
export const clearPreloadMetrics = () => getResourceManager().clearMetrics();
export const getPreloadPerformanceSummary = () => getResourceManager().getPerformanceSummary();

// Export getter for the manager instance
export const getResourceManagerInstance = () => getResourceManager();

export default getResourceManager();
