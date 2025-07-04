'use client';

import React, { forwardRef } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '@/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
  className?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ 
  label,
  description,
  error,
  className,
  onChange,
  ...props
}, ref) => {
  const checkboxId = React.useId();
  const errorId = React.useId();
  const descId = React.useId();

  const handleClick = () => {
    if (props.disabled) return;
    
    const syntheticEvent = {
      target: { 
        checked: !props.checked,
        name: props.name,
        value: props.value 
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange?.(syntheticEvent);
  };

  return (
    <div className={cn('form-group', className)}>
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-6">
          <div className="relative">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className="sr-only"
              aria-invalid={!!error}
              aria-describedby={cn(
                description && descId,
                error && errorId
              )}
              onChange={onChange}
              {...props}
            />
            <div
              onClick={handleClick}
              className={cn(
                'w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center',
                props.checked
                  ? 'bg-primary-600 border-primary-600'
                  : 'bg-white border-gray-300 hover:border-gray-400',
                props.disabled && 'opacity-50 cursor-not-allowed',
                error && !props.checked && 'border-red-300'
              )}
            >
              {props.checked && (
                <CheckIcon 
                  className="w-3 h-3 text-white" 
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <label 
            htmlFor={checkboxId}
            className={cn(
              'text-sm font-medium cursor-pointer select-none',
              props.disabled ? 'text-gray-500' : 'text-charcoal-700',
              props.required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
            )}
          >
            {label}
          </label>
          {description && (
            <p 
              id={descId}
              className="text-sm text-charcoal-600 mt-1"
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p 
          id={errorId}
          className="form-error ml-8" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;