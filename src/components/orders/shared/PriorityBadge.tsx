"use client";

import React from 'react';

interface PriorityBadgeProps {
  priority: 'low' | 'normal' | 'high' | 'critical';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  let color = '';
  let label = '';
  
  switch (priority) {
    case 'low':
      color = 'bg-gray-100 text-gray-800';
      label = 'Niski';
      break;
    case 'normal':
      color = 'bg-green-100 text-green-800';
      label = 'Normalny';
      break;
    case 'high':
      color = 'bg-amber-100 text-amber-800';
      label = 'Wysoki';
      break;
    case 'critical':
      color = 'bg-red-100 text-red-800';
      label = 'Krytyczny';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      label = 'Normalny';
  }

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
      {label}
    </span>
  );
};

export default PriorityBadge;