'use client';

import React from 'react';
import { PublicLayout } from './PublicLayout';
import Header from './Header';
import Footer from './Footer';
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
      <Header />
      
      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}