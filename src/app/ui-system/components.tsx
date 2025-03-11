"use client";

import React from 'react';

/**
 * Component for displaying color swatches in the UI documentation
 */
export const ColorSwatch = ({ 
  color, 
  name, 
  hex, 
  textColor = 'text-black' 
}: { 
  color: string; 
  name: string; 
  hex: string; 
  textColor?: string;
}) => (
  <div className="flex flex-col">
    <div className={`h-16 rounded-lg ${color} border border-neutral-200 mb-2`}></div>
    <p className="text-sm font-medium">{name}</p>
    <p className="text-xs text-slate-500">{hex}</p>
  </div>
);

/**
 * Component for displaying icons in the UI documentation
 */
export const IconDisplay = ({ 
  icon, 
  name 
}: { 
  icon: React.ReactNode; 
  name: string;
}) => (
  <div className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg">
    <div className="text-slate-700 mb-2">{icon}</div>
    <p className="text-sm text-slate-600">{name}</p>
  </div>
);

/**
 * Component for displaying component examples with code snippets
 */
export const ComponentExample = ({
  title,
  description,
  children,
  code,
  className = '',
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  code: string;
  className?: string;
}) => {
  const [showCode, setShowCode] = React.useState(false);
  
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-white p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium text-slate-800">{title}</h3>
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {showCode ? 'Ukryj kod' : 'Pokaż kod'}
          </button>
        </div>
        
        {description && (
          <p className="text-sm text-slate-600 mb-4">{description}</p>
        )}
        
        <div className="p-4 border border-gray-100 rounded bg-gray-50">
          {children}
        </div>
      </div>
      
      {showCode && (
        <div className="bg-gray-900 p-4 text-gray-200 overflow-x-auto text-sm font-mono">
          <pre>{code}</pre>
        </div>
      )}
    </div>
  );
};

/**
 * Component for displaying a section in the UI documentation
 */
export const DocumentationSection = ({
  title,
  description,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`mb-12 ${className}`}>
    <h2 className="text-2xl font-semibold text-slate-800 mb-4">{title}</h2>
    {description && (
      <p className="text-slate-600 mb-6">{description}</p>
    )}
    {children}
  </section>
);

/**
 * Component for displaying subsections in the UI documentation
 */
export const DocumentationSubsection = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`mb-6 ${className}`}>
    <h3 className="text-lg font-semibold text-slate-700 mb-3">{title}</h3>
    {children}
  </div>
);
