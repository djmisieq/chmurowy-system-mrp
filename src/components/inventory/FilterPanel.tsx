"use client";

import React, { useState } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

interface FilterPanelProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  categories: string[];
  locations: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  onSearch, 
  onFilter, 
  onSort,
  categories = [],
  locations = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    category: '',
    location: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSearch = () => {
    onSearch(searchQuery);
  };
  
  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };
  
  const handleSortChange = (field: string) => {
    const direction = field === sortBy && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortDirection(direction);
    onSort(field, direction);
  };
  
  const clearFilters = () => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as Record<string, string>);
    
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex flex-wrap gap-3 items-center mb-4">
        {/* Wyszukiwarka */}
        <div className="flex-grow flex items-center relative min-w-[250px]">
          <input
            type="text"
            placeholder="Szukaj po kodzie, nazwie..."
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
        
        {/* Sortowanie */}
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              handleSortChange(field);
            }}
          >
            <option value="name-asc">Nazwa: A-Z</option>
            <option value="name-desc">Nazwa: Z-A</option>
            <option value="stock-asc">Stan: rosnąco</option>
            <option value="stock-desc">Stan: malejąco</option>
            <option value="value-asc">Wartość: rosnąco</option>
            <option value="value-desc">Wartość: malejąco</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>
      
      {/* Panel filtrów rozszerzonych */}
      {showFilters && (
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtr kategorii */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Wszystkie</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Filtr lokalizacji */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokalizacja</label>
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="">Wszystkie</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Filtr statusu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Wszystkie</option>
                <option value="good">OK</option>
                <option value="warning">Niski stan</option>
                <option value="critical">Krytyczny</option>
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

export default FilterPanel;
