"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Calendar, CheckCircle, AlertTriangle, Download, Printer, Play, Check, XCircle } from 'lucide-react';
import MainLayout from '../../../../components/layout/MainLayout';
import { 
  getInventoryById, 
  Inventory, 
  InventoryItem,
  formatDate,
  formatDateTime,
  formatCurrency,
  getStatusLabel,
  getTypeLabel,
  getCategoryName,
  getLocationName
} from '../../../../components/inventory/mockInventory';

interface InventoryDetailPageProps {
  params: {
    id: string;
  }
}

const InventoryDetailPage: React.FC<InventoryDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'items' | 'discrepancies'>('summary');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pobierz dane inwentaryzacji
  useEffect(() => {
    const inventoryData = getInventoryById(Number(params.id));
    
    if (inventoryData) {
      setInventory(inventoryData);
    }
  }, [params.id]);
  
  // Jeśli dane są ładowane
  if (!inventory) {
    return (
      <MainLayout>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie danych inwentaryzacji...</p>
        </div>
      </MainLayout>
    );
  }
  
  // Filtruj elementy według zakładki, statusu i wyszukiwania
  const getFilteredItems = (): InventoryItem[] => {
    let items = [...inventory.items];
    
    // Dla zakładki rozbieżności, pokaż tylko elementy z różnicą
    if (activeTab === 'discrepancies') {
      items = items.filter(item => 
        item.difference !== undefined && item.difference !== 0
      );
    }
    
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
  
  // Oblicz statystyki
  const getStatistics = () => {
    const totalItems = inventory.items.length;
    const countedItems = inventory.items.filter(item => item.status !== 'pending').length;
    const itemsWithDifference = inventory.items.filter(item => item.difference !== undefined && item.difference !== 0).length;
    
    let totalDifference = 0;
    let totalDifferenceValue = 0;
    
    inventory.items.forEach(item => {
      if (item.difference) {
        totalDifference += item.difference;
        totalDifferenceValue += item.differenceValue || 0;
      }
    });
    
    return {
      totalItems,
      countedItems,
      itemsWithDifference,
      progress: totalItems > 0 ? Math.round((countedItems / totalItems) * 100) : 0,
      totalDifference,
      totalDifferenceValue
    };
  };
  
  const stats = getStatistics();
  
  // Obsługa akcji
  const handlePrint = () => {
    alert('Drukowanie raportu inwentaryzacji');
  };
  
  const handleExport = () => {
    alert('Eksport raportu inwentaryzacji');
  };
  
  const handleStartInventory = () => {
    alert('Rozpoczynanie inwentaryzacji');
  };
  
  const handleCompleteInventory = () => {
    alert('Zakończenie inwentaryzacji');
  };
  
  const handleApproveInventory = () => {
    alert('Zatwierdzenie inwentaryzacji');
  };
  
  const handleCancelInventory = () => {
    alert('Anulowanie inwentaryzacji');
  };
  
  const handleApproveDiscrepancy = (itemId: number) => {
    alert(`Zatwierdzenie rozbieżności dla elementu #${itemId}`);
  };
  
  const handleAdjustQuantity = (itemId: number) => {
    router.push(`/inventory/inventory/${inventory.id}/count?itemId=${itemId}`);
  };
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory/inventory" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{inventory.name}</h2>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              inventory.status === 'planned'
                ? 'bg-blue-100 text-blue-800'
                : inventory.status === 'in_progress'
                ? 'bg-yellow-100 text-yellow-800'
                : inventory.status === 'completed' || inventory.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {getStatusLabel(inventory.status)}
            </span>
            <span className="mx-2">•</span>
            <span>{getTypeLabel(inventory.type)} inwentaryzacja</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
        {/* Nagłówek z akcjami */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-0">
            Szczegóły inwentaryzacji
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* Akcje dostępne dla wszystkich statusów */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Printer size={16} className="mr-1" />
              Drukuj
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Download size={16} className="mr-1" />
              Eksportuj
            </button>
            
            {/* Akcje specyficzne dla statusu */}
            {inventory.status === 'planned' && (
              <button
                onClick={handleStartInventory}
                className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Play size={16} className="mr-1" />
                Rozpocznij
              </button>
            )}
            
            {inventory.status === 'in_progress' && (
              <button
                onClick={handleCompleteInventory}
                className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Check size={16} className="mr-1" />
                Zakończ
              </button>
            )}
            
            {inventory.status === 'completed' && (
              <button
                onClick={handleApproveInventory}
                className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircle size={16} className="mr-1" />
                Zatwierdź
              </button>
            )}
            
            {(inventory.status === 'planned' || inventory.status === 'in_progress') && (
              <button
                onClick={handleCancelInventory}
                className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircle size={16} className="mr-1" />
                Anuluj
              </button>
            )}
          </div>
        </div>
        
        {/* Zakładki */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('summary')}
              className={`${
                activeTab === 'summary'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Podsumowanie
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`${
                activeTab === 'items'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Elementy ({inventory.items.length})
            </button>
            <button
              onClick={() => setActiveTab('discrepancies')}
              className={`${
                activeTab === 'discrepancies'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Rozbieżności ({stats.itemsWithDifference})
            </button>
          </nav>
        </div>
        
        {/* Zawartość zakładek */}
        <div className="p-4">
          {/* Zakładka Podsumowanie */}
          {activeTab === 'summary' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informacje podstawowe */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informacje podstawowe</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Typ inwentaryzacji:</span>
                      <span className="text-sm font-medium text-gray-900">{getTypeLabel(inventory.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="text-sm font-medium text-gray-900">{getStatusLabel(inventory.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Data planowana:</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(inventory.planDate)}</span>
                    </div>
                    {inventory.startDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Data rozpoczęcia:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(inventory.startDate)}</span>
                      </div>
                    )}
                    {inventory.endDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Data zakończenia:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(inventory.endDate)}</span>
                      </div>
                    )}
                    {inventory.type === 'partial' && inventory.categories && inventory.categories.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Kategorie:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {inventory.categories.map(id => getCategoryName(id)).join(', ')}
                        </span>
                      </div>
                    )}
                    {inventory.type === 'partial' && inventory.locations && inventory.locations.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Lokalizacje:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {inventory.locations.map(id => getLocationName(id)).join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Utworzono przez:</span>
                      <span className="text-sm font-medium text-gray-900">{inventory.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Data utworzenia:</span>
                      <span className="text-sm font-medium text-gray-900">{formatDateTime(inventory.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Statystyki */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Statystyki inwentaryzacji</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Postęp inwentaryzacji:</span>
                        <span className="text-sm font-medium text-gray-900">{stats.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${stats.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Wszystkie elementy:</span>
                      <span className="text-sm font-medium text-gray-900">{stats.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Policzone elementy:</span>
                      <span className="text-sm font-medium text-gray-900">{stats.countedItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Elementy z rozbieżnościami:</span>
                      <span className="text-sm font-medium text-gray-900">{stats.itemsWithDifference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Całkowita rozbieżność wartościowa:</span>
                      <span className={`text-sm font-medium ${stats.totalDifferenceValue > 0 ? 'text-green-600' : stats.totalDifferenceValue < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatCurrency(stats.totalDifferenceValue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Wykonawcy */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Users size={20} className="text-gray-500 mr-2" />
                  <h4 className="text-lg font-medium text-gray-900">Przypisani użytkownicy</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {inventory.assignedUsers.map((user, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-md shadow-sm">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                        {user.substring(0, 2)}
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">{user}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Opis */}
              {inventory.description && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Opis</h4>
                  <p className="text-sm text-gray-700">{inventory.description}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Zakładka Elementy */}
          {(activeTab === 'items' || activeTab === 'discrepancies') && (
            <div>
              {/* Filtry */}
              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <div className="sm:w-1/3">
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">Wszystkie statusy</option>
                    <option value="pending">Oczekujące</option>
                    <option value="counted">Policzone</option>
                    <option value="approved">Zatwierdzone</option>
                    <option value="adjusted">Skorygowane</option>
                  </select>
                </div>
                
                <div className="sm:w-2/3">
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
                    />
                  </div>
                </div>
              </div>
              
              {/* Tabela elementów */}
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-md">
                  {activeTab === 'discrepancies' 
                    ? 'Brak rozbieżności inwentaryzacyjnych.'
                    : 'Brak elementów spełniających kryteria filtrowania.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                          Nazwa
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
                          Stan księgowy
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Stan faktyczny
                        </th>
                        {activeTab === 'discrepancies' && (
                          <>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Różnica
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Wartość różnicy
                            </th>
                          </>
                        )}
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
                            {item.expectedQuantity} {item.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.countedQuantity !== undefined 
                              ? `${item.countedQuantity} ${item.unit}` 
                              : <span className="text-gray-400">-</span>
                            }
                          </td>
                          {activeTab === 'discrepancies' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <span className={item.difference! > 0 ? 'text-green-600' : 'text-red-600'}>
                                  {item.difference! > 0 ? '+' : ''}{item.difference} {item.unit}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <span className={item.differenceValue! > 0 ? 'text-green-600' : 'text-red-600'}>
                                  {formatCurrency(item.differenceValue!)}
                                </span>
                              </td>
                            </>
                          )}
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
                            {item.status === 'pending' && (
                              <button
                                onClick={() => handleAdjustQuantity(item.id)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Wprowadź
                              </button>
                            )}
                            {item.status === 'counted' && (
                              <div className="flex justify-end space-x-4">
                                <button
                                  onClick={() => handleApproveDiscrepancy(item.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Zatwierdź
                                </button>
                                <button
                                  onClick={() => handleAdjustQuantity(item.id)}
                                  className="text-primary-600 hover:text-primary-900"
                                >
                                  Edytuj
                                </button>
                              </div>
                            )}
                            {(item.status === 'approved' || item.status === 'adjusted') && (
                              <button
                                onClick={() => handleAdjustQuantity(item.id)}
                                className="text-primary-600 hover:text-primary-900"
                                disabled={inventory.status === 'approved'}
                              >
                                {inventory.status === 'approved' ? '-' : 'Edytuj'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Podsumowanie filtrów */}
              <div className="mt-4 text-sm text-gray-500">
                Wyświetlanie {filteredItems.length} z {activeTab === 'discrepancies' ? stats.itemsWithDifference : inventory.items.length} elementów
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryDetailPage;