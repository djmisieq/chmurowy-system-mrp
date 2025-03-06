"use client";

import React, { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  helpText?: string;
  fullWidth?: boolean;
}

/**
 * Input component with label and error states
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      iconPosition = 'left',
      helpText,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputClasses = `
      block border-gray-300 rounded-md shadow-sm
      focus:border-primary-500 focus:ring-primary-500
      sm:text-sm
      ${error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}
      ${icon && iconPosition === 'left' ? 'pl-10' : ''}
      ${icon && iconPosition === 'right' ? 'pr-10' : ''}
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
          <input ref={ref} className={inputClasses} {...props} />
          
          {icon && (
            <div
              className={`absolute inset-y-0 ${
                iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'
              } flex items-center pointer-events-none text-gray-400`}
            >
              {icon}
            </div>
          )}
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

Input.displayName = 'Input';

export default Input;