"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Download, Search, Filter } from 'lucide-react';
import MainLayout from '../../../../components/layout/MainLayout';
import { 
  mockInventories, 
  Inventory, 
  InventoryItem,
  formatDate
} from '../../../../components/inventory/mockInventory';

const InventorySheetsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInventory, setSelectedInventory] = useState<number | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Filtrowana lista inwentaryzacji (tylko aktywne lub w trakcie)
  const activeInventories = mockInventories.filter(inv => 
    inv.status === 'planned' || inv.status === 'in_progress'
  );
  
  // Pobierz aktualnie wybraną inwentaryzację
  const currentInventory = selectedInventory 
    ? mockInventories.find(inv => inv.id === Number(selectedInventory)) 
    : undefined;
  
  // Filtruj elementy według wyszukiwania i statusu
  const getFilteredItems = (): InventoryItem[] => {
    if (!currentInventory) return [];
    
    let items = [...currentInventory.items];
    
    // Filtruj według statusu
    if (selectedStatus !== 'all') {
      items = items.filter(item => item.status === selectedStatus);
    }
    
    // Filtruj według wyszukiwania
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.itemCode.toLowerCase().includes(query) ||
        item.itemName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }
    
    return items;
  };
  
  const filteredItems = getFilteredItems();
  
  // Drukowanie arkusza
  const handlePrintSheet = () => {
    if (!currentInventory) return;
    
    alert(`Drukowanie arkusza inwentaryzacyjnego dla: ${currentInventory.name}`);
  };
  
  // Eksport do Excel
  const handleExportToExcel = () => {
    if (!currentInventory) return;
    
    alert(`Eksport arkusza inwentaryzacyjnego do Excel dla: ${currentInventory.name}`);
  };
  
  // Obsługa wprowadzania wyników
  const handleEditItem = (item: InventoryItem) => {
    router.push(`/inventory/inventory/${item.inventoryId}/count?itemId=${item.id}`);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory/inventory" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Arkusze inwentaryzacyjne</h2>
          <p className="mt-1 text-sm text-gray-500">Generowanie i zarządzanie arkuszami spisu z natury</p>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 sm:mb-0 mb-3">
            Zarządzanie arkuszami
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={handlePrintSheet}
              disabled={!currentInventory}
              className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md ${
                currentInventory
                  ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              <Printer size={16} className="mr-2" />
              Drukuj
            </button>
            <button
              onClick={handleExportToExcel}
              disabled={!currentInventory}
              className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md ${
                currentInventory
                  ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              <Download size={16} className="mr-2" />
              Eksportuj
            </button>
          </div>
        </div>
        
        {/* Filtry i wyszukiwanie */}
        <div className="px-4 py-4 sm:p-6 bg-white border-b border-gray-200">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="inventory-select" className="block text-sm font-medium text-gray-700 mb-1">
                Wybierz inwentaryzację
              </label>
              <select
                id="inventory-select"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={selectedInventory}
                onChange={(e) => setSelectedInventory(e.target.value)}
              >
                <option value="">Wybierz inwentaryzację</option>
                {activeInventories.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} ({formatDate(inv.planDate)})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
                Status elementu
              </label>
              <select
                id="status-select"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={!currentInventory}
              >
                <option value="all">Wszystkie</option>
                <option value="pending">Oczekujące</option>
                <option value="counted">Policzone</option>
                <option value="approved">Zatwierdzone</option>
                <option value="adjusted">Skorygowane</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Wyszukaj
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Kod, nazwa, kategoria..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={!currentInventory}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Zawartość arkusza */}
        <div className="overflow-x-auto">
          {!currentInventory ? (
            <div className="p-8 text-center text-gray-500">
              Wybierz inwentaryzację, aby zobaczyć jej elementy i wygenerować arkusz.
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Brak elementów spełniających kryteria filtrowania.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Kod
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nazwa elementu
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Kategoria
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lokalizacja
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stan księgowy
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stan faktyczny
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
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
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.itemCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.expectedQuantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.countedQuantity !== undefined 
                        ? `${item.countedQuantity} ${item.unit}` 
                        : <span className="text-gray-400">Nie policzono</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : item.status === 'counted'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'pending'
                          ? 'Oczekujący'
                          : item.status === 'counted'
                          ? 'Policzony'
                          : item.status === 'approved'
                          ? 'Zatwierdzony'
                          : 'Skorygowany'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-primary-600 hover:text-primary-900"
                        disabled={item.status === 'approved'}
                      >
                        {item.status === 'pending' ? 'Wprowadź' : 'Edytuj'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Informacja o liczbie elementów */}
        {currentInventory && (
          <div className="px-4 py-3 sm:px-6 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
            Wyświetlanie {filteredItems.length} z {currentInventory.items.length} elementów
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default InventorySheetsPage;