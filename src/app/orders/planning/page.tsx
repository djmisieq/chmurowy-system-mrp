"use client";

import React, { useState } from 'react';
import { 
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Plus,
  FileDown,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import { mockCustomerOrders } from '../../../components/orders/mockCustomerOrders';
import { mockPurchaseOrders } from '../../../components/orders/mockPurchaseOrders';
import { mockInventoryItems } from '../../../components/inventory/mockInventory';

const PurchasePlanningPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showProposed, setShowProposed] = useState(false);
  
  // Formatowanie wartości do wyświetlenia
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Obliczanie pozycji z niskim stanem
  const getLowStockItems = () => {
    return mockInventoryItems.filter(item => item.stock < item.minStock);
  };

  // Pozycje na podstawie zamówień - symulacja
  const getRequiredItems = () => {
    // Symulacja - pozycje potrzebne do realizacji zamówień klientów
    const pendingOrders = mockCustomerOrders.filter(
      order => order.status === 'new' || order.status === 'confirmed'
    );
    
    const requiredItems = [
      {
        id: 2,
        code: 'KAD-18CL',
        name: 'Kadłub 18ft Classic',
        category: 'Kadłuby',
        currentStock: 3,
        requiredQuantity: 5,
        suggestedOrderQuantity: 7,
        orderValue: 175000,
        supplier: 'Yacht Parts S.A.',
        priority: 'high'
      },
      {
        id: 5,
        code: 'TAP-PR',
        name: 'Zestaw tapicerski Premium',
        category: 'Tapicerka',
        currentStock: 15,
        requiredQuantity: 5,
        suggestedOrderQuantity: 0,
        orderValue: 0,
        supplier: 'Yacht Parts S.A.',
        priority: 'normal'
      },
      {
        id: 1,
        code: 'SIL-40KM',
        name: 'Silnik podwieszany 40KM',
        category: 'Napęd',
        currentStock: 12,
        requiredQuantity: 8,
        suggestedOrderQuantity: 0,
        orderValue: 0,
        supplier: 'Marine Motors Sp. z o.o.',
        priority: 'normal'
      },
      {
        id: 4,
        code: 'ZB-100L',
        name: 'Zbiornik paliwa 100L',
        category: 'Paliwo',
        currentStock: 2,
        requiredQuantity: 10,
        suggestedOrderQuantity: 10,
        orderValue: 12000,
        supplier: 'BoatSupplies',
        priority: 'high'
      },
      {
        id: 3,
        code: 'KON-STD',
        name: 'Konsola sterowa Standard',
        category: 'Sterowanie',
        currentStock: 8,
        requiredQuantity: 6,
        suggestedOrderQuantity: 8,
        orderValue: 44000,
        supplier: 'Yacht Parts S.A.',
        priority: 'normal'
      }
    ];
    
    return requiredItems;
  };

  // Scalanie obu list i filtrowanie
  const mergedItems = [...getRequiredItems()];
  
  // Filtrowanie
  const filteredItems = mergedItems.filter(item => {
    // Filtrowanie po kategorii
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    
    // Filtrowanie po wyszukiwanym tekście
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.code.toLowerCase().includes(searchLower) ||
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.supplier.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrowanie tylko pozycji z propozycją zamówienia
    if (showProposed && item.suggestedOrderQuantity <= 0) {
      return false;
    }
    
    return true;
  });

  // Dostępne kategorie
  const categories = [...new Set(mergedItems.map(item => item.category))];

  // Funkcja do określania klasy dla priorytetu
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Stan zaznaczonych pozycji
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Zaznaczanie/odznaczanie wszystkich pozycji
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };
  
  // Zaznaczanie/odznaczanie pojedynczej pozycji
  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Planowanie zakupów</h2>
          <p className="mt-1 text-sm text-gray-500">Analizuj zapotrzebowanie i planuj zamówienia do dostawców</p>
        </div>
        <div className="flex space-x-3">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={selectedItems.length === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Utwórz zamówienie
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Przelicz zapotrzebowanie
          </button>
        </div>
      </div>
      
      {/* Karty statystyk */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Elementy poniżej minimum</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{getLowStockItems().length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sugerowane pozycje do zamówienia</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {getRequiredItems().filter(item => item.suggestedOrderQuantity > 0).length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RotateCcw className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Otwarte zamówienia</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {mockPurchaseOrders.filter(order => 
                        order.status === 'sent' || order.status === 'confirmed' || order.status === 'draft'
                      ).length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Wartość planowanych zakupów</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(
                        getRequiredItems().reduce((sum, item) => sum + item.orderValue, 0)
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtry i wyszukiwanie */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-96">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Szukaj elementów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="mr-2 text-sm text-gray-700">Kategoria:</span>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Wszystkie</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showProposed"
              checked={showProposed}
              onChange={() => setShowProposed(!showProposed)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showProposed" className="text-sm text-gray-700">
              Tylko z sugestią zamówienia
            </label>
          </div>
        </div>
      </div>
      
      {/* Tabela planowania */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kod
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nazwa
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoria
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stan
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Potrzebna ilość
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zamów
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wartość
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dostawca
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorytet
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {item.code}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm ${item.currentStock < item.requiredQuantity ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {item.currentStock}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.requiredQuantity}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.suggestedOrderQuantity > 0 ? (
                      <span className="text-blue-600">{item.suggestedOrderQuantity}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.orderValue > 0 ? formatCurrency(item.orderValue) : '-'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.supplier}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-3 py-4 text-center text-sm text-gray-500">
                    Brak elementów spełniających kryteria wyszukiwania.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default PurchasePlanningPage;