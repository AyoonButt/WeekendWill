'use client';

import React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className,
}) => {
  const selectedOption = options.find(option => option.value === value);
  const selectId = React.useId();
  const errorId = React.useId();

  return (
    <div className="form-group">
      <label 
        htmlFor={selectId}
        className={cn('form-label', required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}
      >
        {label}
      </label>
      <Listbox 
        value={value} 
        onChange={onChange}
        disabled={disabled}
      >
        <div className="relative">
          <ListboxButton
            id={selectId}
            className={cn(
              'w-full px-4 py-3 text-left border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200',
              error 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300',
              disabled 
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-charcoal-700 hover:border-gray-400',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          >
            <span className={cn(
              'block truncate',
              !selectedOption && 'text-gray-500'
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={({ focus, selected }) =>
                  cn(
                    'relative cursor-default select-none py-3 pl-10 pr-4',
                    focus ? 'bg-primary-100 text-primary-900' : 'text-charcoal-900',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span className={cn(
                      'block truncate',
                      selected ? 'font-medium' : 'font-normal'
                    )}>
                      {option.label}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
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

export default Select;