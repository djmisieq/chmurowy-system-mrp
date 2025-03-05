"use client";

import React from 'react';
import Link from 'next/link';
import { Edit, Package, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { InventoryItem } from './mockData';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (id: number) => void;
  onReceive: (id: number) => void;
  onIssue: (id: number) => void;
  onHistory: (id: number) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  items,
  onEdit,
  onReceive,
  onIssue,
  onHistory
}) => {
  // Formatowanie wartości waluty
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Status elementów z odpowiednimi klasami
  const getStatusClasses = (status: string, currentStock: number, minStock: number, maxStock: number) => {
    if (status === 'critical' || currentStock < minStock) {
      return 'bg-red-100 text-red-800';
    } else if (status === 'warning' || currentStock <= minStock * 1.2) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (currentStock > maxStock) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };
  
  const getStatusLabel = (status: string, currentStock: number, minStock: number, maxStock: number) => {
    if (status === 'critical' || currentStock < minStock) {
      return 'Krytyczny';
    } else if (status === 'warning' || currentStock <= minStock * 1.2) {
      return 'Niski stan';
    } else if (currentStock > maxStock) {
      return 'Nadwyżka';
    } else {
      return 'OK';
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kod/ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nazwa elementu
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stan
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min/Max
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokalizacja
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jednostka
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wartość
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/inventory/items/${item.id}`} className="text-blue-600 hover:text-blue-900">
                    {item.code}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/inventory/items/${item.id}`} className="hover:text-blue-600">
                    {item.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(item.status, item.stock, item.minStock, item.maxStock)}`}
                  >
                    {item.stock} {item.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.minStock} / {item.maxStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(item.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edytuj"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onReceive(item.id)}
                      className="text-green-600 hover:text-green-900"
                      title="Przyjęcie"
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button
                      onClick={() => onIssue(item.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Wydanie"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      onClick={() => onHistory(item.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Historia"
                    >
                      <Clock size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
