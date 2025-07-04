'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer, useToast } from '@/components/ui/Toast';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { toasts, removeToast } = useToast();

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