"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'rect' | 'text' | 'card';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
  repeat?: number;
}

/**
 * Skeleton component for loading states
 */
const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'line',
  width,
  height,
  animated = true,
  repeat = 1,
}) => {
  // Base skeleton style
  const baseStyle = `
    bg-gray-200 
    ${animated ? 'animate-pulse' : ''}
  `;
  
  // Variant-specific styles
  const variantStyles = {
    line: 'h-4 rounded w-full',
    circle: 'rounded-full',
    rect: 'rounded',
    text: 'h-4 rounded w-3/4',
    card: 'rounded w-full h-32',
  };
  
  // Generate a skeleton item with custom width and height if provided
  const renderSkeletonItem = () => {
    const style: React.CSSProperties = {};
    
    if (width) {
      style.width = typeof width === 'number' ? `${width}px` : width;
    }
    
    if (height) {
      style.height = typeof height === 'number' ? `${height}px` : height;
    }
    
    return (
      <div 
        className={`${baseStyle} ${variantStyles[variant]} ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  };
  
  // Generate multiple skeleton items if repeat > 1
  if (repeat > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: repeat }).map((_, index) => (
          <div key={index}>{renderSkeletonItem()}</div>
        ))}
      </div>
    );
  }
  
  return renderSkeletonItem();
};

// Predefined skeleton components for common use cases
Skeleton.Text = (props: Omit<SkeletonProps, 'variant'>) => (
  <Skeleton {...props} variant="text" />
);

Skeleton.Circle = (props: Omit<SkeletonProps, 'variant'>) => (
  <Skeleton {...props} variant="circle" />
);

Skeleton.Rect = (props: Omit<SkeletonProps, 'variant'>) => (
  <Skeleton {...props} variant="rect" />
);

Skeleton.Card = (props: Omit<SkeletonProps, 'variant'>) => (
  <Skeleton {...props} variant="card" />
);

// Table row skeleton
Skeleton.TableRow = ({ 
  columns = 4, 
  className = '' 
}: { 
  columns?: number;
  className?: string;
}) => (
  <div className={`flex space-x-4 ${className}`}>
    {Array.from({ length: columns }).map((_, index) => (
      <div key={index} className={`flex-1 ${index === 0 ? 'w-16 flex-grow-0' : ''}`}>
        <Skeleton variant="line" />
      </div>
    ))}
  </div>
);

// Table skeleton
Skeleton.Table = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: { 
  rows?: number;
  columns?: number;
  className?: string;
}) => (
  <div className={`space-y-4 ${className}`}>
    <Skeleton.TableRow columns={columns} />
    <div className="pt-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="py-2">
          <Skeleton.TableRow columns={columns} />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
