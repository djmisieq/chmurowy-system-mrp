"use client";

import React, { useState, useEffect } from 'react';
import { SalesOrder } from '../../../types/orders';
import OrderStatusBadge from '../shared/OrderStatusBadge';
import PriorityBadge from '../shared/PriorityBadge';
import Link from 'next/link';
import { Eye, Edit, FileText } from 'lucide-react';

interface SalesOrdersListProps {
  initialOrders?: SalesOrder[];
}

const SalesOrdersList: React.FC<SalesOrdersListProps> = ({ initialOrders = [] }) => {
  const [orders, setOrders] = useState<SalesOrder[]>(initialOrders);
  const [loading, setLoading] = useState<boolean>(initialOrders.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrders.length === 0) {
      fetchOrders();
    }
  }, [initialOrders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // W przyszłości zastąpimy to rzeczywistym API
      const response = await fetch('/api/sales-orders');
      const data = await response.json();
      
      if (data && data.salesOrders) {
        setOrders(data.salesOrders);
      } else {
        setError('Brak danych lub nieprawidłowy format danych');
      }
    } catch (err) {
      console.error('Błąd podczas pobierania zamówień:', err);
      setError('Wystąpił błąd podczas pobierania zamówień. Spróbuj ponownie później.');
      
      // Tymczasowo - gdy API nie jest dostępne, załaduj dane mockowane
      try {
        const mockResponse = await fetch('/mock-api/sales-orders.json');
        const mockData = await mockResponse.json();
        if (mockData && mockData.salesOrders) {
          setOrders(mockData.salesOrders);
          setError(null);
        }
      } catch (mockErr) {
        console.error('Nie można załadować mockowanych danych:', mockErr);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800">
        <p>{error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200 text-red-800"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Brak zamówień klientów</p>
        <button 
          onClick={() => {}}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Dodaj nowe zamówienie
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Klient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data zamówienia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Termin dostawy
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priorytet
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Wartość
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akcje
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.orderNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.customerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.orderDate).toLocaleDateString('pl-PL')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.requestedDeliveryDate).toLocaleDateString('pl-PL')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <OrderStatusBadge status={order.status} type="sales" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PriorityBadge priority={order.priority} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.totalValue.toLocaleString('pl-PL')} zł
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link href={`/orders/sales/${order.id}`} className="text-blue-600 hover:text-blue-900">
                    <Eye size={18} />
                  </Link>
                  <Link href={`/orders/sales/${order.id}/edit`} className="text-amber-600 hover:text-amber-900">
                    <Edit size={18} />
                  </Link>
                  <Link href={`/orders/sales/${order.id}/print`} className="text-gray-600 hover:text-gray-900">
                    <FileText size={18} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesOrdersList;