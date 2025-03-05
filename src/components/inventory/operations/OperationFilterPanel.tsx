"use client";

import React, { useState } from 'react';
import { Search, Filter, ChevronDown, X, Calendar } from 'lucide-react';
import { OPERATION_TYPE_LIST } from '../models/operationTypes';
import { OPERATION_STATUSES } from '../models/operationModels';

export interface OperationFilters {
  search: string;
  types: string[];
  status: string;
  dateFrom: string;
  dateTo: string;
  user: string;
}

interface OperationFilterPanelProps {
  onFilter: (filters: OperationFilters) => void;
  users?: string[];
}

const OperationFilterPanel: React.FC<OperationFilterPanelProps> = ({ 
  onFilter, 
  users = []
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OperationFilters>({
    search: '',
    types: [],
    status: '',
    dateFrom: '',
    dateTo: '',
    user: ''
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };
  
  const handleTypeToggle = (typeId: string) => {
    let newTypes: string[];
    if (filters.types.includes(typeId)) {
      newTypes = filters.types.filter(id => id !== typeId);
    } else {
      newTypes = [...filters.types, typeId];
    }
    
    const newFilters = { ...filters, types: newTypes };
    setFilters(newFilters);
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, status: e.target.value };
    setFilters(newFilters);
  };
  
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, dateFrom: e.target.value };
    setFilters(newFilters);
  };
  
  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, dateTo: e.target.value };
    setFilters(newFilters);
  };
  
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, user: e.target.value };
    setFilters(newFilters);
  };
  
  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      types: [],
      status: '',
      dateFrom: '',
      dateTo: '',
      user: ''
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-3 items-center mb-4">
          {/* Wyszukiwarka */}
          <div className="flex-grow flex items-center relative min-w-[250px]">
            <input
              type="text"
              placeholder="Szukaj po numerze dokumentu, opisie..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={handleSearchChange}
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
          </div>
          
          {/* Przycisk filtrów */}
          <button
            type="button"
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filtry
            <ChevronDown size={16} className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Przycisk wyszukiwania */}
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Szukaj
          </button>
        </div>
        
        {/* Panel filtrów rozszerzonych */}
        {showFilters && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Filtr typu operacji */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typy operacji</label>
                <div className="flex flex-wrap gap-2">
                  {OPERATION_TYPE_LIST.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        filters.types.includes(type.id)
                          ? `bg-${type.color}-100 text-${type.color}-800 border-${type.color}-300`
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                      onClick={() => handleTypeToggle(type.id)}
                    >
                      {type.code} - {type.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filtr statusu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.status}
                    onChange={handleStatusChange}
                  >
                    <option value="">Wszystkie</option>
                    {Object.values(OPERATION_STATUSES).map((status) => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
              
              {/* Filtr użytkownika */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Użytkownik</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.user}
                    onChange={handleUserChange}
                  >
                    <option value="">Wszyscy</option>
                    {users.map((user) => (
                      <option key={user} value={user}>{user}</option>
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
                    onChange={handleDateFromChange}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
                    onChange={handleDateToChange}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>
            
            {/* Przycisk czyszczenia filtrów */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                onClick={clearFilters}
              >
                <X size={16} className="mr-1" />
                Wyczyść wszystkie filtry
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OperationFilterPanel;
