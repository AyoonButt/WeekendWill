'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/utils';

interface TextareaProps {
  label: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  required = false,
  placeholder,
  value,
  onChange,
  rows = 4,
  maxLength,
  className,
  disabled = false,
  ...props
}, ref) => {
  const textareaId = React.useId();
  const errorId = React.useId();
  const [charCount, setCharCount] = React.useState(value?.length || 0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    onChange?.(newValue);
  };

  return (
    <div className="form-group">
      <div className="flex items-center justify-between">
        <label 
          htmlFor={textareaId}
          className={cn('form-label', required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}
        >
          {label}
        </label>
        {maxLength && (
          <span className={cn(
            'text-xs',
            charCount > maxLength * 0.9 
              ? charCount >= maxLength 
                ? 'text-red-600' 
                : 'text-yellow-600'
              : 'text-gray-500'
          )}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        ref={ref}
        id={textareaId}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 resize-vertical',
          error 
            ? 'border-red-300 focus:ring-red-500' 
            : 'border-gray-300',
          disabled 
            ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
            : 'bg-white text-charcoal-700',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        required={required}
        {...props}
      />
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
});

Textarea.displayName = 'Textarea';

export default Textarea;