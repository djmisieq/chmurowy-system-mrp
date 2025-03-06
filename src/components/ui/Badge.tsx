"use client";

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

/**
 * Badge component for status indicators
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-success-50 text-success-500',
    warning: 'bg-warning-50 text-warning-500',
    danger: 'bg-danger-50 text-danger-500',
    info: 'bg-primary-50 text-primary-500',
  };
  
  // Combine all classes
  const badgeClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${className}
  `.trim();
  
  return (
    <span className={badgeClasses}>
      {dot && (
        <span 
          className={`mr-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full ${
            variant === 'default' ? 'bg-gray-400' :
            variant === 'success' ? 'bg-success-500' :
            variant === 'warning' ? 'bg-warning-500' :
            variant === 'danger' ? 'bg-danger-500' :
            'bg-primary-500'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;