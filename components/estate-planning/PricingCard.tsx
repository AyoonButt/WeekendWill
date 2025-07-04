'use client';

import React from 'react';
import { CheckIcon, StarIcon } from '@heroicons/react/20/solid';
import { Card, Button } from '@/components/ui';
import type { PricingCardProps } from '@/types';
import { cn } from '@/utils';

const PricingCard: React.FC<PricingCardProps> = ({
  planName,
  price,
  billing,
  features,
  additionalFeatures,
  highlighted = false,
  legalCompliance,
  cta,
  stripePriceId,
  onSelect,
}) => {
  return (
    <Card
      className={cn(
        'relative transition-all duration-300 hover:shadow-xl',
        highlighted && 'ring-2 ring-primary-600 shadow-xl scale-105'
      )}
      elevated={highlighted}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
            <StarIcon className="w-4 h-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <Card.Header className={cn(highlighted && 'bg-gradient-to-br from-primary-50 to-teal-50')}>
        <div className="text-center">
          <Card.Title className={cn(
            'text-2xl',
            highlighted && 'text-primary-900'
          )}>
            {planName}
          </Card.Title>
          <div className="mt-4">
            <span className={cn(
              'text-4xl font-bold',
              highlighted ? 'text-primary-600' : 'text-charcoal-900'
            )}>
              {price}
            </span>
            <span className="text-charcoal-600 ml-2">
              {billing}
            </span>
          </div>
        </div>
      </Card.Header>

      <Card.Content className="space-y-6">
        {/* Additional Features Note */}
        {additionalFeatures && additionalFeatures.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-primary-800">
              {additionalFeatures[0]}
            </p>
          </div>
        )}

        {/* Features */}
        <div>
          <h4 className="font-medium text-charcoal-900 mb-4">
            Core Features:
          </h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckIcon 
                  className={cn(
                    'w-5 h-5 flex-shrink-0 mt-0.5',
                    highlighted ? 'text-primary-600' : 'text-success-600'
                  )}
                  aria-hidden="true"
                />
                <span className="text-sm text-charcoal-700">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Compliance */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-charcoal-900 mb-3">
            Legal Compliance:
          </h4>
          <div className="space-y-2">
            {legalCompliance.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  highlighted ? 'bg-primary-600' : 'bg-success-600'
                )} />
                <span className="text-xs text-charcoal-600">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card.Content>

      <Card.Footer>
        <Button
          variant={highlighted ? 'primary' : 'outline'}
          size="lg"
          onClick={onSelect}
          className="w-full"
          data-stripe-price-id={stripePriceId}
        >
          {cta}
        </Button>
        
        {/* Trust indicators */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-charcoal-500">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-success-600 rounded-full" />
              <span>30-day guarantee</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-success-600 rounded-full" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

// Pricing comparison component
interface PricingComparisonProps {
  plans: PricingCardProps[];
  className?: string;
}

export const PricingComparison: React.FC<PricingComparisonProps> = ({
  plans,
  className,
}) => {
  return (
    <section className={cn('py-16', className)}>
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            All plans include attorney-reviewed templates and are legally valid in all 50 states.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
            />
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-success-50 px-6 py-3 rounded-full">
            <CheckIcon className="w-5 h-5 text-success-600" />
            <span className="text-sm font-medium text-success-800">
              30-day money-back guarantee • No questions asked
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCard;