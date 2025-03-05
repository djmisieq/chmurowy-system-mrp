"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus, Filter, RefreshCw } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import { mockOperations } from '../../../components/inventory/mockOperations';

// Import komponentów (zostaną zaimplementowane później)
import OperationFilterPanel from '../../../components/inventory/operations/OperationFilterPanel';
import OperationTypeSelector from '../../../components/inventory/operations/OperationTypeSelector';
import OperationForm from '../../../components/inventory/operations/OperationForm';
import OperationTable from '../../../components/inventory/operations/OperationTable';

type ViewMode = 'list' | 'new';

const InventoryOperationsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Pobierz aktywny widok z parametrów URL (lista lub formularz nowej operacji)
  const [viewMode, setViewMode] = useState<ViewMode>(
    searchParams.get('view') === 'new' ? 'new' : 'list'
  );
  
  // Stan dla filtrów
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    executor: searchParams.get('executor') || ''
  });
  
  // Stan dla typu nowej operacji
  const [operationType, setOperationType] = useState(searchParams.get('operationType') || 'PZ');
  
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    
    // Opcjonalnie: aktualizacja URL z nowymi parametrami filtru
    const params = new URLSearchParams();
    if (viewMode === 'new') params.set('view', viewMode);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.dateFrom) params.set('dateFrom', newFilters.dateFrom);
    if (newFilters.dateTo) params.set('dateTo', newFilters.dateTo);
    if (newFilters.executor) params.set('executor', newFilters.executor);
    
    router.push(`/inventory/operations?${params.toString()}`);
  };
  
  const handleNewOperation = (type: string = 'PZ') => {
    setOperationType(type);
    setViewMode('new');
    
    // Aktualizacja URL
    const params = new URLSearchParams();
    params.set('view', 'new');
    params.set('operationType', type);
    router.push(`/inventory/operations?${params.toString()}`);
  };
  
  const handleSwitchToList = () => {
    setViewMode('list');
    
    // Aktualizacja URL
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.executor) params.set('executor', filters.executor);
    
    router.push(`/inventory/operations?${params.toString()}`);
  };
  
  const handleOperationSubmit = (operationData: any) => {
    // Tutaj normalnie byłby kod wysyłający dane do API
    console.log('Zapisywanie operacji:', operationData);
    alert('Operacja została zapisana pomyślnie!');
    handleSwitchToList();
  };
  
  // Filtrowanie operacji
  const filteredOperations = mockOperations.filter(op => {
    // Filtruj według typu operacji
    if (filters.type && op.type !== filters.type) return false;
    
    // Filtruj według daty
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      if (new Date(op.date) < dateFrom) return false;
    }
    
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      if (new Date(op.date) > dateTo) return false;
    }
    
    // Filtruj według wykonawcy
    if (filters.executor && !op.executor.toLowerCase().includes(filters.executor.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Operacje magazynowe</h2>
          <p className="mt-1 text-sm text-gray-500">Zarządzaj przyjmowaniem, wydawaniem i przesuwaniem elementów</p>
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <>
          {/* Panel akcji */}
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleNewOperation()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus size={18} className="mr-1" />
                Nowa operacja
              </button>
              <OperationTypeSelector onSelect={handleNewOperation} />
            </div>
            
            <button
              onClick={() => alert('Odświeżanie danych...')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <RefreshCw size={18} className="mr-1" />
              Odśwież
            </button>
          </div>
        
          {/* Panel filtrów */}
          <OperationFilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        
          {/* Tabela operacji */}
          <OperationTable
            operations={filteredOperations}
            onView={(id) => router.push(`/inventory/operations/${id}`)}
            onPrint={(id) => alert(`Drukowanie dokumentu #${id}`)}
            onAdjust={(id) => alert(`Korekta dokumentu #${id}`)}
            onCancel={(id) => alert(`Anulowanie dokumentu #${id}`)}
          />
        </>
      ) : (
        /* Formularz nowej operacji */
        <OperationForm
          type={operationType}
          onCancel={handleSwitchToList}
          onSubmit={handleOperationSubmit}
        />
      )}
    </MainLayout>
  );
};

export default InventoryOperationsPage;