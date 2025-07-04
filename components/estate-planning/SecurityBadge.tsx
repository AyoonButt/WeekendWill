'use client';

import React from 'react';
import { 
  LockClosedIcon, 
  CloudIcon, 
  UserIcon,
  ShieldCheckIcon 
} from '@heroicons/react/20/solid';
import type { SecurityBadgeProps } from '@/types';
import { cn } from '@/utils';

const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  features,
  className,
}) => {
  const featureConfig = {
    encrypted: {
      icon: LockClosedIcon,
      label: 'Encrypted',
      tooltip: 'Your data is protected with 256-bit SSL encryption'
    },
    'backed-up': {
      icon: CloudIcon,
      label: 'Backed Up',
      tooltip: 'Your documents are automatically backed up daily'
    },
    'secure-access': {
      icon: UserIcon,
      label: 'Secure Access',
      tooltip: 'Multi-factor authentication and secure login'
    }
  };

  if (features.length === 0) {
    return null;
  }

  return (
    <div className={cn('inline-flex items-center space-x-2', className)}>
      <ShieldCheckIcon className="w-4 h-4 text-success-600" />
      <div className="flex items-center space-x-1">
        {features.map((feature, index) => {
          const config = featureConfig[feature];
          const Icon = config.icon;

          return (
            <React.Fragment key={feature}>
              <div 
                className="group relative inline-flex items-center"
                title={config.tooltip}
              >
                <span className="security-badge text-xs px-2 py-1 rounded-full">
                  <Icon className="w-3 h-3 mr-1 inline" />
                  {config.label}
                </span>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="bg-charcoal-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                    {config.tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="border-4 border-transparent border-t-charcoal-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              {index < features.length - 1 && (
                <span className="text-success-600 text-xs">•</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Extended security information component
export const SecurityInfo: React.FC<{ className?: string }> = ({ 
  className 
}) => {
  const securityFeatures = [
    {
      icon: LockClosedIcon,
      title: '256-bit SSL Encryption',
      description: 'Bank-level security protects your personal information'
    },
    {
      icon: CloudIcon,
      title: 'Daily Backups',
      description: 'Your documents are automatically backed up to secure cloud storage'
    },
    {
      icon: UserIcon,
      title: 'Secure Authentication',
      description: 'Multi-factor authentication and secure password requirements'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Compliance Certified',
      description: 'SOC 2 certified and GDPR compliant data handling'
    }
  ];

  return (
    <div className={cn('bg-gray-50 rounded-xl p-6', className)}>
      <h3 className="text-lg font-semibold text-charcoal-900 mb-4 flex items-center">
        <ShieldCheckIcon className="w-5 h-5 text-success-600 mr-2" />
        Your Security & Privacy
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {securityFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5 text-success-600 mt-0.5" />
              </div>
              <div>
                <h4 className="font-medium text-charcoal-900 text-sm">
                  {feature.title}
                </h4>
                <p className="text-xs text-charcoal-600 mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs text-charcoal-500">
          <span>SOC 2 Certified</span>
          <span>•</span>
          <span>GDPR Compliant</span>
          <span>•</span>
          <span>CCPA Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityBadge;