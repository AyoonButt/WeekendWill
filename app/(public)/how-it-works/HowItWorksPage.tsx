'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  DocumentTextIcon,
  UserGroupIcon,
  BanknotesIcon,
  HomeIcon,
  HeartIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button, Card } from '@/components/ui';
import { TrustSignals, SimpleProgressSteps } from '@/components/estate-planning';
import { PublicPageContainer } from '@/components/layout';

const HowItWorksPage: React.FC = () => {
  const { data: session } = useSession();

  const steps = [
    {
      number: '01',
      title: 'Answer Simple Questions',
      description: 'Our guided interview asks about your family, assets, and wishes in plain English. No legal jargon.',
      duration: '5-10 minutes',
      icon: DocumentTextIcon,
      details: [
        'Personal information and family details',
        'Assets and property you own',
        'How you want things distributed',
        'Guardian choices for minor children',
        'Executor and backup selections'
      ]
    },
    {
      number: '02',
      title: 'Review Your Decisions',
      description: 'See your choices clearly laid out. Make changes easily before finalizing your will.',
      duration: '2-3 minutes',
      icon: CheckCircleIcon,
      details: [
        'Complete summary of all your decisions',
        'Easy editing if you want to make changes',
        'Legal compliance verification',
        'Preview of your final document',
        'State-specific requirement confirmation'
      ]
    },
    {
      number: '03',
      title: 'Download & Execute',
      description: 'Get your legal will ready to sign with clear instructions for proper execution.',
      duration: 'Instant',
      icon: ShieldCheckIcon,
      details: [
        'Professional PDF document generated',
        'Step-by-step signing instructions',
        'Witness requirement guidance',
        'Notarization information if needed',
        'Storage and sharing recommendations'
      ]
    }
  ];

  const questionCategories = [
    {
      icon: UserGroupIcon,
      title: 'About You & Your Family',
      questions: [
        'What is your full legal name and address?',
        'Are you married or in a domestic partnership?',
        'Do you have children? What are their names and ages?',
        'Do any of your children have special needs?'
      ]
    },
    {
      icon: HomeIcon,
      title: 'Your Assets & Property',
      questions: [
        'Do you own a home or other real estate?',
        'What bank accounts and investments do you have?',
        'Do you have valuable personal items to distribute?',
        'Any business interests or partnerships?'
      ]
    },
    {
      icon: BanknotesIcon,
      title: 'Distribution Wishes',
      questions: [
        'Who should inherit your assets?',
        'What percentages should each person receive?',
        'Any specific gifts for particular people?',
        'What happens if a beneficiary predeceases you?'
      ]
    },
    {
      icon: HeartIcon,
      title: 'Guardians & Executors',
      questions: [
        'Who should care for your minor children?',
        'Who should manage your estate?',
        'Who are your backup choices?',
        'Any special instructions for your executor?'
      ]
    }
  ];

  const legalFeatures = [
    {
      title: 'Attorney-Reviewed Templates',
      description: 'All our will templates have been reviewed by licensed attorneys to ensure legal validity.'
    },
    {
      title: 'State-Specific Compliance',
      description: 'Automatically meets the legal requirements for your state, including witness and notary rules.'
    },
    {
      title: 'Regular Legal Updates',
      description: 'Our legal team monitors changes in estate planning law and updates our templates accordingly.'
    },
    {
      title: 'Execution Guidance',
      description: 'Clear instructions for properly signing and witnessing your will to ensure it\'s legally binding.'
    }
  ];

  const sampleQuestions = [
    'What is your full legal name?',
    'Do you have a spouse or domestic partner?',
    'Do you have children? Please list their names.',
    'Who would you like to be the guardian of your minor children?',
    'Who would you like to be the executor of your will?',
    'Do you own a home or other real estate?',
    'How would you like your assets distributed?'
  ];

  return (
    <PublicPageContainer>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 to-teal-50 -mt-8">
        <div className="container-wide">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-charcoal-900 mb-6">
              How Weekend Will Works
            </h1>
            <p className="text-xl text-charcoal-600 mb-8">
              Creating your legal will is simple, secure, and guided every step of the way. 
              Most people complete their will in just 15 minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={session ? "/dashboard" : "/register"}>
                <Button variant="primary" size="lg">
                  Start Creating Your Will
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <PlayCircleIcon className="w-5 h-5 mr-2" />
                Watch Demo Video
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="max-w-md mx-auto">
              <SimpleProgressSteps current={0} total={3} />
              <p className="text-sm text-charcoal-600 mt-2">
                You'll complete these 3 simple steps
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-wide">
          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isReversed = index % 2 === 1;
              
              return (
                <div 
                  key={index} 
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    isReversed ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={isReversed ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {step.number}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-charcoal-900">
                          {step.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-primary-600">
                          <ClockIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {step.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-lg text-charcoal-600 mb-6">
                      {step.description}
                    </p>

                    <ul className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                          <span className="text-charcoal-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={isReversed ? 'lg:col-start-1' : ''}>
                    <Card className="p-8 bg-gradient-to-br from-primary-50 to-teal-50 border-0">
                      <div className="text-center">
                        <Icon className="w-24 h-24 text-primary-600 mx-auto mb-6" />
                        <div className="space-y-4">
                          {step.number === '01' && (
                            <div className="space-y-2">
                              <div className="h-3 bg-primary-200 rounded w-3/4 mx-auto" />
                              <div className="h-3 bg-primary-200 rounded w-1/2 mx-auto" />
                              <div className="h-3 bg-primary-200 rounded w-2/3 mx-auto" />
                            </div>
                          )}
                          {step.number === '02' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span>Personal Information</span>
                                <CheckCircleIcon className="w-4 h-4 text-success-600" />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Family & Assets</span>
                                <CheckCircleIcon className="w-4 h-4 text-success-600" />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Distribution</span>
                                <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                              </div>
                            </div>
                          )}
                          {step.number === '03' && (
                            <div className="space-y-2">
                              <div className="w-16 h-20 bg-white border-2 border-gray-300 rounded mx-auto flex items-center justify-center">
                                <DocumentTextIcon className="w-8 h-8 text-primary-600" />
                              </div>
                              <p className="text-sm font-medium text-charcoal-700">
                                Your Legal Will.pdf
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Question Categories */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-charcoal-900 mb-4">
              What Questions Will I Be Asked?
            </h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              We ask simple, straightforward questions organized into clear categories. 
              No legal expertise required.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {questionCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="p-8 h-full">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-charcoal-900">
                      {category.title}
                    </h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {category.questions.map((question, questionIndex) => (
                      <li key={questionIndex} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0 mt-2" />
                        <span className="text-charcoal-600">{question}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legal Compliance */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-charcoal-900 mb-6">
                Legally Valid in All 50 States
              </h2>
              <p className="text-xl text-charcoal-600 mb-8">
                Our wills are created using attorney-reviewed templates and automatically 
                meet the legal requirements for your state.
              </p>

              <div className="space-y-6">
                {legalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-charcoal-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Card className="p-8 bg-gradient-to-br from-charcoal-50 to-gray-100">
                <h4 className="text-lg font-semibold text-charcoal-900 mb-4">
                  Sample Interview Questions
                </h4>
                <div className="space-y-4">
                  {sampleQuestions.map((question, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-primary-600 font-medium flex-shrink-0">
                        {index + 1}.
                      </span>
                      <span className="text-charcoal-700">{question}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-charcoal-600 italic">
                    ...and a few more simple questions to complete your will.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <TrustSignals />

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-charcoal-900 text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Create Your Will?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have protected their future with Weekend Will. 
            Start now and complete your will in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href={session ? "/dashboard" : "/register"}>
              <Button variant="primary" size="lg" className="bg-white text-charcoal-900 hover:bg-gray-100">
                Start Creating Your Will
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal-900">
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-400">
            No credit card required to start • 30-day money-back guarantee
          </p>
        </div>
      </section>
    </PublicPageContainer>
  );
};

export default HowItWorksPage;