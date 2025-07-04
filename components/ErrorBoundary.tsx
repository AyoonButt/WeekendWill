'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  HomeIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  level?: 'page' | 'component' | 'critical';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleCopyError = () => {
    if (this.state.error) {
      const errorText = `Error: ${this.state.error.message}\n\nStack: ${this.state.error.stack}`;
      navigator.clipboard.writeText(errorText);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Critical level error (full page)
      if (this.props.level === 'critical') {
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                <div className="text-center">
                  <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Critical Error
                  </h2>
                  <p className="text-gray-600 mb-6">
                    The application encountered a critical error and needs to be restarted.
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={this.handleGoHome}
                      className="w-full"
                      variant="primary"
                    >
                      <HomeIcon className="w-4 h-4 mr-2" />
                      Restart Application
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Page level error
      if (this.props.level === 'page') {
        return (
          <div className="min-h-96 bg-gray-50 flex flex-col justify-center py-12 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                <div className="text-center">
                  <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Page Error
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This page encountered an error. Please try again or go back.
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={this.handleRetry}
                      className="w-full"
                      variant="primary"
                    >
                      <ArrowPathIcon className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    
                    <Button
                      onClick={this.handleGoHome}
                      className="w-full"
                      variant="outline"
                    >
                      <HomeIcon className="w-4 h-4 mr-2" />
                      Go to Homepage
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Component level error (inline)
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 mb-1">
                Component Error
              </h4>
              <p className="text-sm text-red-700 mb-3">
                This component failed to load. Please try refreshing the page.
              </p>
              
              <div className="flex space-x-3">
                <Button
                  onClick={this.handleRetry}
                  size="sm"
                  variant="outline"
                  className="text-red-700 border-red-300 hover:bg-red-100"
                >
                  <ArrowPathIcon className="w-3 h-3 mr-1" />
                  Retry
                </Button>
                
                {(this.props.showErrorDetails || process.env.NODE_ENV === 'development') && (
                  <Button
                    onClick={this.handleCopyError}
                    size="sm"
                    variant="outline"
                    className="text-red-700 border-red-300 hover:bg-red-100"
                  >
                    <ClipboardDocumentIcon className="w-3 h-3 mr-1" />
                    Copy Error
                  </Button>
                )}
              </div>
              
              {(this.props.showErrorDetails || process.env.NODE_ENV === 'development') && 
               this.state.error && (
                <details className="mt-3">
                  <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">
                    Show Error Details
                  </summary>
                  <div className="mt-2 p-3 bg-red-100 rounded text-xs font-mono text-red-800 break-all">
                    <div className="font-semibold mb-1">Error:</div>
                    <div className="mb-2">{this.state.error.message}</div>
                    {this.state.error.stack && (
                      <>
                        <div className="font-semibold mb-1">Stack:</div>
                        <div className="whitespace-pre-wrap">{this.state.error.stack}</div>
                      </>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error boundary integration
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  return { captureError };
}