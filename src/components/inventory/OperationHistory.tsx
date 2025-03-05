"use client";

import React from 'react';
import { ArrowDown, ArrowUp, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { InventoryOperation } from './mockOperations';

interface OperationHistoryProps {
  operations: InventoryOperation[];
}

const OperationHistory: React.FC<OperationHistoryProps> = ({ operations }) => {
  // Formatowanie daty
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Mapowanie typu operacji na ikony i kolory
  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'receipt':
        return <ArrowDown className="text-green-600" size={18} />;
      case 'issue':
        return <ArrowUp className="text-red-600" size={18} />;
      case 'transfer':
        return <ArrowLeftRight className="text-blue-600" size={18} />;
      case 'adjustment':
        return <RefreshCw className="text-yellow-600" size={18} />;
      default:
        return null;
    }
  };
  
  const getOperationTypeLabel = (type: string) => {
    switch (type) {
      case 'receipt':
        return 'Przyjęcie';
      case 'issue':
        return 'Wydanie';
      case 'transfer':
        return 'Przesunięcie';
      case 'adjustment':
        return 'Korekta';
      default:
        return type;
    }
  };
  
  const getOperationRowClass = (type: string) => {
    switch (type) {
      case 'receipt':
        return 'bg-green-50';
      case 'issue':
        return 'bg-red-50';
      case 'transfer':
        return 'bg-blue-50';
      case 'adjustment':
        return 'bg-yellow-50';
      default:
        return '';
    }
  };
  
  return (
    <div>
      {operations.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Brak operacji dla tego elementu
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ilość
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokument
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Użytkownik
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokalizacja
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opis
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operations.map((operation) => (
                <tr key={operation.id} className={getOperationRowClass(operation.type)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(operation.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getOperationIcon(operation.type)}
                      <span className="ml-2">{getOperationTypeLabel(operation.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.type === 'issue' ? '-' : '+'}{operation.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.documentNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.type === 'transfer' ? (
                      <>
                        <span className="text-red-600">{operation.sourceLocation}</span>
                        <span className="mx-1">→</span>
                        <span className="text-green-600">{operation.targetLocation}</span>
                      </>
                    ) : operation.type === 'issue' ? (
                      <span>{operation.sourceLocation}</span>
                    ) : (
                      <span>{operation.targetLocation}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {operation.description}
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

export default OperationHistory;
