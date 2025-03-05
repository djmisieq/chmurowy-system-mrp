"use client";

import React, { useState } from 'react';
import { Search, Filter, Calendar, ChevronDown, X, User } from 'lucide-react';

interface OperationFilterPanelProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onDateFilter: (startDate: string, endDate: string) => void;
}

const OperationFilterPanel: React.FC<OperationFilterPanelProps> = ({ 
  onSearch, 
  onFilter,
  onDateFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    type: '',
    user: ''
  });
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const handleSearch = () => {
    onSearch(searchQuery);
  };
  
  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };
  
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    onDateFilter(newDateRange.startDate, newDateRange.endDate);
  };
  
  const clearFilters = () => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as Record<string, string>);
    
    setFilters(emptyFilters);
    setDateRange({ startDate: '', endDate: '' });
    onFilter(emptyFilters);
    onDateFilter('', '');
  };
  
  // Przykładowi użytkownicy
  const users = [
    'Jan Nowak',
    'Anna Kowalska',
    'Tomasz Wiśniewski',
    'Marta Nowicka'
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex flex-wrap gap-3 items-center mb-4">
        {/* Wyszukiwarka */}
        <div className="flex-grow flex items-center relative min-w-[250px]">
          <input
            type="text"
            placeholder="Szukaj po numerze dokumentu, opisie..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
            onClick={handleSearch}
          />
        </div>
        
        {/* Przycisk filtrów */}
        <button
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} className="mr-2" />
          Filtry
          <ChevronDown size={16} className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Filtr dat */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Calendar size={18} className="mr-2 text-gray-500" />
            <span className="text-sm text-gray-500 mr-2">Od:</span>
            <input 
              type="date" 
              className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Do:</span>
            <input 
              type="date" 
              className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Panel filtrów rozszerzonych */}
      {showFilters && (
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtr typu operacji */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Typ operacji</label>
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">Wszystkie</option>
                <option value="receipt">Przyjęcie zewnętrzne (PZ)</option>
                <option value="issue">Wydanie zewnętrzne (WZ)</option>
                <option value="internal_receipt">Przyjęcie wewnętrzne (PW)</option>
                <option value="internal_issue">Wydanie wewnętrzne (RW)</option>
                <option value="transfer">Przesunięcie międzymagazynowe (MM)</option>
                <option value="inventory">Inwentaryzacja (IN)</option>
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
                onChange={(e) => handleFilterChange('user', e.target.value)}
              >
                <option value="">Wszyscy</option>
                {users.map((user) => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Przycisk czyszczenia filtrów */}
          <div className="md:col-span-3 flex justify-end mt-2">
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
