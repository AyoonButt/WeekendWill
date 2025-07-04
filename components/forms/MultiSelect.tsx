'use client';

import React, { useState } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import type { MultiSelectProps } from '@/types';
import { cn } from '@/utils';

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  label,
  required = false,
}) => {
  const [query, setQuery] = useState('');
  const selectId = React.useId();

  const filteredOptions = query === ''
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );

  const selectedOptions = options.filter(option => 
    selected.includes(option.value)
  );

  const handleSelect = (option: { value: string; label: string }) => {
    if (selected.includes(option.value)) {
      // Remove from selection
      onChange(selected.filter(value => value !== option.value));
    } else {
      // Add to selection
      onChange([...selected, option.value]);
    }
    setQuery('');
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(v => v !== value));
  };

  return (
    <div className="form-group">
      <label 
        htmlFor={selectId}
        className={cn('form-label', required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}
      >
        {label}
      </label>

      {/* Selected items display */}
      {selectedOptions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
            >
              {option.label}
              <button
                type="button"
                onClick={() => handleRemove(option.value)}
                className="ml-2 hover:text-primary-600 focus:outline-none"
                aria-label={`Remove ${option.label}`}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Combobox<{ value: string; label: string; }> value={undefined} onChange={handleSelect}>
        <div className="relative">
          <ComboboxInput
            id={selectId}
            placeholder="Search and select options..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent pr-10"
            displayValue={() => query}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {filteredOptions.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No options found.
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <ComboboxOption
                  key={option.value}
                  value={option}
                  className={({ focus }) =>
                    cn(
                      'relative cursor-default select-none py-3 pl-10 pr-4',
                      focus ? 'bg-primary-100 text-primary-900' : 'text-charcoal-900'
                    )
                  }
                >
                  <span className={cn(
                    'block truncate',
                    isSelected ? 'font-medium' : 'font-normal'
                  )}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </ComboboxOption>
              );
            })
          )}
        </ComboboxOptions>
      </Combobox>

      {/* Helper text */}
      <p className="mt-2 text-sm text-charcoal-600">
        You can select multiple options. Type to search through available choices.
      </p>
    </div>
  );
};

// Simplified tag-based multi-select for smaller lists
export const TagMultiSelect: React.FC<MultiSelectProps & { 
  allowCustom?: boolean;
  maxItems?: number;
}> = ({
  options,
  selected,
  onChange,
  label,
  required = false,
  allowCustom = false,
  maxItems,
}) => {
  const [customValue, setCustomValue] = useState('');

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      if (maxItems && selected.length >= maxItems) {
        return; // Don't allow more than max items
      }
      onChange([...selected, value]);
    }
  };

  const handleCustomAdd = () => {
    if (customValue.trim() && !selected.includes(customValue.trim())) {
      if (maxItems && selected.length >= maxItems) {
        return;
      }
      onChange([...selected, customValue.trim()]);
      setCustomValue('');
    }
  };

  return (
    <div className="form-group">
      <label className={cn('form-label', required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}>
        {label}
      </label>

      <div className="space-y-3">
        {/* Predefined options */}
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            const isDisabled = Boolean(!isSelected && maxItems && selected.length >= maxItems);
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => !isDisabled && handleToggle(option.value)}
                disabled={isDisabled}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border',
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600'
                    : isDisabled
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-charcoal-700 border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                )}
              >
                {option.label}
                {isSelected && (
                  <CheckIcon className="w-4 h-4 ml-2 inline" />
                )}
              </button>
            );
          })}
        </div>

        {/* Custom input */}
        {allowCustom && (!maxItems || selected.length < maxItems) && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomAdd())}
              placeholder="Add custom option..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
            />
            <button
              type="button"
              onClick={handleCustomAdd}
              disabled={!customValue.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        )}

        {/* Selected count and limit */}
        {maxItems && (
          <p className="text-sm text-charcoal-600">
            {selected.length} of {maxItems} selected
          </p>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;