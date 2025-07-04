'use client';

import React, { Suspense, lazy } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { 
  CheckIcon, 
  ArrowRightIcon, 
  PlayIcon,
  ClockIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { Button, Card } from '@/components/ui';
import { TrustSignals, CompactTrustSignals } from '@/components/estate-planning';

// Lazy load heavy sections
const TestimonialSection = lazy(() => import('@/components/sections/TestimonialSection'));
const ProcessSection = lazy(() => import('@/components/sections/ProcessSection'));
import { PublicPageContainer } from '@/components/layout';

// TypeScript interfaces
interface BenefitItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface StatItem {
  number: string;
  label: string;
}

interface ProgressItem {
  section: string;
  completed: boolean;
}

const HomePage: React.FC = () => {
  const { data: session } = useSession();

  const benefits: BenefitItem[] = [
    {
      icon: ClockIcon,
      title: 'Complete in 15 minutes',
      description: 'Simple guided interview gets you done fast'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Attorney-reviewed templates',
      description: 'Legal documents reviewed by licensed attorneys'
    },
    {
      icon: ScaleIcon,
      title: 'Valid in all 50 states',
      description: 'Meets legal requirements nationwide'
    },
    {
      icon: DocumentTextIcon,
      title: 'Instant download',
      description: 'Get your completed will immediately'
    }
  ];

  // processSteps moved to ProcessSection component

  // testimonials moved to TestimonialSection component

  const stats: StatItem[] = [
    { number: '50,000+', label: 'Families Protected' },
    { number: '15 min', label: 'Average Completion Time' },
    { number: '50 states', label: 'Legal Compliance' },
    { number: '99.9%', label: 'Customer Satisfaction' }
  ];

  return (
    <PublicPageContainer>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-teal-50 -mt-8">
        <div className="container-wide py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-charcoal-900 mb-6 leading-tight">
              Your Love, Your Legacy - 
              <span className="block text-primary-600">A Will In Minutes.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-charcoal-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Weekend Will makes estate planning effortless, ensuring your loved ones are protected and your wishes are clear. Save your family from unnecessary stress, costly legal fees, and wasted time by creating your last will and testament today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={session ? "/dashboard" : "/register"}>
                <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                  {session ? "Go to Dashboard" : "Start Creating Your Will"}
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <PlayIcon className="w-5 h-5 mr-2" />
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Quick benefits */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-charcoal-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-charcoal-600">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Will Statistics Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-bold text-charcoal-900 mb-6">
                Nearly half of Americans pass without a will. That means stress, confusion, and expensive court costs for loved ones.
              </h2>
              <p className="text-lg text-charcoal-600 leading-relaxed">
                Without a will, you relinquish control of your estate to the courts, and predetermined laws dictate what happens to your property and children. This can create unnecessary stress and financial burdens for your loved ones. Weekend Will ensures your love and intentions are honored — without the headaches.
              </p>
            </div>
            
            {/* Image */}
            <div className="order-1 lg:order-2 flex justify-center">
              <Image
                src="/will.png"
                alt="Will Document Illustration"
                width={500}
                height={400}
                priority={true}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <TrustSignals />

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-charcoal-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Lazy Loaded */}
      <Suspense fallback={<div className="py-16 lg:py-24 bg-gray-50 flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
        <ProcessSection />
      </Suspense>

      {/* Testimonials Section - Lazy Loaded */}
      <Suspense fallback={<div className="py-16 lg:py-24 bg-white flex items-center justify-center"><div className="text-lg">Loading testimonials...</div></div>}>
        <TestimonialSection />
      </Suspense>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 to-teal-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-charcoal-900 mb-6">
                Everything You Need for Complete Peace of Mind
              </h2>
              <p className="text-xl text-charcoal-600 mb-8">
                Our comprehensive platform includes all the tools and features you need 
                to create and manage your estate planning documents.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Complete will and testament creation',
                  'Guardian selection for minor children',
                  'Asset distribution planning',
                  'Digital asset management',
                  'Pet care instructions',
                  'Funeral arrangement preferences',
                  'Secure document storage',
                  'Easy updates and revisions'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="w-6 h-6 text-success-600 mr-3 flex-shrink-0" />
                    <span className="text-charcoal-700">{feature}</span>
                  </div>
                ))}
              </div>

            </div>
            
            <div className="relative">
              <Card className="p-8 bg-white shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-charcoal-900">
                      Your Will Progress
                    </h3>
                    <span className="text-sm bg-success-100 text-success-800 px-3 py-1 rounded-full">
                      85% Complete
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {([
                      { section: 'Personal Information', completed: true },
                      { section: 'Family & Relationships', completed: true },
                      { section: 'Assets & Property', completed: true },
                      { section: 'Beneficiaries', completed: false },
                      { section: 'Executors & Guardians', completed: false }
                    ] as ProgressItem[]).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-charcoal-700">{item.section}</span>
                        {item.completed ? (
                          <CheckIcon className="w-5 h-5 text-success-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-charcoal-900 text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Don&apos;t Wait. Protect Your Family Today.
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Creating a will is one of the most important things you can do for your family. 
            Start now and have peace of mind in just 15 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href={session ? "/dashboard" : "/register"}>
              <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                Create Your Will Now
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-charcoal-900">
                View Pricing
              </Button>
            </Link>
          </div>

          <CompactTrustSignals className="justify-center" />
        </div>
      </section>
    </PublicPageContainer>
  );
};

export default HomePage;