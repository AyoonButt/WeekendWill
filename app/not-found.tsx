'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { 
  MagnifyingGlassIcon,
  HomeIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="text-center">
            <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              404
            </h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            
            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full" variant="primary">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="w-full"
              >
                <Button className="w-full" variant="outline">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}