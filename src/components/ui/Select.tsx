"use client";

import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

/**
 * Select dropdown component with label and error states
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helpText,
      options,
      size = 'md',
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const selectClasses = `
      block appearance-none border-gray-300 rounded-md shadow-sm pr-10
      focus:border-primary-500 focus:ring-primary-500
      ${error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}
      ${
        size === 'sm'
          ? 'py-1.5 text-xs'
          : size === 'lg'
          ? 'py-3 text-base'
          : 'py-2 text-sm'
      }
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    const containerClasses = `${fullWidth ? 'w-full' : ''}`;

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select ref={ref} className={selectClasses} {...props}>
            {props.placeholder && (
              <option value="" disabled>
                {props.placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500" id={`${props.id}-description`}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;