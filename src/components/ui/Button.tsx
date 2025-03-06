"use client";

import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
}

/**
 * Button component with multiple variants and sizes
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  onClick,
  icon,
  type = 'button',
  disabled = false,
  fullWidth = false,
}) => {
  // Base classes
  const baseClasses = `inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`;
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border border-transparent',
    secondary: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 border border-transparent',
    outline: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500 border border-gray-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-primary-500 border border-transparent',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 border border-transparent',
  };
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Icon classes
  const iconClasses = icon ? 'space-x-2' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${disabledClasses}
    ${widthClasses}
    ${iconClasses}
    ${className}
  `.trim();
  
  // Return Link component if href is provided
  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonClasses}
        onClick={onClick}
      >
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </Link>
    );
  }
  
  // Return button element
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;