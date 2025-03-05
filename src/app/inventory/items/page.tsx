"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import ActionPanel from '../../../components/inventory/ActionPanel';
import FilterPanel from '../../../components/inventory/FilterPanel';
import InventoryTable from '../../../components/inventory/InventoryTable';
import Pagination from '../../../components/inventory/Pagination';
import { 
  mockInventoryItems, 
  mockCategories, 
  mockLocations, 
  InventoryItem 
} from '../../../components/inventory/mockData';

const InventoryItemsPage = () => {
  const router = useRouter();
  
  // Stan dla danych
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<InventoryItem[]>([]);
  
  // Stan dla paginacji
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Stan dla filtrowania
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    category: '',
    location: '',
    status: ''
  });
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Inicjalizacja danych
  useEffect(() => {
    // Symulacja ładowania danych z API
    setItems(mockInventoryItems);
    setFilteredItems(mockInventoryItems);
    setTotalItems(mockInventoryItems.length);
  }, []);
  
  // Efekt dla filtrowania i sortowania
  useEffect(() => {
    let result = [...items];
    
    // Filtrowanie według wyszukiwanej frazy
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.code.toLowerCase().includes(query) || 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    // Filtrowanie według kategorii
    if (activeFilters.category) {
      result = result.filter(item => item.category === activeFilters.category);
    }
    
    // Filtrowanie według lokalizacji
    if (activeFilters.location) {
      result = result.filter(item => item.location === activeFilters.location);
    }
    
    // Filtrowanie według statusu
    if (activeFilters.status) {
      result = result.filter(item => item.status === activeFilters.status);
    }
    
    // Sortowanie
    result.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'stock':
          valueA = a.stock;
          valueB = b.stock;
          break;
        case 'value':
          valueA = a.value;
          valueB = b.value;
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredItems(result);
    setTotalItems(result.length);
    setCurrentPage(1); // Reset do pierwszej strony przy zmianie filtrów
  }, [items, searchQuery, activeFilters, sortField, sortDirection]);
  
  // Efekt dla paginacji
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedItems(filteredItems.slice(startIndex, endIndex));
  }, [filteredItems, currentPage, itemsPerPage]);
  
  // Obsługa akcji
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilter = (filters: Record<string, string>) => {
    setActiveFilters(filters);
  };
  
  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset do pierwszej strony przy zmianie ilości elementów na stronę
  };
  
  // Obsługa akcji dla elementów
  const handleEdit = (id: number) => {
    router.push(`/inventory/items/${id}/edit`);
  };
  
  const handleReceive = (id: number) => {
    router.push(`/inventory/operations/receive?itemId=${id}`);
  };
  
  const handleIssue = (id: number) => {
    router.push(`/inventory/operations/issue?itemId=${id}`);
  };
  
  const handleHistory = (id: number) => {
    router.push(`/inventory/items/${id}?tab=history`);
  };
  
  // Obliczenie całkowitej liczby stron
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Lista elementów magazynowych</h2>
          <p className="mt-1 text-sm text-gray-500">Przeglądaj i zarządzaj wszystkimi elementami</p>
        </div>
      </div>
      
      {/* Panel akcji */}
      <ActionPanel 
        onAddNew={() => router.push('/inventory/items/new')}
        onImport={() => alert('Import z CSV/Excel')}
        onExport={() => alert('Eksport danych')}
        onPrint={() => alert('Drukowanie etykiet/kodów')}
      />
      
      {/* Panel filtrowania */}
      <FilterPanel 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        categories={mockCategories}
        locations={mockLocations}
      />
      
      {/* Tabela elementów */}
      <div className="mb-4">
        <InventoryTable 
          items={displayedItems}
          onEdit={handleEdit}
          onReceive={handleReceive}
          onIssue={handleIssue}
          onHistory={handleHistory}
        />
      </div>
      
      {/* Paginacja */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={totalItems}
      />
    </MainLayout>
  );
};

export default InventoryItemsPage;
