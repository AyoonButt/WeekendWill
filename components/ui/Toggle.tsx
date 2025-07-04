'use client';

import React from 'react';
import { cn } from '@/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  className,
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Size configurations
  const sizes = {
    sm: {
      width: 'w-9',
      height: 'h-5',
      thumbSize: 'w-4 h-4',
      thumbPosition: checked ? 'right-0.5' : 'left-0.5',
    },
    md: {
      width: 'w-11',
      height: 'h-6',
      thumbSize: 'w-5 h-5',
      thumbPosition: checked ? 'right-0.5' : 'left-0.5',
    },
    lg: {
      width: 'w-14',
      height: 'h-8',
      thumbSize: 'w-7 h-7',
      thumbPosition: checked ? 'right-0.5' : 'left-0.5',
    },
  };

  const currentSize = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        currentSize.width,
        currentSize.height,
        checked ? 'bg-primary-600' : 'bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span
        className={cn(
          'absolute inline-block rounded-full bg-white shadow-lg transition-all duration-200 ease-in-out',
          currentSize.thumbSize,
          currentSize.thumbPosition
        )}
      />
    </button>
  );
};

export default Toggle;