"use client";

import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string | number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  className?: string;
  iconBgColor?: string;
  iconTextColor?: string;
}

/**
 * StatCard component for displaying KPIs on the dashboard
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  className = '',
  iconBgColor = 'bg-primary-100',
  iconTextColor = 'text-primary-600'
}) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex items-center">
          {icon ? (
            <div className="flex-shrink-0">
              <div className={`h-10 w-10 rounded-md ${iconBgColor} flex items-center justify-center`}>
                <span className={iconTextColor}>{icon}</span>
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <div className={`h-10 w-10 rounded-md ${iconBgColor} flex items-center justify-center`}>
                <span className={iconTextColor}>{title.charAt(0)}</span>
              </div>
            </div>
          )}
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    changeType === 'increase' ? 'text-success-500' : 
                    changeType === 'decrease' ? 'text-danger-500' :
                    'text-gray-500'
                  }`}
                >
                  {changeType === 'increase' ? (
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                  ) : changeType === 'decrease' ? (
                    <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                  ) : null}
                  <span className="ml-1">{change}</span>
                </div>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;