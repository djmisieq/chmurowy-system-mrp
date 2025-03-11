"use client";

import React, { useState } from 'react';

interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  variant?: 'default' | 'boxed' | 'pills';
  fullWidth?: boolean;
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
}

/**
 * Tabs component for organizing content into multiple sections
 */
const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
  tabListClassName = '',
  tabPanelClassName = '',
}) => {
  // Use the first non-disabled tab as default if not specified
  const findDefaultTab = () => {
    if (defaultTab && tabs.some(tab => tab.id === defaultTab && !tab.disabled)) {
      return defaultTab;
    }
    const firstEnabledTab = tabs.find(tab => !tab.disabled);
    return firstEnabledTab ? firstEnabledTab.id : '';
  };

  const [activeTab, setActiveTab] = useState<string>(findDefaultTab());

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    if (onChange) {
      onChange(id);
    }
  };

  // Variant styles
  const getTabListClasses = () => {
    switch (variant) {
      case 'boxed':
        return 'bg-neutral-100 p-1 rounded-lg';
      case 'pills':
        return 'space-x-2';
      default:
        return 'border-b border-neutral-200';
    }
  };

  const getTabClasses = (id: string, disabled?: boolean) => {
    const isActive = id === activeTab;
    const baseClasses = `
      flex items-center px-4 py-2 text-sm font-medium
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      transition-colors duration-200
      ${fullWidth ? 'flex-1 justify-center' : ''}
    `;

    switch (variant) {
      case 'boxed':
        return `
          ${baseClasses}
          ${isActive
            ? 'bg-white text-primary-700 shadow-sm rounded-md'
            : 'text-neutral-600 hover:text-primary-600'}
        `;
      case 'pills':
        return `
          ${baseClasses}
          rounded-full
          ${isActive
            ? 'bg-primary-600 text-white'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary-600'}
        `;
      default:
        return `
          ${baseClasses}
          -mb-px
          ${isActive
            ? 'border-b-2 border-primary-500 text-primary-700'
            : 'text-neutral-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-100'}
        `;
    }
  };

  return (
    <div className={className}>
      {/* Tab List */}
      <div className={`flex ${fullWidth ? 'w-full' : ''} ${getTabListClasses()} ${tabListClassName}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={getTabClasses(tab.id, tab.disabled)}
            onClick={tab.disabled ? undefined : () => handleTabChange(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className={`mt-4 ${tabPanelClassName}`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
