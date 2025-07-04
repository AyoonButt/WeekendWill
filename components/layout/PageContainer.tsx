'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { cn } from '@/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  fullWidth?: boolean;
  backgroundColor?: 'white' | 'gray' | 'gradient';
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
  fullWidth = false,
  backgroundColor = 'white',
}) => {
  const { toasts, removeToast } = useToast();

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-primary-50 to-teal-50',
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      
      <main 
        className={cn(
          'flex-1',
          backgroundClasses[backgroundColor],
          className
        )}
      >
        {fullWidth ? (
          children
        ) : (
          <div className="container-narrow py-8">
            {children}
          </div>
        )}
      </main>
      
      {showFooter && <Footer />}
      
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

// Specialized page containers for different use cases
export const PublicPageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <PageContainer
    backgroundColor="white"
    showHeader={true}
    showFooter={true}
    className={className}
  >
    {children}
  </PageContainer>
);

export const AuthPageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <PageContainer
    backgroundColor="gradient"
    showHeader={false}
    showFooter={false}
    fullWidth={true}
    className={className}
  >
    {children}
  </PageContainer>
);

export const DashboardPageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <PageContainer
    backgroundColor="gray"
    showHeader={true}
    showFooter={false}
    className={className}
  >
    {children}
  </PageContainer>
);

export const InterviewPageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <PageContainer
    backgroundColor="gradient"
    showHeader={true}
    showFooter={false}
    fullWidth={true}
    className={className}
  >
    {children}
  </PageContainer>
);

export default PageContainer;