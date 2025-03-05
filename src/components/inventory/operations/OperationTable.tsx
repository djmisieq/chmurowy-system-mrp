"use client";

import React from 'react';
import Link from 'next/link';
import { File, Printer, Edit, Trash2, Eye } from 'lucide-react';
import { Operation } from '../models/operationModels';
import { getOperationTypeInfo } from '../models/operationTypes';

interface OperationTableProps {
  operations: Operation[];
  onView?: (id: number) => void;
  onPrint?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const OperationTable: React.FC<OperationTableProps> = ({ 
  operations,
  onView = () => {},
  onPrint = () => {},
  onEdit = () => {},
  onDelete = () => {},
  canEdit = true,
  canDelete = true
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
  
  // Formatowanie wartości
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '-';
    
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Klasy CSS dla statusów
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Etykiety dla statusów
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Zatwierdzony';
      case 'pending':
        return 'Oczekujący';
      case 'draft':
        return 'Projekt';
      case 'cancelled':
        return 'Anulowany';
      default:
        return status;
    }
  };
  
  // Czy operacja może być edytowana
  const canEditOperation = (operation: Operation) => {
    return canEdit && (operation.status === 'draft' || operation.status === 'pending');
  };
  
  // Czy operacja może być usunięta
  const canDeleteOperation = (operation: Operation) => {
    return canDelete && operation.status === 'draft';
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {operations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Brak operacji</h3>
          <p className="mt-1 text-sm text-gray-500">Nie znaleziono żadnych operacji spełniających kryteria wyszukiwania.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokument
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokalizacja
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Użytkownik
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
              {operations.map((operation) => {
                const typeInfo = getOperationTypeInfo(operation.type);
                
                return (
                  <tr key={operation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/inventory/operations/${operation.id}`} className="text-blue-600 hover:text-blue-900">
                        {operation.documentNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}>
                        {typeInfo.code}
                      </span>
                      <span className="ml-2">{typeInfo.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(operation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(operation.status)}`}>
                        {getStatusLabel(operation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operation.sourceLocation && operation.targetLocation ? (
                        <>
                          <span className="text-red-600">{operation.sourceLocation}</span>
                          <span className="mx-1">→</span>
                          <span className="text-green-600">{operation.targetLocation}</span>
                        </>
                      ) : operation.sourceLocation ? (
                        <span>{operation.sourceLocation}</span>
                      ) : operation.targetLocation ? (
                        <span>{operation.targetLocation}</span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operation.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(operation.totalValue)}
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
                        {canEditOperation(operation) && (
                          <button
                            onClick={() => onEdit(operation.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edytuj"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        {canDeleteOperation(operation) && (
                          <button
                            onClick={() => onDelete(operation.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Usuń"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OperationTable;
