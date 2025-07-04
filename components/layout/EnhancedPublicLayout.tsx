'use client';

import React from 'react';
import { PublicLayout } from './PublicLayout';
import { InteractiveHeader } from './InteractiveHeader';
import { ToastContainer, useToast } from '@/components/ui/Toast';

interface EnhancedPublicLayoutProps {
  children: React.ReactNode;
  useInteractiveHeader?: boolean;
}

// Client-side enhanced layout with interactive features
export function EnhancedPublicLayout({ 
  children, 
  useInteractiveHeader = true 
}: EnhancedPublicLayoutProps) {
  const { toasts, removeToast } = useToast();

  if (!useInteractiveHeader) {
    // For pages that need to be server-rendered, use the basic layout
    return <PublicLayout>{children}</PublicLayout>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-teal-50">
      <InteractiveHeader />
      
      {/* Main content */}
      <main>{children}</main>

      {/* Static footer - same as PublicLayout */}
      <footer className="bg-charcoal-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-primary-400">
                  Weekend Will
                </span>
              </div>
              <p className="text-gray-300 mb-4">
                Creating legally valid wills made simple and affordable for everyone.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li><a href="/how-it-works" className="text-gray-300 hover:text-white">How It Works</a></li>
                <li><a href="/pricing" className="text-gray-300 hover:text-white">Pricing</a></li>
                <li><a href="/faqs" className="text-gray-300 hover:text-white">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                <li><a href="/legal/terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                <li><a href="/legal/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-center text-gray-400 text-sm">
              © 2024 Weekend Will. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}