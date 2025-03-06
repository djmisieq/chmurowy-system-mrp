"use client";

import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
  type?: 'sales' | 'purchase' | 'production';
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, type = 'sales' }) => {
  let color = '';
  
  if (type === 'sales') {
    switch (status) {
      case 'draft':
        color = 'bg-gray-100 text-gray-800';
        break;
      case 'confirmed':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'in_production':
        color = 'bg-purple-100 text-purple-800';
        break;
      case 'ready':
        color = 'bg-amber-100 text-amber-800';
        break;
      case 'shipped':
        color = 'bg-indigo-100 text-indigo-800';
        break;
      case 'delivered':
        color = 'bg-green-100 text-green-800';
        break;
      case 'cancelled':
        color = 'bg-red-100 text-red-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
  } else if (type === 'purchase') {
    switch (status) {
      case 'draft':
        color = 'bg-gray-100 text-gray-800';
        break;
      case 'sent':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'confirmed':
        color = 'bg-purple-100 text-purple-800';
        break;
      case 'partially_received':
        color = 'bg-amber-100 text-amber-800';
        break;
      case 'received':
        color = 'bg-green-100 text-green-800';
        break;
      case 'cancelled':
        color = 'bg-red-100 text-red-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
  } else if (type === 'production') {
    switch (status) {
      case 'planned':
        color = 'bg-gray-100 text-gray-800';
        break;
      case 'in_progress':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'completed':
        color = 'bg-green-100 text-green-800';
        break;
      case 'on_hold':
        color = 'bg-amber-100 text-amber-800';
        break;
      case 'cancelled':
        color = 'bg-red-100 text-red-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
  }

  // Formatowanie statusu do wyświetlenia
  const formatStatus = (statusStr: string) => {
    return statusStr
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
      {formatStatus(status)}
    </span>
  );
};

export default OrderStatusBadge;