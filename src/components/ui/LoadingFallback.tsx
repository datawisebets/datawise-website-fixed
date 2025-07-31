/**
 * Loading Fallback Components
 * 
 * Provides consistent loading states across the application
 * with minimal layout shift and good user experience.
 */

interface LoadingFallbackProps {
  height?: string;
  className?: string;
}

// Simple loading fallback for sections
export const SectionFallback: React.FC<LoadingFallbackProps> = ({ 
  height = "200px", 
  className = "" 
}) => (
  <div 
    className={`w-full bg-gray-50 dark:bg-gray-900 rounded-lg ${className}`}
    style={{ height, minHeight: height }}
  />
);

// Loading fallback for full pages
export const PageFallback: React.FC<LoadingFallbackProps> = ({ 
  height = "100vh", 
  className = "" 
}) => (
  <div 
    className={`w-full flex items-center justify-center ${className}`}
    style={{ height, minHeight: height }}
  >
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Minimal fallback for components that should load quickly
export const MinimalFallback: React.FC<LoadingFallbackProps> = ({ 
  height = "50px", 
  className = "" 
}) => (
  <div 
    className={`w-full ${className}`}
    style={{ height, minHeight: height }}
  />
);

export default SectionFallback;
