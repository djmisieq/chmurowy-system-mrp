"use client";

import React from 'react';
import { 
  Factory, 
  Clock, 
  BarChart2, 
  Settings, 
  Calendar,
  Truck
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import NavCard from '../../components/orders/NavCard';
import { mockProductionOrders, productionStatus } from '../../components/orders/mockProductionOrders';

const ProductionPage = () => {
  // Formatowanie wartości do wyświetlenia
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Produkcja</h2>
        <p className="mt-1 text-sm text-gray-500">Zarządzanie zleceniami produkcyjnymi</p>
      </div>
      
      {/* Karty statystyk */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Factory className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">W trakcie produkcji</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{productionStatus.inProgress}</div>
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
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Zaplanowane</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{productionStatus.planned}</div>
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
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Efektywność produkcji</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {Math.round((productionStatus.totalActualHours / productionStatus.totalEstimatedHours) * 100)}%
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
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Oczekujące na materiały</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{productionStatus.onHold}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Kafelki nawigacyjne */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <NavCard 
          title="Plan produkcji" 
          description="Planowanie i zarządzanie zleceniami produkcyjnymi"
          icon={<Calendar size={24} />}
          href="/production/planning" 
        />
        <NavCard 
          title="Harmonogram" 
          description="Harmonogramowanie zasobów i zleceń"
          icon={<Clock size={24} />}
          href="/production/scheduling" 
        />
        <NavCard 
          title="Realizacja produkcji" 
          description="Bieżąca kontrola i raportowanie produkcji"
          icon={<Factory size={24} />}
          href="/production/execution" 
        />
        <NavCard 
          title="Raporty produkcyjne" 
          description="Analiza wydajności i efektywności produkcji"
          icon={<BarChart2 size={24} />}
          href="/production/reports" 
        />
      </div>
      
      {/* Lista aktywnych zleceń produkcyjnych */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Aktywne zlecenia produkcyjne</h3>
          <p className="mt-1 text-sm text-gray-500">Zlecenia w trakcie realizacji i planowania</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nr zlecenia
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zamówienie klienta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Przypisane do
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data rozpoczęcia
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorytet
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockProductionOrders
                .filter(order => order.status === 'in_progress' || order.status === 'planned')
                .map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" 
                      onClick={() => window.location.href = `/production/${order.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a href={`/orders/sales/${order.relatedCustomerOrderId}`} 
                         className="text-blue-600 hover:text-blue-900"
                         onClick={(e) => e.stopPropagation()}>
                        {order.relatedCustomerOrderNumber}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'in_progress' ? 'bg-green-100 text-green-800' : 
                          order.status === 'planned' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status === 'in_progress' ? 'W produkcji' : 
                         order.status === 'planned' ? 'Zaplanowane' : 
                         order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.assignedTo || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          order.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {order.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              {mockProductionOrders.filter(order => order.status === 'in_progress' || order.status === 'planned').length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Brak aktywnych zleceń produkcyjnych.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {mockProductionOrders.filter(order => order.status === 'in_progress' || order.status === 'planned').length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="text-sm">
              <a href="/production/planning" className="font-medium text-blue-600 hover:text-blue-500">
                Zobacz wszystkie zlecenia produkcyjne <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Informacja o implementacji */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
        <p className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Uwaga:</span>
          <span className="ml-1">Podstrony modułu produkcji są w trakcie implementacji. Ta strona pokazuje powiązanie z modułem zamówień.</span>
        </p>
      </div>
    </MainLayout>
  );
};

export default ProductionPage;