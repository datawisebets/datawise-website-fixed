/**
 * Test utilities for React 19-style resource preloading
 * 
 * This module provides testing functions to verify that resource preloading
 * is working correctly and to measure performance improvements.
 */

interface TestResult {
  passed: boolean;
  message: string;
  details?: any;
}

interface PreloadingTestSuite {
  testPreloadedResources: () => TestResult;
  testDNSPrefetching: () => TestResult;
  testPerformanceMetrics: () => Promise<TestResult>;
  testResourceDeduplication: () => TestResult;
  runAllTests: () => Promise<TestResult[]>;
}

/**
 * Test if resources are being preloaded correctly
 */
function testPreloadedResources(): TestResult {
  const preloadLinks = document.querySelectorAll('link[rel="preload"]');
  // Note: Fonts are now loaded from Google Fonts, so we only check for images
  const expectedResources = [
    'HeroImage',
    'DatawiseLogo.webp'
  ];

  const foundResources = Array.from(preloadLinks).map(link => 
    (link as HTMLLinkElement).href
  );

  const missingResources = expectedResources.filter(resource => 
    !foundResources.some(found => found.includes(resource))
  );

  if (missingResources.length === 0) {
    return {
      passed: true,
      message: `✅ All ${expectedResources.length} critical resources are being preloaded`,
      details: { foundResources, expectedResources }
    };
  } else {
    return {
      passed: false,
      message: `❌ Missing preloaded resources: ${missingResources.join(', ')}`,
      details: { foundResources, expectedResources, missingResources }
    };
  }
}

/**
 * Test if DNS prefetching is working
 */
function testDNSPrefetching(): TestResult {
  const dnsPrefetchLinks = document.querySelectorAll('link[rel="dns-prefetch"], link[rel="preconnect"]');
  const expectedDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.googletagmanager.com'
  ];

  const foundDomains = Array.from(dnsPrefetchLinks).map(link => 
    new URL((link as HTMLLinkElement).href).hostname
  );

  const missingDomains = expectedDomains.filter(domain => 
    !foundDomains.includes(domain)
  );

  if (missingDomains.length === 0) {
    return {
      passed: true,
      message: `✅ All ${expectedDomains.length} critical domains are being prefetched`,
      details: { foundDomains, expectedDomains }
    };
  } else {
    return {
      passed: false,
      message: `❌ Missing DNS prefetch for domains: ${missingDomains.join(', ')}`,
      details: { foundDomains, expectedDomains, missingDomains }
    };
  }
}

/**
 * Test if performance metrics are being collected
 */
async function testPerformanceMetrics(): Promise<TestResult> {
  const { getPreloadPerformanceSummary, getPreloadMetrics } = await import('@/lib/resourcePreloading');
  const summary = getPreloadPerformanceSummary();
  const metrics = getPreloadMetrics();

  if (summary.total > 0 && metrics.length > 0) {
    return {
      passed: true,
      message: `✅ Performance metrics are being collected (${summary.total} resources tracked)`,
      details: { summary, metricsCount: metrics.length }
    };
  } else {
    return {
      passed: false,
      message: `❌ Performance metrics are not being collected properly`,
      details: { summary, metricsCount: metrics.length }
    };
  }
}

/**
 * Test if resource deduplication is working
 */
function testResourceDeduplication(): TestResult {
  const allLinks = document.querySelectorAll('link[rel="preload"]');
  const hrefs = Array.from(allLinks).map(link => (link as HTMLLinkElement).href);
  const uniqueHrefs = [...new Set(hrefs)];

  if (hrefs.length === uniqueHrefs.length) {
    return {
      passed: true,
      message: `✅ No duplicate preload links found (${hrefs.length} unique resources)`,
      details: { totalLinks: hrefs.length, uniqueLinks: uniqueHrefs.length }
    };
  } else {
    const duplicates = hrefs.filter((href, index) => hrefs.indexOf(href) !== index);
    return {
      passed: false,
      message: `❌ Found ${hrefs.length - uniqueHrefs.length} duplicate preload links`,
      details: { totalLinks: hrefs.length, uniqueLinks: uniqueHrefs.length, duplicates }
    };
  }
}

