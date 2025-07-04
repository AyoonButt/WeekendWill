'use client';

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Card, Button } from '@/components/ui';
import { ProgressSteps } from '@/components/estate-planning';
import type { InterviewStepProps } from '@/types';
import { cn } from '@/utils';

const InterviewStep: React.FC<InterviewStepProps> = ({
  title,
  description,
  currentStep,
  totalSteps,
  children,
  onNext,
  onBack,
  canProceed,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-teal-50">
      <div className="container-narrow py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <ProgressSteps
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={[]} // Will be populated by the parent component
            completedSteps={Array.from({ length: currentStep - 1 }, (_, i) => i + 1)}
          />
        </div>

        {/* Main content card */}
        <Card className="max-w-2xl mx-auto">
          <Card.Header>
            <div className="text-center">
              <Card.Title className="text-2xl mb-2">
                {title}
              </Card.Title>
              {description && (
                <Card.Description className="text-base">
                  {description}
                </Card.Description>
              )}
            </div>
          </Card.Header>

          <Card.Content className="min-h-[400px]">
            {children}
          </Card.Content>

          <Card.Footer>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={onBack}
                disabled={isFirstStep}
                className={cn(
                  'flex items-center space-x-2',
                  isFirstStep && 'invisible'
                )}
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <div className="flex items-center space-x-4">
                {/* Save progress indicator */}
                <div className="hidden sm:flex items-center text-sm text-charcoal-600">
                  <div className="w-2 h-2 bg-success-600 rounded-full mr-2" />
                  <span>Progress saved automatically</span>
                </div>

                <Button
                  variant="primary"
                  onClick={onNext}
                  disabled={!canProceed}
                  className="flex items-center space-x-2"
                >
                  <span>{isLastStep ? 'Complete' : 'Continue'}</span>
                  {!isLastStep && <ChevronRightIcon className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Help text */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-sm text-charcoal-600">
                <div className="flex items-center space-x-4">
                  <span>Need help?</span>
                  <button className="text-primary-600 hover:text-primary-700 underline">
                    Chat with us
                  </button>
                  <button className="text-primary-600 hover:text-primary-700 underline">
                    View guide
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Step {currentStep} of {totalSteps}</span>
                </div>
              </div>
            </div>
          </Card.Footer>
        </Card>

        {/* Mobile-only help section */}
        <div className="mt-6 sm:hidden">
          <Card>
            <Card.Content className="text-center py-4">
              <p className="text-sm text-charcoal-600 mb-3">
                Questions about this step?
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  Live Chat
                </Button>
                <Button variant="outline" size="sm">
                  Help Guide
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Specialized interview step for different sections
export const PersonalInfoStep: React.FC<Omit<InterviewStepProps, 'title' | 'description'>> = (props) => (
  <InterviewStep
    title="Personal Information"
    description="Tell us about yourself so we can create your personalized will"
    {...props}
  />
);

export const FamilyStep: React.FC<Omit<InterviewStepProps, 'title' | 'description'>> = (props) => (
  <InterviewStep
    title="Family & Relationships"
    description="Who are the important people in your life?"
    {...props}
  />
);

export const AssetsStep: React.FC<Omit<InterviewStepProps, 'title' | 'description'>> = (props) => (
  <InterviewStep
    title="Assets & Property"
    description="Let's document what you own and how you'd like it distributed"
    {...props}
  />
);

export const ExecutorsStep: React.FC<Omit<InterviewStepProps, 'title' | 'description'>> = (props) => (
  <InterviewStep
    title="Executors & Guardians"
    description="Choose trusted people to carry out your wishes"
    {...props}
  />
);

export const ReviewStep: React.FC<Omit<InterviewStepProps, 'title' | 'description'>> = (props) => (
  <InterviewStep
    title="Review & Finalize"
    description="Review your will before we generate the final documents"
    {...props}
  />
);

export default InterviewStep;