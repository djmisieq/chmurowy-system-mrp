"use client";

import React from 'react';
import {
  Package,
  AlertTriangle,
  DollarSign,
  ArrowLeftRight,
  List,
  BarChart2,
  Settings,
  Archive
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import StatsCard from '../../components/inventory/StatsCard';
import NavCard from '../../components/inventory/NavCard';
import { inventoryStats, attentionItems } from '../../components/inventory/mockData';

const InventoryPage = () => {
  // Formatowanie wartości do wyświetlenia
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Magazyn</h2>
        <p className="mt-1 text-sm text-gray-500">Zarządzanie stanem magazynowym i materiałami</p>
      </div>
      
      {/* Karty statystyk */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatsCard 
          title="Wszystkie elementy" 
          value={inventoryStats.totalItems.toString()} 
          icon={<Package size={24} />}
          trend="+12 (ostatni tydzień)" 
          trendType="increase" 
        />
        <StatsCard 
          title="Niski stan magazynowy" 
          value={inventoryStats.lowStockItems.toString()} 
          icon={<AlertTriangle size={24} />}
          trend="-5 (ostatni tydzień)" 
          trendType="decrease" 
          color="warning"
        />
        <StatsCard 
          title="Wartość magazynu" 
          value={formatCurrency(inventoryStats.totalValue)} 
          icon={<DollarSign size={24} />}
          trend="+5% (ostatni miesiąc)" 
          trendType="increase" 
          color="success"
        />
      </div>
      
      {/* Kafelki nawigacyjne */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <NavCard 
          title="Lista elementów" 
          description="Przeglądaj i zarządzaj wszystkimi elementami magazynowymi"
          icon={<List size={24} />}
          href="/inventory/items" 
        />
        <NavCard 
          title="Operacje magazynowe" 
          description="Rejestruj przyjęcia, wydania i przesunięcia"
          icon={<ArrowLeftRight size={24} />}
          href="/inventory/operations" 
        />
        <NavCard 
          title="Raporty magazynowe" 
          description="Analizuj stany i wartości magazynowe"
          icon={<BarChart2 size={24} />}
          href="/inventory/reports" 
        />
        <NavCard 
          title="Kategorie i lokalizacje" 
          description="Konfiguruj kategorie i zarządzaj lokalizacjami"
          icon={<Archive size={24} />}
          href="/inventory/categories" 
        />
      </div>
      
      {/* Tabela elementów wymagających uwagi */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Elementy wymagające uwagi</h3>
          <a
            href="/inventory/items?filter=attention"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Zobacz wszystkie
          </a>
        </div>
        
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kod
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nazwa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attentionItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.stock} / {item.minStock}+
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'good'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status === 'good'
                        ? 'OK'
                        : item.status === 'warning'
                        ? 'Ostrzeżenie'
                        : 'Krytyczny'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Informacja o implementacji */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
        <p className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Uwaga:</span>
          <span className="ml-1">Podstrony magazynu (lista elementów, operacje, raporty, kategorie) są w trakcie implementacji.</span>
        </p>
      </div>
    </MainLayout>
  );
};

export default InventoryPage;
