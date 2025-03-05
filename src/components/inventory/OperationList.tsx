"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowLeftRight, RefreshCw, Truck, Box, Printer, Eye, Edit, X } from 'lucide-react';

export interface Operation {
  id: string;
  type: 'PZ' | 'WZ' | 'PW' | 'RW' | 'MM' | 'IN';
  number: string;
  date: string;
  status: 'completed' | 'in_progress' | 'cancelled' | 'draft';
  user: string;
  items: number;
  total: number;
  description?: string;
  externalDocument?: string;
}

interface OperationListProps {
  operations: Operation[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onPrint: (id: string) => void;
  onCancel: (id: string) => void;
}

const OperationList: React.FC<OperationListProps> = ({ 
  operations,
  onView,
  onEdit,
  onPrint,
  onCancel
}) => {
  // Formatowanie daty
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Formatowanie wartości waluty
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Ikona dla typu operacji
  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'PZ':
        return <Truck className="text-green-600" size={18} />;
      case 'WZ':
        return <ArrowUp className="text-red-600" size={18} />;
      case 'PW':
        return <ArrowDown className="text-blue-600" size={18} />;
      case 'RW':
        return <Box className="text-yellow-600" size={18} />;
      case 'MM':
        return <ArrowLeftRight className="text-indigo-600" size={18} />;
      case 'IN':
        return <RefreshCw className="text-purple-600" size={18} />;
      default:
        return null;
    }
  };
  
  // Etykieta dla typu operacji
  const getOperationTypeLabel = (type: string) => {
    switch (type) {
      case 'PZ':
        return 'Przyjęcie zewnętrzne';
      case 'WZ':
        return 'Wydanie zewnętrzne';
      case 'PW':
        return 'Przyjęcie wewnętrzne';
      case 'RW':
        return 'Wydanie wewnętrzne';
      case 'MM':
        return 'Przesunięcie międzymagazynowe';
      case 'IN':
        return 'Inwentaryzacja';
      default:
        return type;
    }
  };
  
  // Status operacji z odpowiednimi klasami
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Zakończone';
      case 'in_progress':
        return 'W trakcie';
      case 'cancelled':
        return 'Anulowane';
      case 'draft':
        return 'Wersja robocza';
      default:
        return status;
    }
  };
  
  // Sprawdzanie, czy operacja może być edytowana/anulowana
  const canEditOrCancel = (status: string) => {
    return status === 'draft' || status === 'in_progress';
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {operations.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Brak operacji magazynowych do wyświetlenia
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Użytkownik
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pozycje
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
              {operations.map((operation) => (
                <tr key={operation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {getOperationIcon(operation.type)}
                      <span className="ml-2">{getOperationTypeLabel(operation.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={`/inventory/operations/${operation.id}`}>
                      {operation.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(operation.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(operation.status)}`}
                    >
                      {getStatusLabel(operation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(operation.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(operation.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Podgląd"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onPrint(operation.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Drukuj"
                      >
                        <Printer size={18} />
                      </button>
                      {canEditOrCancel(operation.status) && (
                        <>
                          <button
                            onClick={() => onEdit(operation.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Edytuj"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => onCancel(operation.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Anuluj"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OperationList;
