'use client';

import React from 'react';
import { RadioGroup, RadioGroupOption } from '@headlessui/react';
import { cn } from '@/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioProps {
  label: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

const Radio: React.FC<RadioProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className,
  orientation = 'vertical',
}) => {
  const radioId = React.useId();
  const errorId = React.useId();

  return (
    <div className={cn('form-group', className)}>
      <fieldset>
        <legend className={cn(
          'form-label',
          required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
        )}>
          {label}
        </legend>
        <RadioGroup 
          value={value} 
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        >
          <div className={cn(
            'space-y-3',
            orientation === 'horizontal' && 'flex flex-wrap gap-4 space-y-0'
          )}>
            {options.map((option) => (
              <RadioGroupOption
                key={option.value}
                value={option.value}
                disabled={option.disabled || disabled}
                className={({ focus, checked }) =>
                  cn(
                    'relative flex cursor-pointer rounded-lg p-3 focus:outline-none',
                    focus && 'ring-2 ring-primary-600 ring-offset-2',
                    checked 
                      ? 'bg-primary-50 border-primary-600' 
                      : 'bg-white border-gray-300',
                    'border-2 transition-all duration-200',
                    (option.disabled || disabled) && 'opacity-50 cursor-not-allowed'
                  )
                }
              >
                {({ checked }) => (
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-6">
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                        checked
                          ? 'bg-primary-600 border-primary-600'
                          : 'bg-white border-gray-300'
                      )}>
                        {checked && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'block text-sm font-medium',
                        checked ? 'text-primary-900' : 'text-charcoal-700'
                      )}>
                        {option.label}
                      </span>
                      {option.description && (
                        <span className={cn(
                          'block text-sm mt-1',
                          checked ? 'text-primary-700' : 'text-charcoal-600'
                        )}>
                          {option.description}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </RadioGroupOption>
            ))}
          </div>
        </RadioGroup>
      </fieldset>
      {error && (
        <p 
          id={errorId}
          className="form-error" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Radio;