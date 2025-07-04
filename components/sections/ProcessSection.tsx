'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button, Card } from '@/components/ui';

const ProcessSection: React.FC = () => {
  const { data: session } = useSession();

  const processSteps = [
    {
      step: '1',
      title: 'Answer Simple Questions',
      description: 'Our guided interview takes you through everything step by step. No legal jargon, just plain English questions about your family, assets, and wishes.'
    },
    {
      step: '2', 
      title: 'Review Your Will',
      description: 'We generate your customized will based on your answers. Review everything to make sure it reflects your exact wishes and preferences.'
    },
    {
      step: '3',
      title: 'Sign & Execute',
      description: 'Print your will and follow our simple signing instructions. Get it witnessed according to your state\'s requirements, and you\'re legally protected.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal-900 mb-4">
            How Weekend Will Works
          </h2>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            Creating your will is simple, secure, and guided every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-charcoal-600 leading-relaxed">
                  {step.description}
                </p>
              </Card>
              
              {/* Connector arrow for desktop */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRightIcon className="w-8 h-8 text-primary-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href={session ? "/dashboard" : "/register"}>
            <Button variant="primary" size="lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;