'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  CheckIcon, 
  XMarkIcon,
  QuestionMarkCircleIcon,
  StarIcon 
} from '@heroicons/react/24/outline';
import { Button, Card, Toggle } from '@/components/ui';
import { PricingCard, TrustSignals, SecurityBadge } from '@/components/estate-planning';
import { PublicPageContainer } from '@/components/layout';
import type { PricingPlan } from '@/types';

const PricingPage: React.FC = () => {
  const { data: session } = useSession();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handlePlanSelect = async (planName: string, stripePriceId: string) => {
    if (session) {
      try {
        // Create checkout session
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

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error('Error creating checkout session:', error);
        alert('Unable to process payment. Please try again.');
      }
    } else {
      // Redirect to registration with plan selection
      window.location.href = `/register?plan=${planName.toLowerCase()}`;
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

  const comparisonFeatures = [
    {
      category: 'Core Features',
      features: [
        { name: 'Complete will creation', essential: true, unlimited: true },
        { name: 'Executor selection', essential: true, unlimited: true },
        { name: 'Guardian appointment', essential: true, unlimited: true },
        { name: 'Asset distribution', essential: true, unlimited: true },
        { name: 'Digital assets', essential: true, unlimited: true },
        { name: 'Pet care instructions', essential: true, unlimited: true },
        { name: 'Unlimited updates', essential: false, unlimited: true },
        { name: 'Family sharing', essential: false, unlimited: true }
      ]
    },
    {
      category: 'Legal Documents',
      features: [
        { name: 'Last will and testament', essential: true, unlimited: true },
        { name: 'Power of attorney', essential: false, unlimited: true },
        { name: 'Healthcare directive', essential: false, unlimited: true },
        { name: 'Trust planning guidance', essential: false, unlimited: true },
        { name: 'Legal form library', essential: false, unlimited: true }
      ]
    },
    {
      category: 'Support & Storage',
      features: [
        { name: 'Email support', essential: true, unlimited: true },
        { name: 'Priority support', essential: false, unlimited: true },
        { name: 'Secure cloud storage', essential: false, unlimited: true },
        { name: 'Mobile app access', essential: false, unlimited: true },
        { name: 'Document versioning', essential: false, unlimited: true }
      ]
    }
  ];

  const faqs = [
    {
      question: 'Are these wills legally valid?',
      answer: 'Yes, all our wills are created using attorney-reviewed templates and meet the legal requirements in all 50 states when properly executed with witnesses.'
    },
    {
      question: 'What is the difference between the plans?',
      answer: 'The Essential plan is perfect for creating your first will. The Unlimited plan includes ongoing updates, additional legal documents, and premium support.'
    },
    {
      question: 'Can I upgrade my plan later?',
      answer: 'Absolutely! You can upgrade from Essential to Unlimited at any time. We&apos;ll credit your previous purchase toward the upgrade.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you&apos;re not satisfied with your will, we&apos;ll provide a full refund.'
    },
    {
      question: 'How long does it take to create a will?',
      answer: 'Most people complete their will in 10-20 minutes using our guided interview process.'
    }
  ];

  return (
    <PublicPageContainer>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 to-teal-50 -mt-8">
        <div className="container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-charcoal-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-charcoal-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include attorney-reviewed templates 
            and are legally valid in all 50 states.
          </p>

          {/* Billing toggle for Unlimited plan */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-charcoal-900' : 'text-charcoal-600'}`}>
              Monthly
            </span>
            <Toggle
              checked={billingCycle === 'annual'}
              onChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
              size="lg"
              label="Switch between monthly and annual billing"
            />
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-charcoal-900' : 'text-charcoal-600'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="bg-success-100 text-success-800 text-xs font-medium px-2 py-1 rounded-full">
                Save 30%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                {...plan}
                onSelect={() => handlePlanSelect(plan.planName, plan.stripePriceId)}
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

      {/* Feature Comparison */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-charcoal-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-xl text-charcoal-600">
              See exactly what&apos;s included in each plan.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-charcoal-900">
                        Features
                      </th>
                      <th className="text-center py-4 px-6 font-medium text-charcoal-900">
                        Essential Will
                      </th>
                      <th className="text-center py-4 px-6 font-medium text-charcoal-900 bg-primary-50">
                        <div className="flex items-center justify-center space-x-1">
                          <span>Unlimited Plan</span>
                          <StarIcon className="w-4 h-4 text-primary-600" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((category, categoryIndex) => (
                      <React.Fragment key={categoryIndex}>
                        <tr className="bg-gray-50">
                          <td
                            colSpan={3}
                            className="py-3 px-6 font-semibold text-charcoal-900 text-sm uppercase tracking-wider"
                          >
                            {category.category}
                          </td>
                        </tr>
                        {category.features.map((feature, featureIndex) => (
                          <tr key={featureIndex} className="border-b border-gray-100">
                            <td className="py-4 px-6 text-charcoal-700">
                              {feature.name}
                            </td>
                            <td className="py-4 px-6 text-center">
                              {feature.essential ? (
                                <CheckIcon className="w-5 h-5 text-success-600 mx-auto" />
                              ) : (
                                <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                              )}
                            </td>
                            <td className="py-4 px-6 text-center bg-primary-50">
                              {feature.unlimited ? (
                                <CheckIcon className="w-5 h-5 text-success-600 mx-auto" />
                              ) : (
                                <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <TrustSignals />

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-charcoal-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-charcoal-600">
              Get answers to common questions about our pricing and services.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <QuestionMarkCircleIcon className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-charcoal-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-charcoal-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-600 to-teal-600 text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Protect Your Family?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have created their wills with Weekend Will. 
            Start in minutes, complete with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={session ? "/dashboard" : "/register"}>
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                Get Started Now
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-8">
            <SecurityBadge features={['encrypted', 'backed-up', 'secure-access']} />
          </div>
        </div>
      </section>
    </PublicPageContainer>
  );
};

export default PricingPage;