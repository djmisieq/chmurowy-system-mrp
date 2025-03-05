import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { operationTypes } from '../mockOperations';

interface OperationFilterPanelProps {
  filters: {
    type: string;
    dateFrom: string;
    dateTo: string;
    executor: string;
  };
  onFilterChange: (filters: any) => void;
}

const OperationFilterPanel: React.FC<OperationFilterPanelProps> = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value
    });
  };
  
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      type: '',
      dateFrom: '',
      dateTo: '',
      executor: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden shadow-sm">
      {/* Nagłówek panelu */}
      <div 
        className="px-4 py-3 flex justify-between items-center cursor-pointer bg-gray-50 border-b border-gray-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Filter size={18} className="text-gray-500 mr-2" />
          <span className="font-medium text-gray-700">Filtry</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div>
          <svg 
            className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Zawartość filtrów */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Filtr typu operacji */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Typ operacji
              </label>
              <select
                id="type"
                name="type"
                value={localFilters.type}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Wszystkie typy</option>
                {operationTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.id} - {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtr daty od */}
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                Data od
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={localFilters.dateFrom}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            {/* Filtr daty do */}
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                Data do
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={localFilters.dateTo}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            {/* Filtr wykonawcy */}
            <div>
              <label htmlFor="executor" className="block text-sm font-medium text-gray-700 mb-1">
                Wykonawca
              </label>
              <input
                type="text"
                id="executor"
                name="executor"
                value={localFilters.executor}
                onChange={handleInputChange}
                placeholder="Imię i nazwisko"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Przyciski akcji */}
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Resetuj
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Zastosuj filtry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationFilterPanel;