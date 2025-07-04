'use client';

import React, { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import type { PricingPlan } from '@/types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planName: string, stripePriceId: string) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { showError } = useToast();

  const handlePlanSelection = async (planName: string, stripePriceId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName, stripePriceId);
      return;
    }

    setIsLoading(stripePriceId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: stripePriceId,
          planName: planName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      showError('Payment Error', error instanceof Error ? error.message : 'Failed to start checkout process');
    } finally {
      setIsLoading(null);
    }
  };
  const pricingPlans: PricingPlan[] = [
    {
      planName: 'Essential Plan',
      price: '$109',
      billing: 'one time',
      features: [
        'Generate Will',
        'Describe Wishes',
        'Photo Album', 
        'Downloadable PDFs',
        'AI Assist'
      ],
      legalCompliance: [
        'Attorney-reviewed templates',
        'State-compliant in all 50 states',
        'Legal execution instructions'
      ],
      cta: 'Select Essential',
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ESSENTIAL_PRICE_ID || 'price_1QGtOlAz1KdqLVJfUFE72345',
      highlighted: false
    },
    {
      planName: '1 Year Unlimited Free Edits',
      price: '$129', 
      billing: 'one time',
      features: [
        'Unlimited Free Edits',
        'Update as Life Changes',
        'Secure Cloud Storage'
      ],
      additionalFeatures: [
        'Everything in Essential Plan'
      ],
      legalCompliance: [
        'Attorney-reviewed templates',
        'State-compliant in all 50 states', 
        'Legal execution instructions',
        'Unlimited document updates'
      ],
      cta: 'Select Unlimited',
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID || 'price_1QGtPMAz1KdqLVJfXYZ67890',
      highlighted: true
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-charcoal-900">Choose Your Plan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-charcoal-500" />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`border rounded-xl p-6 relative ${
                plan.highlighted
                  ? 'border-primary-200 bg-primary-50 ring-2 ring-primary-100'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-charcoal-900 mb-2">
                  {plan.planName}
                </h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-charcoal-900">{plan.price}</span>
                  <span className="text-charcoal-600 ml-2">{plan.billing}</span>
                </div>
                {plan.additionalFeatures && (
                  <p className="text-sm text-charcoal-600 mb-4">
                    {plan.additionalFeatures[0]}
                  </p>
                )}
              </div>

              {/* Core Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-charcoal-900 mb-3">Core Features</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <CheckIcon className="w-4 h-4 text-success-600 mr-3 flex-shrink-0" />
                      <span className="text-charcoal-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Select Button */}
              <Button
                variant={plan.highlighted ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
                onClick={() => handlePlanSelection(plan.planName, plan.stripePriceId)}
                loading={isLoading === plan.stripePriceId}
                disabled={isLoading !== null}
              >
                {isLoading === plan.stripePriceId ? 'Processing...' : plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-charcoal-600">
          <p>All plans include attorney-reviewed templates and are compliant in all 50 states.</p>
          <p className="mt-2">30-day money-back guarantee on all purchases.</p>
        </div>
      </div>
    </Modal>
  );
};

export default PricingModal;