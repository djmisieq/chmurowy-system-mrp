"use client";

import React from 'react';
import { 
  BarChart3, 
  ArrowUpRight, 
  AlertTriangle,
  Clock 
} from 'lucide-react';
import { orderStats } from './mockData';
import { attentionOrders } from './mockCustomerOrders';
import { attentionPurchaseOrders, upcomingDeliveries } from './mockPurchaseOrders';
import { activeProductionOrders } from './mockProductionOrders';

export const OrdersOverview = () => {
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

  return (
    <div className="space-y-6">
      {/* Zamówienia wymagające uwagi */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Zamówienia wymagające uwagi</h3>
          </div>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            {attentionOrders.length + attentionPurchaseOrders.length} elementów
          </span>
        </div>
        <div className="divide-y divide-gray-200">
          {attentionOrders.map((order) => (
            <div key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-blue-600 truncate">
                  <a href={`/orders/sales/${order.id}`} className="hover:underline">
                    {order.orderNumber} - {order.customer.name}
                  </a>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {order.priority}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <div className="flex items-center text-sm text-gray-500 mr-6">
                    <span className="truncate">Status: {order.status}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <span>Wartość: {formatCurrency(order.totalValue)}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <span>Data dostawy: {formatDate(order.deliveryDate)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {attentionPurchaseOrders.map((order) => (
            <div key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-purple-600 truncate">
                  <a href={`/orders/purchase/${order.id}`} className="hover:underline">
                    {order.orderNumber} - {order.supplier.name}
                  </a>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {order.priority}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <div className="flex items-center text-sm text-gray-500 mr-6">
                    <span className="truncate">Status: {order.status}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <span>Wartość: {formatCurrency(order.totalValue)}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <span>Oczekiwana dostawa: {formatDate(order.expectedDeliveryDate)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {attentionOrders.length === 0 && attentionPurchaseOrders.length === 0 && (
            <div className="px-4 py-5 sm:px-6 text-gray-500 text-center">
              Brak zamówień wymagających szczególnej uwagi.
            </div>
          )}
        </div>
      </div>

      {/* Nadchodzące dostawy */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Nadchodzące dostawy</h3>
          </div>
          <a href="/orders/purchase?filter=upcoming" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Zobacz wszystkie
          </a>
        </div>
        <div className="divide-y divide-gray-200">
          {upcomingDeliveries.map((order) => (
            <div key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-purple-600 truncate">
                  <a href={`/orders/purchase/${order.id}`} className="hover:underline">
                    {order.orderNumber} - {order.supplier.name}
                  </a>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {formatDate(order.expectedDeliveryDate)}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  {order.items.length} {order.items.length === 1 ? 'pozycja' : 'pozycje'}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <span>Wartość: {formatCurrency(order.totalValue)}</span>
                </div>
              </div>
            </div>
          ))}
          {upcomingDeliveries.length === 0 && (
            <div className="px-4 py-5 sm:px-6 text-gray-500 text-center">
              Brak nadchodzących dostaw.
            </div>
          )}
        </div>
      </div>

      {/* Streszczenie aktywności produkcyjnej */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Aktywne zlecenia produkcyjne</h3>
          </div>
          <a href="/production" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Zobacz wszystkie
          </a>
        </div>
        <div className="divide-y divide-gray-200">
          {activeProductionOrders.map((order) => (
            <div key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-green-600 truncate">
                  <a href={`/production/${order.id}`} className="hover:underline">
                    {order.orderNumber} ({order.relatedCustomerOrderNumber})
                  </a>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'in_progress' ? 'bg-green-100 text-green-800' : 
                    order.status === 'planned' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'in_progress' ? 'W produkcji' : 
                     order.status === 'planned' ? 'Zaplanowane' : 
                     'Wstrzymane'}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  {order.assignedTo || 'Nieprzypisane'}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  {order.status === 'in_progress' && order.items[0].actualHours && (
                    <span>Postęp: {Math.round((order.items[0].actualHours / order.items[0].estimatedHours) * 100)}%</span>
                  )}
                  {order.status !== 'in_progress' && (
                    <span>Start: {order.startDate ? formatDate(order.startDate) : 'Nie rozpoczęto'}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {activeProductionOrders.length === 0 && (
            <div className="px-4 py-5 sm:px-6 text-gray-500 text-center">
              Brak aktywnych zleceń produkcyjnych.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersOverview;