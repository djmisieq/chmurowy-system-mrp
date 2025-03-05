"use client";

import React from 'react';
import { Edit, PlusCircle, MinusCircle, History, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { InventoryItem } from './mockData';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onAddStock: (item: InventoryItem) => void;
  onRemoveStock: (item: InventoryItem) => void;
  onViewHistory: (item: InventoryItem) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onEdit,
  onAddStock,
  onRemoveStock,
  onViewHistory,
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Formatowanie wartości walutowej
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
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
                Aktualny stan
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokalizacja
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jednostka
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wartość jedn.
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  Brak elementów spełniających kryteria wyszukiwania.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          item.status === 'good' ? 'bg-green-500' : 
                          item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-medium">{item.stock}</span>
                    <span className="text-gray-400 ml-1">
                      ({item.minStock} - {item.maxStock})
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'good'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status === 'good'
                        ? 'OK'
                        : item.status === 'warning'
                        ? 'Niski stan'
                        : 'Krytyczny'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(item.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="Edytuj"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onAddStock(item)}
                        className="text-gray-500 hover:text-green-600 transition-colors"
                        title="Przyjęcie na magazyn"
                      >
                        <PlusCircle size={18} />
                      </button>
                      <button
                        onClick={() => onRemoveStock(item)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Wydanie z magazynu"
                      >
                        <MinusCircle size={18} />
                      </button>
                      <button
                        onClick={() => onViewHistory(item)}
                        className="text-gray-500 hover:text-purple-600 transition-colors"
                        title="Historia operacji"
                      >
                        <History size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginacja */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Wyświetlanie <span className="font-medium">{items.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> do{' '}
              <span className="font-medium">
                {Math.min(currentPage * 10, items.length + (currentPage - 1) * 10)}
              </span>{' '}
              z <span className="font-medium">{items.length + (currentPage - 1) * 10}</span> elementów
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <span className="sr-only">Poprzednia</span>
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <span className="sr-only">Następna</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
