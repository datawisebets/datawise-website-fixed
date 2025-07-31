import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/utils/ScrollToTop";
import ResourcePreloader from "./components/performance/ResourcePreloader";
import PerformanceMonitor from "./components/performance/PerformanceMonitor";
import { AsyncErrorBoundary } from "./components/error/ErrorBoundary";
import { AccessibilityProvider, SkipLink } from "./components/accessibility/AccessibilityProvider";
import { HomepageStructuredData } from "./components/seo/StructuredData";
import { DeploymentHealthCheck } from "./components/debug/DeploymentHealthCheck";
import { PageTracker } from "./components/analytics/PageTracker";
import { PageFallback } from "./components/ui/LoadingFallback";
// Import testing utilities in development
// if (import.meta.env.DEV) {
//   import('./utils/testResourcePreloading');
// }

// Lazy load non-critical routes using standardized system
import { createLazyComponents } from "./components/utils/LazyLoader";

const { GuideDetail, BlogIndex, BettingSimulator, LegalPage } = createLazyComponents({
  GuideDetail: () => import("./pages/GuideDetail"),
  BlogIndex: () => import("./pages/BlogIndex"),
  BettingSimulator: () => import("./pages/BettingSimulator"),
  LegalPage: () => import("./pages/LegalPage"),
}, {
  preloadMargin: '300px', // Preload routes when user is close to navigating
  minHeight: '100vh', // Full height for route components
});

// Development-only components
const DevAnalyticsTest = import.meta.env.DEV 
  ? createLazyComponents({
      DevAnalyticsTest: () => import("./pages/DevAnalyticsTest"),
    }, {
      preloadMargin: '0px',
      minHeight: '100vh',
    }).DevAnalyticsTest
  : () => null;

// Lazy load analytics to reduce initial bundle size
const AnalyticsProvider = createLazyComponents({
  AnalyticsProvider: () => import("./components/analytics/AnalyticsProvider"),
}, {
  preloadMargin: '0px', // Load immediately when component mounts
  minHeight: '0px', // No visual component
}).AnalyticsProvider;

// Configure QueryClient with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
    },
  },
});

const App = () => {
  
  return (
    <AsyncErrorBoundary level="page">
        <QueryClientProvider client={queryClient}>
          <AccessibilityProvider>
            <TooltipProvider>
              <HomepageStructuredData />
              <SkipLink href="#main-content">Skip to main content</SkipLink>
              <Toaster />
              <Sonner />
              <SpeedInsights />
              <Analytics />
              <BrowserRouter>
                <ResourcePreloader
                  enablePerformanceMonitoring={true}
                  enableRoutePreloading={true}
                  enableThirdPartyPreloading={true}
                />
                <Suspense fallback={null}>
                  <AnalyticsProvider />
                </Suspense>
                <PageTracker />
                <ScrollToTop />
                {import.meta.env.DEV && (
                  <PerformanceMonitor
                    enableLogging={true}
                    enableAnalytics={false}
                    showDevOverlay={true}
                  />
                )}
                <DeploymentHealthCheck />
                <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={
              <Suspense fallback={<PageFallback />}>
                <BlogIndex />
              </Suspense>
            } />
            <Route path="/betting-simulator" element={
              <Suspense fallback={<PageFallback />}>
                <BettingSimulator />
              </Suspense>
            } />
            {/* Redirect /guides to /blog for SEO continuity */}
            <Route path="/guides" element={<Navigate to="/blog" replace />} />
            
            {/* Redirect /guides/:guideId to /blog/:guideId for SEO continuity */}
            <Route path="/guides/:guideId" element={<GuideRedirect />} />
            
            {/* Blog detail pages */}
            <Route path="/blog/:postId" element={
              <Suspense fallback={<PageFallback />}>
                <GuideDetail />
              </Suspense>
            } />
            
            {/* Legal pages */}
            <Route path="/privacy-policy" element={
              <Suspense fallback={<PageFallback />}>
                <LegalPage />
              </Suspense>
            } />
            
            {/* Development-only analytics test harness */}
            {import.meta.env.DEV && (
              <Route path="/dev/analytics-test" element={
                <Suspense fallback={<PageFallback />}>
                  <DevAnalyticsTest />
                </Suspense>
              } />
            )}
            <Route path="/terms-of-service" element={
              <Suspense fallback={<PageFallback />}>
                <LegalPage />
              </Suspense>
            } />
            <Route path="/eula" element={
              <Suspense fallback={<PageFallback />}>
                <LegalPage />
              </Suspense>
            } />
            <Route path="/return-policy" element={
              <Suspense fallback={<PageFallback />}>
                <LegalPage />
              </Suspense>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AccessibilityProvider>
    </QueryClientProvider>
    </AsyncErrorBoundary>
  );
};

// Helper component for redirecting from guides to blog with the same slug
const GuideRedirect = () => {
  const location = useLocation();
  // Extract slug safely, handling trailing slashes and query strings
  const slug = location.pathname
    .replace(/^\/guides\/?/, '')  // Remove /guides or /guides/
    .split('?')[0]                // Remove query string
    .split('/')[0]                // Get first segment if multiple
    .trim();                      // Clean up whitespace
  
  // Redirect to blog with the slug, or to /blog if no slug
  return <Navigate to={slug ? `/blog/${slug}` : '/blog'} replace />;
};

export default App;
