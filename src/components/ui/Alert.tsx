"use client";

import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Alert component for notifications and messages
 */
const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  // Default icons based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  // Variant classes
  const variantClasses = {
    info: 'bg-primary-50 text-primary-800 border-primary-200',
    success: 'bg-success-50 text-success-800 border-success-200',
    warning: 'bg-warning-50 text-warning-800 border-warning-200',
    error: 'bg-danger-50 text-danger-800 border-danger-200',
  };

  // Icon variant classes
  const iconVariantClasses = {
    info: 'text-primary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-danger-500',
  };

  return (
    <div
      className={`
        flex items-start p-4 rounded-md border
        ${variantClasses[variant]}
        ${className}
      `}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 mr-3 ${iconVariantClasses[variant]}`}>
        {icon || getDefaultIcon()}
      </div>

      {/* Content */}
      <div className="flex-grow">
        {title && <div className="font-medium mb-1">{title}</div>}
        <div className="text-sm">{children}</div>
      </div>

      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 ml-3 p-1 rounded-full hover:bg-white ${iconVariantClasses[variant]}`}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
