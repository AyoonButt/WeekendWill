'use client';

import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import type { ProgressStepsProps } from '@/types';
import { cn } from '@/utils';

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  completedSteps,
}) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <nav 
      aria-label="Progress"
      className="w-full"
    >
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-charcoal-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-charcoal-600">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${Math.round(progressPercentage)}% complete`}
          />
        </div>
      </div>

      {/* Steps */}
      <ol className="hidden lg:flex items-center w-full">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <li 
              key={stepNumber}
              className={cn(
                'flex items-center',
                index < stepLabels.length - 1 && 'flex-1'
              )}
            >
              <div className="flex items-center">
                {/* Step circle */}
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                    isCompleted && 'bg-success-600 border-success-600',
                    isCurrent && 'bg-primary-600 border-primary-600',
                    isUpcoming && 'bg-white border-gray-300'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <CheckIcon 
                      className="w-5 h-5 text-white" 
                      aria-hidden="true"
                    />
                  ) : (
                    <span 
                      className={cn(
                        'text-sm font-medium',
                        isCurrent && 'text-white',
                        isUpcoming && 'text-gray-500'
                      )}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>

                {/* Step label */}
                <div className="ml-3">
                  <span 
                    className={cn(
                      'text-sm font-medium',
                      isCompleted && 'text-success-700',
                      isCurrent && 'text-primary-700',
                      isUpcoming && 'text-gray-500'
                    )}
                  >
                    {label}
                  </span>
                </div>
              </div>

              {/* Connector line */}
              {index < stepLabels.length - 1 && (
                <div 
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors duration-200',
                    isCompleted 
                      ? 'bg-success-600' 
                      : stepNumber < currentStep 
                        ? 'bg-primary-600' 
                        : 'bg-gray-300'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile steps */}
      <div className="lg:hidden">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-charcoal-900">
                {stepLabels[currentStep - 1]}
              </h3>
              <p className="text-sm text-charcoal-600">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {stepLabels.map((_, index) => {
                const stepNumber = index + 1;
                const isCompleted = completedSteps.includes(stepNumber);
                const isCurrent = stepNumber === currentStep;

                return (
                  <div
                    key={stepNumber}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors duration-200',
                      isCompleted && 'bg-success-600',
                      isCurrent && 'bg-primary-600',
                      !isCompleted && !isCurrent && 'bg-gray-300'
                    )}
                    aria-label={`Step ${stepNumber}: ${stepLabels[index]}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Simplified version for compact display
export const SimpleProgressSteps: React.FC<{
  current: number;
  total: number;
  className?: string;
}> = ({ current, total, className }) => {
  const percentage = (current / total) * 100;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-charcoal-700">
          {current} of {total} completed
        </span>
        <span className="text-sm text-charcoal-600">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressSteps;