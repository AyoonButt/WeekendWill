'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/utils';
import type { InputProps } from '@/types';

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  required = false,
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  ...props
}, ref) => {
  const inputId = React.useId();
  const errorId = React.useId();

  return (
    <div className="form-group">
      <label 
        htmlFor={inputId} 
        className={cn('form-label', required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          'form-input',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
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

Input.displayName = 'Input';

export default Input;