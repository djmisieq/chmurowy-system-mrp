"use client";

import React, { useState } from 'react';
import { Filter, ChevronDown, Calendar, User, X } from 'lucide-react';

type OperationType = 'all' | 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'inventory';

interface OperationFilterPanelProps {
  onFilterChange: (filters: {
    type: OperationType;
    dateFrom: string;
    dateTo: string;
    user: string;
  }) => void;
  users: string[];
}

const OperationFilterPanel: React.FC<OperationFilterPanelProps> = ({ 
  onFilterChange,
  users = []
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all' as OperationType,
    dateFrom: '',
    dateTo: '',
    user: ''
  });
  
  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearFilters = () => {
    const defaultFilters = {
      type: 'all' as OperationType,
      dateFrom: '',
      dateTo: '',
      user: ''
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };
  
  const operationTypes = [
    { value: 'all', label: 'Wszystkie operacje' },
    { value: 'receipt', label: 'Przyjęcie zewnętrzne (PZ)' },
    { value: 'issue', label: 'Wydanie zewnętrzne (WZ)' },
    { value: 'internal_receipt', label: 'Przyjęcie wewnętrzne (PW)' },
    { value: 'internal_issue', label: 'Wydanie wewnętrzne (RW)' },
    { value: 'transfer', label: 'Przesunięcie międzymagazynowe (MM)' },
    { value: 'inventory', label: 'Inwentaryzacja (IN)' }
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filtrowanie operacji</h3>
        <button
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} className="mr-2" />
          Filtry
          <ChevronDown size={16} className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {showFilters && (
        <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtr typu operacji */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Typ operacji</label>
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {operationTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Filtr daty od */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data od</label>
            <div className="relative">
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          {/* Filtr daty do */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data do</label>
            <div className="relative">
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          {/* Filtr użytkownika */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Użytkownik</label>
            <div className="relative">
              <select
                className="w-full appearance-none pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.user}
                onChange={(e) => handleFilterChange('user', e.target.value)}
              >
                <option value="">Wszyscy użytkownicy</option>
                {users.map((user) => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
              <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Przycisk czyszczenia filtrów */}
          <div className="md:col-span-2 lg:col-span-4 flex justify-end mt-2">
            <button
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              onClick={clearFilters}
            >
              <X size={16} className="mr-1" />
              Wyczyść wszystkie filtry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationFilterPanel;
