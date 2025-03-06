"use client";

import React, { useMemo } from 'react';
import { mockCustomerOrders } from './mockCustomerOrders';
import { mockPurchaseOrders } from './mockPurchaseOrders';

interface RecentOrdersProps {
  type: 'sales' | 'purchase';
  limit?: number;
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ type, limit = 5 }) => {
  // Formatowanie wartości do wyświetlenia
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Stan dla typu zamówień do wyświetlenia
  const ordersToDisplay = useMemo(() => {
    if (type === 'sales') {
      return mockCustomerOrders
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, limit);
    } else {
      return mockPurchaseOrders
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, limit);
    }
  }, [type, limit]);

  const getStatusBadgeClass = (status: string) => {
    if (type === 'sales') {
      switch (status) {
        case 'new':
          return 'bg-blue-100 text-blue-800';
        case 'confirmed':
          return 'bg-indigo-100 text-indigo-800';
        case 'in_production':
          return 'bg-yellow-100 text-yellow-800';
        case 'ready':
          return 'bg-green-100 text-green-800';
        case 'shipped':
          return 'bg-purple-100 text-purple-800';
        case 'completed':
          return 'bg-gray-100 text-gray-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'draft':
          return 'bg-gray-100 text-gray-800';
        case 'sent':
          return 'bg-blue-100 text-blue-800';
        case 'confirmed':
          return 'bg-indigo-100 text-indigo-800';
        case 'partially_received':
          return 'bg-yellow-100 text-yellow-800';
        case 'received':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const getStatusLabel = (status: string) => {
    if (type === 'sales') {
      switch (status) {
        case 'new':
          return 'Nowe';
        case 'confirmed':
          return 'Potwierdzone';
        case 'in_production':
          return 'W produkcji';
        case 'ready':
          return 'Gotowe';
        case 'shipped':
          return 'Wysłane';
        case 'completed':
          return 'Zrealizowane';
        case 'cancelled':
          return 'Anulowane';
        default:
          return status;
      }
    } else {
      switch (status) {
        case 'draft':
          return 'Szkic';
        case 'sent':
          return 'Wysłane';
        case 'confirmed':
          return 'Potwierdzone';
        case 'partially_received':
          return 'Częściowo otrzymane';
        case 'received':
          return 'Otrzymane';
        case 'cancelled':
          return 'Anulowane';
        default:
          return status;
      }
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {ordersToDisplay.map((order) => (
          <li key={order.id}>
            <a
              href={`/orders/${type}/${order.id}`}
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <div className="flex text-sm">
                      <p className="font-medium text-blue-600 truncate">
                        {order.orderNumber}
                      </p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                        {type === 'sales' 
                          ? `- ${(order as any).customer.name}` 
                          : `- ${(order as any).supplier.name}`}
                      </p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>
                          Data zamówienia: {formatDate(order.orderDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 flex flex-col flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                    <div className="mt-2 text-sm text-gray-500 text-right">
                      {formatCurrency(order.totalValue)}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
        {ordersToDisplay.length === 0 && (
          <li className="px-4 py-5 text-center text-gray-500">
            Brak zamówień do wyświetlenia.
          </li>
        )}
      </ul>
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex justify-end">
          <a
            href={`/orders/${type}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Zobacz wszystkie zamówienia
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;