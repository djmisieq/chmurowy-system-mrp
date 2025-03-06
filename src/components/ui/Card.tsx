"use client";

import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Reusable Card component with consistent styling
 */
const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  action, 
  className = "", 
  children,
  footer
}) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div>
            {title && <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;