"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowLeftRight, 
  RefreshCw, 
  Clipboard, 
  ArrowDownLeft, 
  ArrowUpRight,
  Eye,
  Printer,
  Edit,
  XCircle
} from 'lucide-react';
import { InventoryOperation } from './mockOperations';

interface OperationsTableProps {
  operations: InventoryOperation[];
  onView: (id: number) => void;
  onPrint: (id: number) => void;
  onEdit: (id: number) => void;
  onCancel: (id: number) => void;
}

const OperationsTable: React.FC<OperationsTableProps> = ({ 
  operations,
  onView,
  onPrint,
  onEdit,
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
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Ikona dla typu operacji
  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'receipt':
        return <ArrowDown className="text-green-600" size={18} />;
      case 'issue':
        return <ArrowUp className="text-red-600" size={18} />;
      case 'internal_receipt':
        return <ArrowDownLeft className="text-teal-600" size={18} />;
      case 'internal_issue':
        return <ArrowUpRight className="text-amber-600" size={18} />;
      case 'transfer':
        return <ArrowLeftRight className="text-blue-600" size={18} />;
      case 'inventory':
        return <Clipboard className="text-purple-600" size={18} />;
      case 'adjustment':
        return <RefreshCw className="text-yellow-600" size={18} />;
      default:
        return null;
    }
  };
  
  // Etykieta dla typu operacji
  const getOperationTypeLabel = (type: string) => {
    switch (type) {
      case 'receipt':
        return 'Przyjęcie zewnętrzne (PZ)';
      case 'issue':
        return 'Wydanie zewnętrzne (WZ)';
      case 'internal_receipt':
        return 'Przyjęcie wewnętrzne (PW)';
      case 'internal_issue':
        return 'Wydanie wewnętrzne (RW)';
      case 'transfer':
        return 'Przesunięcie (MM)';
      case 'inventory':
        return 'Inwentaryzacja (IN)';
      case 'adjustment':
        return 'Korekta';
      default:
        return type;
    }
  };
  
  // Klasa dla statusu operacji
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Etykieta dla statusu operacji
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Zakończona';
      case 'pending':
        return 'W trakcie';
      case 'cancelled':
        return 'Anulowana';
      default:
        return status;
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dokument
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Typ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opis
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Użytkownik
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wartość
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {operations.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  Brak operacji magazynowych spełniających kryteria wyszukiwania
                </td>
              </tr>
            ) : (
              operations.map((operation) => (
                <tr key={operation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(operation.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                    <Link href={`/inventory/operations/${operation.id}`}>
                      {operation.documentNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getOperationIcon(operation.type)}
                      <span className="ml-2">{getOperationTypeLabel(operation.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {operation.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(operation.totalValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(operation.status)}`}>
                      {getStatusLabel(operation.status)}
                    </span>
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
                      {operation.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => onEdit(operation.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edytuj"
                            disabled={operation.status === 'cancelled'}
                            className={`${operation.status === 'cancelled' ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'}`}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => onCancel(operation.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Anuluj"
                            disabled={operation.status === 'cancelled'}
                            className={`${operation.status === 'cancelled' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperationsTable;
