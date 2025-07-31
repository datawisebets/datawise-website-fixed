/**
 * Performance Monitor Component
 * 
 * Monitors and reports on resource preloading performance and overall page performance.
 * Provides insights into the effectiveness of React 19-style resource preloading.
 */

import { useEffect, useState } from 'react';
import eventBus from '@/lib/eventBus';

interface PerformanceData {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Resource preloading metrics
  preloadingSummary?: any; // Type will be determined at runtime
  
  // Navigation timing
  domContentLoaded?: number;
  loadComplete?: number;
  
  // Resource timing
  resourceCount?: number;
  totalResourceSize?: number;
}

interface PerformanceMonitorProps {
  /**
   * Whether to enable console logging of performance metrics
   */
  enableLogging?: boolean;
  
  /**
   * Whether to send performance data to analytics
   */
  enableAnalytics?: boolean;
  
  /**
   * Callback function to receive performance data
   */
  onPerformanceData?: (data: PerformanceData) => void;
  
  /**
   * Whether to show performance overlay in development
   */
  showDevOverlay?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enableLogging = true,
  enableAnalytics = false,
  onPerformanceData,
  showDevOverlay = import.meta.env.DEV
}) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handlePreloadUpdate = (summary: any) => {
      setPerformanceData(prevData => ({
        ...prevData,
        preloadingSummary: summary,
      }));
    };

    const collectPerformanceData = async () => {
      const data: PerformanceData = {};

      // Collect Core Web Vitals using Performance Observer API
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          data.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            data.fid = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          data.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }

      // Collect Navigation Timing
      if ('performance' in window && performance.timing) {
        const timing = performance.timing;
        data.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
        data.loadComplete = timing.loadEventEnd - timing.navigationStart;
        data.ttfb = timing.responseStart - timing.navigationStart;
        data.fcp = timing.domContentLoadedEventStart - timing.navigationStart;
      }

      // Collect Resource Timing
      if ('performance' in window && performance.getEntriesByType) {
        const resources = performance.getEntriesByType('resource');
        data.resourceCount = resources.length;
        data.totalResourceSize = resources.reduce((total: number, resource: any) => {
          return total + (resource.transferSize || 0);
        }, 0);
      }


      return data;
    };

    // Collect initial performance data
    collectPerformanceData().then(initialData => {
      setPerformanceData(initialData);
    });

    // Listen for updates from the preloading manager
    eventBus.on('preload-complete', handlePreloadUpdate);

    // Collect performance data after page load
    const timer = setTimeout(async () => {
      const finalData = await collectPerformanceData();
      setPerformanceData(finalData);

      if (enableLogging) {
        console.group('📊 Performance Metrics');
        console.log('Core Web Vitals:', {
          LCP: finalData.lcp ? `${finalData.lcp.toFixed(2)}ms` : 'N/A',
          FID: finalData.fid ? `${finalData.fid.toFixed(2)}ms` : 'N/A',
          CLS: finalData.cls ? finalData.cls.toFixed(4) : 'N/A',
          FCP: finalData.fcp ? `${finalData.fcp.toFixed(2)}ms` : 'N/A',
          TTFB: finalData.ttfb ? `${finalData.ttfb.toFixed(2)}ms` : 'N/A'
        });
        console.log('Page Load:', {
          'DOM Content Loaded': finalData.domContentLoaded ? `${finalData.domContentLoaded.toFixed(2)}ms` : 'N/A',
          'Load Complete': finalData.loadComplete ? `${finalData.loadComplete.toFixed(2)}ms` : 'N/A'
        });
        console.log('Resources:', {
          'Total Resources': finalData.resourceCount || 0,
          'Total Size': finalData.totalResourceSize ? `${(finalData.totalResourceSize / 1024).toFixed(2)} KB` : 'N/A'
        });
        console.log('Resource Preloading:', finalData.preloadingSummary);
        console.groupEnd();
      }

      if (enableAnalytics && window.gtag) {
        // Send performance data to Google Analytics
        window.gtag('event', 'performance_metrics', {
          lcp: finalData.lcp,
          fid: finalData.fid,
          cls: finalData.cls,
          preload_success_rate: finalData.preloadingSummary?.successRate,
          preload_avg_time: finalData.preloadingSummary?.averageLoadTime
        });
      }

      if (onPerformanceData) {
        onPerformanceData(finalData);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      eventBus.off('preload-complete', handlePreloadUpdate);
    };
  }, [enableLogging, enableAnalytics, onPerformanceData]);

  // Development overlay
  if (!showDevOverlay) {
    return null;
  }

  const formatMetric = (value: number | undefined, unit: string = 'ms') => {
    return value ? `${value.toFixed(2)}${unit}` : 'N/A';
  };

  const getScoreColor = (metric: string, value: number | undefined) => {
    if (!value) return 'text-gray-400';
    
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'text-green-400' : value <= 4000 ? 'text-yellow-400' : 'text-red-400';
      case 'fid':
        return value <= 100 ? 'text-green-400' : value <= 300 ? 'text-yellow-400' : 'text-red-400';
      case 'cls':
        return value <= 0.1 ? 'text-green-400' : value <= 0.25 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono border border-gray-600 hover:bg-black/90 transition-colors"
      >
        📊 Perf
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-black/95 text-white p-4 rounded-lg border border-gray-600 min-w-80 font-mono text-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">Performance Metrics</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            <div>
              <h4 className="text-yellow-400 font-semibold mb-1">Core Web Vitals</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>LCP: <span className={getScoreColor('lcp', performanceData.lcp)}>{formatMetric(performanceData.lcp)}</span></div>
                <div>FID: <span className={getScoreColor('fid', performanceData.fid)}>{formatMetric(performanceData.fid)}</span></div>
                <div>CLS: <span className={getScoreColor('cls', performanceData.cls)}>{formatMetric(performanceData.cls, '')}</span></div>
                <div>FCP: <span className="text-blue-400">{formatMetric(performanceData.fcp)}</span></div>
              </div>
            </div>
            
            <div>
              <h4 className="text-green-400 font-semibold mb-1">Resource Preloading</h4>
              <div className="text-xs">
                <div>Success Rate: <span className="text-green-400">
                  {performanceData.preloadingSummary?.successRate 
                    ? `${(performanceData.preloadingSummary.successRate * 100).toFixed(1)}%`
                    : 'N/A'}
                </span></div>
                <div>Avg Load Time: <span className="text-blue-400">
                  {formatMetric(performanceData.preloadingSummary?.averageLoadTime)}
                </span></div>
                <div>Preloaded: <span className="text-purple-400">
                  {performanceData.preloadingSummary?.preloadedResources || 0}
                </span></div>
              </div>
            </div>
            
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">Page Load</h4>
              <div className="text-xs">
                <div>DOM Ready: <span className="text-blue-400">{formatMetric(performanceData.domContentLoaded)}</span></div>
                <div>Load Complete: <span className="text-blue-400">{formatMetric(performanceData.loadComplete)}</span></div>
                <div>Resources: <span className="text-purple-400">{performanceData.resourceCount || 0}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
