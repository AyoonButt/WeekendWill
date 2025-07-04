'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }, [error]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;re sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-red-800 mb-2">Development Error:</h3>
                <p className="text-sm text-red-700 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-600 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-3">
              <Button
                onClick={reset}
                className="w-full"
                variant="primary"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Try again
              </Button>
              
              <Button
                onClick={handleGoHome}
                className="w-full"
                variant="outline"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Go to homepage
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}