/**
 * Run all preloading tests
 */
async function runAllTests(): Promise<TestResult[]> {
  const syncTests = [
    testPreloadedResources,
    testDNSPrefetching,
    testResourceDeduplication
  ];

  const results: TestResult[] = [];
  
  // Run sync tests
  for (const test of syncTests) {
    try {
      results.push(test());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorString = error instanceof Error ? error.toString() : String(error);
      results.push({
        passed: false,
        message: `❌ Test failed with error: ${errorMessage}`,
        details: { error: errorString }
      });
    }
  }
  
  // Run async tests
  try {
    const performanceResult = await testPerformanceMetrics();
    results.push(performanceResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorString = error instanceof Error ? error.toString() : String(error);
    results.push({
      passed: false,
      message: `❌ Test failed with error: ${errorMessage}`,
      details: { error: errorString }
    });
  }
  
  return results;
}

/**
 * Generate a comprehensive test report
 */
async function generateTestReport(): Promise<string> {
  const results = await runAllTests();
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  let report = `\n🧪 React 19-Style Resource Preloading Test Report\n`;
  report += `${'='.repeat(50)}\n`;
  report += `Overall: ${passed}/${total} tests passed\n\n`;
  
  results.forEach((result, index) => {
    report += `${index + 1}. ${result.message}\n`;
    if (result.details && !result.passed) {
      report += `   Details: ${JSON.stringify(result.details, null, 2)}\n`;
    }
    report += '\n';
  });
  
  // Add performance summary
  const { getPreloadPerformanceSummary } = await import('@/lib/resourcePreloading');
  const summary = getPreloadPerformanceSummary();
  report += `📊 Performance Summary:\n`;
  report += `   Total resources: ${summary.total}\n`;
  report += `   Completed: ${summary.completed}\n`;
  report += `   Success rate: ${(summary.successRate * 100).toFixed(1)}%\n`;
  report += `   Average load time: ${summary.averageLoadTime.toFixed(2)}ms\n`;
  report += `   Preloaded resources: ${summary.preloadedResources}\n`;
  report += `   Prefetched domains: ${summary.prefetchedDomains}\n`;
  
  return report;
}

/**
 * Test suite object with all testing functions
 */
export const preloadingTestSuite: PreloadingTestSuite = {
  testPreloadedResources,
  testDNSPrefetching,
  testPerformanceMetrics,
  testResourceDeduplication,
  runAllTests
};

/**
 * Run tests and log results to console
 */
export async function runPreloadingTests(): Promise<void> {
  console.group('🧪 Resource Preloading Tests');
  const report = await generateTestReport();
  console.log(report);
  console.groupEnd();
}

/**
 * Automated test runner that runs tests after page load
 */
export function setupAutomatedTesting(): void {
  if (typeof window !== 'undefined') {
    // Run tests after initial page load
    window.addEventListener('load', () => {
      setTimeout(async () => {
        await runPreloadingTests();
      }, 2000); // Wait 2 seconds for preloading to complete
    });
    
    // Add global test function for manual testing
    (window as any).testResourcePreloading = runPreloadingTests;
    (window as any).preloadingTestSuite = preloadingTestSuite;
  }
}

/**
 * Performance comparison utility
 */
export function comparePerformance(beforeMetrics: any, afterMetrics: any): string {
  let comparison = '\n📈 Performance Comparison\n';
  comparison += '='.repeat(30) + '\n';
  
  const metrics = ['lcp', 'fid', 'cls', 'fcp', 'ttfb'];
  
  metrics.forEach(metric => {
    const before = beforeMetrics[metric];
    const after = afterMetrics[metric];
    
    if (before && after) {
      const improvement = ((before - after) / before * 100).toFixed(1);
      const symbol = after < before ? '📈' : '📉';
      comparison += `${metric.toUpperCase()}: ${before.toFixed(2)}ms → ${after.toFixed(2)}ms (${symbol} ${improvement}%)\n`;
    }
  });
  
  return comparison;
}

// Auto-setup testing in development
if (import.meta.env.DEV) {
  setupAutomatedTesting();
}
