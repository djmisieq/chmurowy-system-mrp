"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import ActionPanel from '../../../components/inventory/ActionPanel';
import FilterPanel, { FilterOptions } from '../../../components/inventory/FilterPanel';
import InventoryTable from '../../../components/inventory/InventoryTable';
import InventoryItemModal from '../../../components/inventory/InventoryItemModal';
import { mockInventoryItems, mockCategories, mockLocations, mockSuppliers, InventoryItem } from '../../../components/inventory/mockData';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const InventoryItemsPage = () => {
  // Stany dla filtrowania i sortowania
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  
  // Stany modali
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | undefined>(undefined);

  // Przefiltruj elementy przy zmianie filtrów
  useEffect(() => {
    filterItems();
  }, [searchTerm, filters]);

  // Funkcja filtrująca elementy
  const filterItems = () => {
    let result = [...mockInventoryItems];

    // Filtrowanie według wyszukiwanego tekstu
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        item =>
          item.code.toLowerCase().includes(term) ||
          item.name.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term) ||
          (item.supplier && item.supplier.toLowerCase().includes(term))
      );
    }

    // Filtrowanie według kategorii
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }

    // Filtrowanie według lokalizacji
    if (filters.location) {
      result = result.filter(item => item.location === filters.location);
    }

    // Filtrowanie według dostawcy
    if (filters.supplier) {
      result = result.filter(item => item.supplier === filters.supplier);
    }

    // Filtrowanie według stanu magazynowego
    if (filters.stockStatus) {
      switch (filters.stockStatus) {
        case 'low':
          result = result.filter(item => item.stock < item.minStock);
          break;
        case 'normal':
          result = result.filter(item => item.stock >= item.minStock && item.stock <= item.maxStock);
          break;
        case 'high':
          result = result.filter(item => item.stock > item.maxStock);
          break;
      }
    }

    // Sortowanie
    if (filters.sortBy) {
      result.sort((a, b) => {
        const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
        
        switch (filters.sortBy) {
          case 'name':
            return sortOrder * a.name.localeCompare(b.name);
          case 'stock':
            return sortOrder * (a.stock - b.stock);
          case 'value':
            return sortOrder * (a.value - b.value);
          default:
            return 0;
        }
      });
    }

    setFilteredItems(result);
    setCurrentPage(1); // Reset do pierwszej strony przy zmianie filtrów
  };

  // Obsługa dodawania nowego elementu
  const handleAddItem = () => {
    setCurrentItem(undefined);
    setIsAddModalOpen(true);
  };

  // Obsługa edycji elementu
  const handleEditItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  // Obsługa zapisu nowego elementu
  const handleSaveNewItem = (item: InventoryItem) => {
    // W rzeczywistej aplikacji tutaj byłyby wywołania API do zapisania elementu
    console.log('Zapisywanie nowego elementu:', item);
    setIsAddModalOpen(false);
    // Po zapisaniu można by odświeżyć listę
  };

  // Obsługa aktualizacji elementu
  const handleUpdateItem = (item: InventoryItem) => {
    // W rzeczywistej aplikacji tutaj byłyby wywołania API do aktualizacji elementu
    console.log('Aktualizacja elementu:', item);
    setIsEditModalOpen(false);
    // Po zapisaniu można by odświeżyć listę
  };

  // Obsługa przyjęcia na magazyn
  const handleAddStock = (item: InventoryItem) => {
    // W rzeczywistej aplikacji tutaj byłby modal do wprowadzenia ilości i szczegółów przyjęcia
    console.log('Przyjęcie na magazyn:', item);
  };

  // Obsługa wydania z magazynu
  const handleRemoveStock = (item: InventoryItem) => {
    // W rzeczywistej aplikacji tutaj byłby modal do wprowadzenia ilości i szczegółów wydania
    console.log('Wydanie z magazynu:', item);
  };

  // Obsługa podglądu historii
  const handleViewHistory = (item: InventoryItem) => {
    // W rzeczywistej aplikacji tutaj byłby widok historii operacji dla danego elementu
    console.log('Podgląd historii:', item);
  };

  // Obliczanie indeksów dla paginacji
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

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
        onAddNew={handleAddItem}
        onImport={() => console.log('Import z CSV/Excel')}
        onExport={() => console.log('Eksport danych')}
      />
      
      {/* Panel filtrowania */}
      <FilterPanel 
        categories={mockCategories}
        locations={mockLocations}
        suppliers={mockSuppliers}
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
      />
      
      {/* Tabela elementów */}
      <InventoryTable 
        items={currentItems}
        onEdit={handleEditItem}
        onAddStock={handleAddStock}
        onRemoveStock={handleRemoveStock}
        onViewHistory={handleViewHistory}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      {/* Modal dodawania nowego elementu */}
      <InventoryItemModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewItem}
        categories={mockCategories}
        locations={mockLocations}
        suppliers={mockSuppliers}
      />
      
      {/* Modal edycji elementu */}
      {currentItem && (
        <InventoryItemModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateItem}
          item={currentItem}
          categories={mockCategories}
          locations={mockLocations}
          suppliers={mockSuppliers}
          isEdit
        />
      )}
    </MainLayout>
  );
};

export default InventoryItemsPage;
