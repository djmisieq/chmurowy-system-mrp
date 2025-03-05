"use client";

import React, { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendType?: 'increase' | 'decrease' | 'neutral';
  color?: 'primary' | 'warning' | 'danger' | 'success' | 'info';
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendType = 'neutral',
  color = 'primary'
}) => {
  // Mapowanie kolorów na klasy Tailwind
  const colorClasses = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  };

  const trendColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-white">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trendColor[trendType]}`}>
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
