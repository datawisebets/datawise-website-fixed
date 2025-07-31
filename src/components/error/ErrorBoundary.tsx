import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorDigest?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorDigest: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorDigest: undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // React 19 adds errorDigest to errorInfo
    const errorDigest = (errorInfo as any).digest;
    
    this.setState({
      error,
      errorInfo,
      errorDigest,
    });

    // Log error to analytics
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      // Default error logging
      console.error('Error caught by boundary:', error, errorInfo);
      if (errorDigest) {
        console.error('Error digest:', errorDigest);
      }
      
      // Send to analytics if available
      if (typeof window !== 'undefined') {
        if (window.gtag) {
          window.gtag('event', 'exception', {
            description: error.toString(),
            fatal: this.props.level === 'page',
          });
        }
        
        if (window.posthog) {
          // Track error as a custom event with sanitized error details
          window.posthog.capture('$exception', {
            $exception_message: error.message?.substring(0, 500),
            $exception_type: error.name || 'Error',
            $exception_source: 'error_boundary',
            $exception_level: this.props.level || 'component',
            $error_digest: errorDigest,
            componentStack: errorInfo.componentStack?.substring(0, 1000),
            stack: error.stack?.substring(0, 1000)
          });
        }
      }
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorDigest: undefined,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI based on level
      const { level = 'component' } = this.props;
      
      if (level === 'page') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full mx-auto p-6 text-center">
              <div className="mb-6">
                <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground">
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorDigest && `\nError Digest: ${this.state.errorDigest}`}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        );
      }
      
      if (level === 'section') {
        return (
          <div className="p-6 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-foreground">Section Error</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This section couldn't load properly. You can try refreshing or continue browsing.
            </p>
            <Button size="sm" onClick={this.handleRetry}>
              <RefreshCw className="h-3 w-3 mr-2" />
              Retry
            </Button>
          </div>
        );
      }
      
      // Component level error
      return (
        <div className="p-4 border border-destructive/20 rounded bg-destructive/5">
          <div className="flex items-center space-x-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-foreground">Component Error</span>
            <Button size="sm" variant="ghost" onClick={this.handleRetry}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Async error boundary for handling promise rejections
export class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorDigest: undefined,
    };
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // React 19: Listen for recoverable errors if we want to handle them
    window.addEventListener('error', this.handleGlobalError);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('error', this.handleGlobalError);
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const error = new Error(event.reason);
    
    this.setState({
      hasError: true,
      error,
      errorInfo: null,
      errorDigest: undefined,
    });
    
    // Report to PostHog with sanitized data
    if (window.posthog) {
      window.posthog.capture('$exception', {
        $exception_message: error.message?.substring(0, 500),
        $exception_type: 'unhandled_promise_rejection',
        $exception_source: 'async_error_boundary',
        $exception_level: this.props.level || 'component',
        reason: String(event.reason)?.substring(0, 500),
        stack: error.stack?.substring(0, 1000)
      });
    }
    
    // Prevent the default browser behavior
    event.preventDefault();
  };
  
  handleGlobalError = (event: ErrorEvent) => {
    // React 19 may emit global errors that we can catch
    // Only handle if not already caught by React
    if (!this.state.hasError && event.error) {
      console.error('Global error caught:', event.error);
    }
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorDigest: undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // React 19 adds errorDigest to errorInfo
    const errorDigest = (errorInfo as any).digest;
    
    this.setState({
      error,
      errorInfo,
      errorDigest,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      // Log the error with digest
      console.error('AsyncErrorBoundary caught:', error, errorInfo);
      if (errorDigest) {
        console.error('Error digest:', errorDigest);
      }
      
      // Send to analytics
      if (window.posthog) {
        window.posthog.capture('$exception', {
          $exception_message: error.message?.substring(0, 500),
          $exception_type: error.name || 'Error',
          $exception_source: 'async_error_boundary',
          $exception_level: this.props.level || 'component',
          $error_digest: errorDigest,
          componentStack: errorInfo.componentStack?.substring(0, 1000),
          stack: error.stack?.substring(0, 1000)
        });
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorBoundary level={this.props.level || 'component'}>
          {this.props.children}
        </ErrorBoundary>
      );
    }

    return this.props.children;
  }
}
