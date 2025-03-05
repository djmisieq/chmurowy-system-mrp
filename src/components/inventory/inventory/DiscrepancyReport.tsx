"use client";

import React, { useState } from 'react';
import { 
  AlertTriangle,
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Save,
  FilePlus
} from 'lucide-react';
import { Inventory, InventoryItem } from '../mockInventory';

// Interfejs dla elementu z rozbieżnością inwentaryzacyjną
interface DiscrepancyItem extends InventoryItem {
  bookQuantity: number;
  actualQuantity: number;
  difference: number;
  differencePercent: number;
  correctionApproved?: boolean;
}

interface DiscrepancyReportProps {
  inventory: Inventory;
  discrepancies: DiscrepancyItem[];
  onApproveCorrection: (itemId: number) => void;
  onApproveAll: () => void;
  onGenerateReport: () => void;
  onSave: () => void;
}

const DiscrepancyReport: React.FC<DiscrepancyReportProps> = ({
  inventory,
  discrepancies,
  onApproveCorrection,
  onApproveAll,
  onGenerateReport,
  onSave
}) => {
  const [sortField, setSortField] = useState<keyof DiscrepancyItem>('difference');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Funkcja do sortowania danych
  const sortedDiscrepancies = [...discrepancies].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Sortowanie liczbowe
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Sortowanie tekstowe
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  // Funkcja do zmiany pola sortowania
  const handleSort = (field: keyof DiscrepancyItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Domyślnie sortuj malejąco
    }
  };

  // Liczenie statystyk rozbieżności
  const stats = {
    totalItems: discrepancies.length,
    totalWithDiscrepancy: discrepancies.filter(item => item.difference !== 0).length,
    positiveDiscrepancy: discrepancies.filter(item => item.difference > 0).length,
    negativeDiscrepancy: discrepancies.filter(item => item.difference < 0).length,
    approved: discrepancies.filter(item => item.correctionApproved).length
  };

  // Określanie wartości procentowej zatwierdzonych korekt
  const approvalPercentage = stats.totalWithDiscrepancy > 0 
    ? Math.round((stats.approved / stats.totalWithDiscrepancy) * 100) 
    : 0;

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Nagłówek */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Raport rozbieżności inwentaryzacyjnych
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Inwentaryzacja #{inventory.id} - {inventory.name}
            </p>
          </div>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={onGenerateReport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FilePlus size={16} className="mr-2" />
              Generuj raport PDF
            </button>
            <button
              onClick={onSave}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Save size={16} className="mr-2" />
              Zapisz zmiany
            </button>
            <button
              onClick={onApproveAll}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <CheckCircle size={16} className="mr-2" />
              Zatwierdź wszystkie korekty
            </button>
          </div>
        </div>
      </div>

      {/* Karty statystyk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Pozycje ogółem</p>
          <p className="text-2xl font-semibold">{stats.totalItems}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <p className="text-sm text-amber-600 font-medium">Z rozbieżnościami</p>
          <p className="text-2xl font-semibold">{stats.totalWithDiscrepancy}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <p className="text-sm text-green-600 font-medium">Nadwyżki</p>
          <p className="text-2xl font-semibold">{stats.positiveDiscrepancy}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <p className="text-sm text-red-600 font-medium">Niedobory</p>
          <p className="text-2xl font-semibold">{stats.negativeDiscrepancy}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <p className="text-sm text-purple-600 font-medium">Zatwierdzone</p>
          <div className="flex items-center">
            <p className="text-2xl font-semibold">{stats.approved}</p>
            <span className="ml-2 text-sm text-purple-600">({approvalPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* Tabela rozbieżności */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('code')}
              >
                Kod
                {sortField === 'code' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Nazwa
                {sortField === 'name' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('bookQuantity')}
              >
                Stan księgowy
                {sortField === 'bookQuantity' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('actualQuantity')}
              >
                Stan faktyczny
                {sortField === 'actualQuantity' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('difference')}
              >
                Różnica
                {sortField === 'difference' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('differencePercent')}
              >
                Różnica %
                {sortField === 'differencePercent' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDiscrepancies.map((item) => (
              <tr key={item.id} className={item.difference !== 0 ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.bookQuantity} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.actualQuantity} {item.unit}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  item.difference > 0 
                    ? 'text-green-600' 
                    : item.difference < 0 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                }`}>
                  {item.difference > 0 ? '+' : ''}{item.difference} {item.unit}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  item.differencePercent > 0 
                    ? 'text-green-600' 
                    : item.differencePercent < 0 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                }`}>
                  {item.differencePercent > 0 ? '+' : ''}{item.differencePercent.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {item.difference !== 0 && (
                    <button
                      onClick={() => onApproveCorrection(item.id)}
                      disabled={item.correctionApproved}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                        item.correctionApproved
                          ? 'bg-green-100 text-green-800 cursor-default'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {item.correctionApproved ? (
                        <>
                          <CheckCircle size={16} className="mr-1" />
                          Zatwierdzone
                        </>
                      ) : (
                        <>
                          <RefreshCw size={16} className="mr-1" />
                          Zatwierdź korektę
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stopka */}
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Uwaga:</span> Po zatwierdzeniu korekt stany magazynowe zostaną automatycznie zaktualizowane.
          </div>
          <button
            onClick={onSave}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Save size={16} className="mr-2" />
            Zapisz i zatwierdź raport
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscrepancyReport;