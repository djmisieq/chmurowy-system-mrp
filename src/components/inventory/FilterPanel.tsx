"use client";

import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

interface FilterPanelProps {
  categories: string[];
  locations: string[];
  suppliers: { id: number; name: string }[];
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  category?: string;
  location?: string;
  supplier?: string;
  stockStatus?: 'all' | 'low' | 'normal' | 'high';
  sortBy?: 'name' | 'stock' | 'value';
  sortOrder?: 'asc' | 'desc';
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  locations,
  suppliers,
  onSearch,
  onFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value === '' ? undefined : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* Pasek wyszukiwania */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Szukaj elementów (kod, nazwa, kategoria...)"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtry
          </button>
        </div>
      </div>

      {/* Zaawansowane filtry */}
      {showAdvancedFilters && (
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Kategoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategoria
              </label>
              <select
                id="category"
                name="category"
                value={filters.category || ''}
                onChange={handleFilterChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">Wszystkie kategorie</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Lokalizacja */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Lokalizacja
              </label>
              <select
                id="location"
                name="location"
                value={filters.location || ''}
                onChange={handleFilterChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">Wszystkie lokalizacje</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Dostawca */}
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Dostawca
              </label>
              <select
                id="supplier"
                name="supplier"
                value={filters.supplier || ''}
                onChange={handleFilterChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">Wszyscy dostawcy</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stan magazynowy */}
            <div>
              <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Stan magazynowy
              </label>
              <select
                id="stockStatus"
                name="stockStatus"
                value={filters.stockStatus || ''}
                onChange={handleFilterChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">Wszystkie stany</option>
                <option value="low">Niski stan</option>
                <option value="normal">Normalny stan</option>
                <option value="high">Wysoki stan</option>
              </select>
            </div>

            {/* Sortowanie */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sortuj według
              </label>
              <div className="flex space-x-2">
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy || ''}
                  onChange={handleFilterChange}
                  className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="">Wybierz</option>
                  <option value="name">Nazwa</option>
                  <option value="stock">Stan</option>
                  <option value="value">Wartość</option>
                </select>
                <select
                  id="sortOrder"
                  name="sortOrder"
                  value={filters.sortOrder || ''}
                  onChange={handleFilterChange}
                  className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="">Kolejność</option>
                  <option value="asc">Rosnąco</option>
                  <option value="desc">Malejąco</option>
                </select>
              </div>
            </div>
          </div>

          {/* Przyciski akcji dla filtrów */}
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <X className="mr-2 h-4 w-4" />
              Wyczyść filtry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
