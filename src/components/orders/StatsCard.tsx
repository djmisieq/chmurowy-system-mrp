"use client";

import React, { ReactNode } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  trendType?: 'increase' | 'decrease' | 'neutral';
  color?: 'primary' | 'warning' | 'danger' | 'success';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendType = 'neutral',
  color = 'primary'
}) => {
  // Mapowanie kolorów na klasy Tailwind
  const colorClasses = {
    primary: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800'
  };

  const trendColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-12 w-12 rounded-md flex items-center justify-center ${colorClasses[color]}`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {trend && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColor[trendType]}`}>
                  {trendType === 'increase' ? (
                    <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                  ) : trendType === 'decrease' ? (
                    <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                  ) : null}
                  <span className="ml-1">{trend}</span>
                </div>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;