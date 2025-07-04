'use client';

import React from 'react';
import { 
  ShieldCheckIcon, 
  ScaleIcon, 
  DocumentCheckIcon, 
  ClockIcon,
  LockClosedIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import type { TrustSignalsProps } from '@/types';
import { cn } from '@/utils';

const defaultSignals = [
  {
    icon: ShieldCheckIcon,
    title: 'SSL Secured',
    description: 'Your data is encrypted and protected with bank-level security'
  },
  {
    icon: ScaleIcon,
    title: 'Attorney Reviewed',
    description: 'Legal templates reviewed and approved by licensed attorneys'
  },
  {
    icon: DocumentCheckIcon,
    title: 'State Compliant',
    description: 'Meets legal requirements in all 50 states'
  },
  {
    icon: ClockIcon,
    title: '24/7 Access',
    description: 'Access your documents anytime, anywhere, from any device'
  },
  {
    icon: LockClosedIcon,
    title: 'Privacy Protected',
    description: 'Your personal information is never shared or sold'
  },
  {
    icon: UserGroupIcon,
    title: 'Trusted by Thousands',
    description: 'Join over 50,000 families who have created their wills with us'
  }
];

const TrustSignals: React.FC<TrustSignalsProps> = ({ 
  signals = defaultSignals 
}) => {
  return (
    <section 
      className="py-12 bg-gradient-to-br from-primary-50 to-teal-50"
      aria-labelledby="trust-signals-heading"
    >
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 
            id="trust-signals-heading"
            className="text-3xl font-bold text-charcoal-900 mb-4"
          >
            Why Families Trust Weekend Will
          </h2>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            We've built our platform with security, compliance, and ease of use as our top priorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div
                key={index}
                className="trust-signal group hover:scale-105 transition-transform duration-200"
              >
                <div className="trust-signal-icon group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900 mb-2">
                    {signal.title}
                  </h3>
                  <p className="text-sm text-charcoal-600 leading-relaxed">
                    {signal.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-600 rounded-full"></div>
              <span className="text-sm text-charcoal-600">256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-600 rounded-full"></div>
              <span className="text-sm text-charcoal-600">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-600 rounded-full"></div>
              <span className="text-sm text-charcoal-600">SOC 2 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-600 rounded-full"></div>
              <span className="text-sm text-charcoal-600">Backed Up Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Compact version for use in other components
export const CompactTrustSignals: React.FC<{ className?: string }> = ({ 
  className 
}) => {
  const compactSignals = defaultSignals.slice(0, 3);

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-4', className)}>
      {compactSignals.map((signal, index) => {
        const Icon = signal.icon;
        return (
          <div
            key={index}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200"
          >
            <Icon className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium text-charcoal-900">
                {signal.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrustSignals;