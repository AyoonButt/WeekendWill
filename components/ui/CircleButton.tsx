'use client';

import React from 'react';
import { cn } from '@/utils';

interface CircleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  onClick,
  children,
  size = 'md',
  variant = 'default',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 min-w-6 min-h-6',
    md: 'w-8 h-8 min-w-8 min-h-8',
    lg: 'w-10 h-10 min-w-10 min-h-10',
  };

  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    primary: 'text-primary-500 hover:text-primary-700 hover:bg-primary-50',
    secondary: 'text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50',
    danger: 'text-red-500 hover:text-red-700 hover:bg-red-50',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex-shrink-0',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
        className
      )}
      style={{ aspectRatio: '1 / 1' }}
    >
      {children}
    </button>
  );
};

export default CircleButton;