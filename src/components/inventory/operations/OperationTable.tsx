import React from 'react';
import { Eye, Printer, Edit, XCircle } from 'lucide-react';
import { Operation, getOperationStatus, formatDate, formatCurrency } from '../mockOperations';

interface OperationTableProps {
  operations: Operation[];
  onView: (id: number) => void;
  onPrint: (id: number) => void;
  onAdjust: (id: number) => void;
  onCancel: (id: number) => void;
}

const OperationTable: React.FC<OperationTableProps> = ({
  operations,
  onView,
  onPrint,
  onAdjust,
  onCancel
}) => {
  // Funkcja do obliczenia całkowitej wartości operacji
  const calculateTotalValue = (operation: Operation): number => {
    return operation.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  // Sprawdzenie czy dostępne są akcje dla danego statusu
  const canEdit = (status: string): boolean => status === 'draft';
  const canCancel = (status: string): boolean => status !== 'canceled';
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {operations.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Brak operacji</h3>
          <p className="mt-1 text-sm text-gray-500">
            Nie znaleziono operacji spełniających kryteria filtrowania.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokument zewnętrzny
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wykonawca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wartość
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operations.map((operation) => {
                const status = getOperationStatus(operation.status);
                const totalValue = calculateTotalValue(operation);
                
                return (
                  <tr key={operation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 cursor-pointer hover:underline" onClick={() => onView(operation.id)}>
                      {operation.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operation.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(operation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operation.externalDocument || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operation.executor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(totalValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onView(operation.id)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Podgląd"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onPrint(operation.id)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Drukuj"
                        >
                          <Printer size={18} />
                        </button>
                        {canEdit(operation.status) && (
                          <button
                            onClick={() => onAdjust(operation.id)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edytuj"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        {canCancel(operation.status) && (
                          <button
                            onClick={() => onCancel(operation.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Anuluj"
                          >
                            <XCircle size={18} />
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