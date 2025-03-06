"use client";

import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Link from 'next/link';
import { ShoppingBag, TruckDelivery, Calendar, Factory, History, PieChart } from 'lucide-react';

const OrdersPage = () => {
  const orderModules = [
    { 
      name: 'Zamówienia klientów', 
      icon: ShoppingBag, 
      href: '/orders/sales',
      description: 'Zarządzanie zamówieniami od klientów',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500' 
    },
    { 
      name: 'Zamówienia do dostawców', 
      icon: TruckDelivery, 
      href: '/orders/purchase',
      description: 'Zarządzanie zamówieniami do dostawców',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500' 
    },
    { 
      name: 'Planowanie zakupów', 
      icon: Calendar, 
      href: '/orders/planning',
      description: 'Planowanie zakupów na podstawie zapotrzebowania',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500' 
    },
    { 
      name: 'Zlecenia produkcyjne', 
      icon: Factory, 
      href: '/orders/production',
      description: 'Zarządzanie zleceniami produkcyjnymi',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500' 
    },
    { 
      name: 'Historia zamówień', 
      icon: History, 
      href: '/orders/history',
      description: 'Archiwum i historia zamówień',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-500' 
    },
    { 
      name: 'Raporty', 
      icon: PieChart, 
      href: '/orders/reports',
      description: 'Analityka i raporty dotyczące zamówień',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500' 
    }
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Zamówienia</h2>
        <p className="mt-1 text-sm text-gray-500">Zarządzanie zamówieniami klientów i dostawców</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium">Panel zamówień</h3>
          <p className="text-gray-500 mt-1">
            Moduł zamówień jest w trakcie implementacji. Wybierz jedną z poniższych sekcji, aby przejść do odpowiedniego widoku.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderModules.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className={`${module.bgColor} p-6 rounded-lg hover:shadow-md transition-shadow flex flex-col items-center text-center`}
            >
              <module.icon className={`${module.iconColor} h-12 w-12 mb-4`} />
              <h3 className="font-medium text-gray-900 mb-1">{module.name}</h3>
              <p className="text-sm text-gray-500">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium">Statystyki zamówień</h3>
          <p className="text-gray-500 mt-1">Podsumowanie aktualnego stanu zamówień i zleceń produkcyjnych</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Zamówienia klientów</p>
            <p className="text-2xl font-bold text-blue-800">5</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Zamówienia do dostawców</p>
            <p className="text-2xl font-bold text-green-800">4</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-amber-600 mb-1">Zlecenia produkcyjne</p>
            <p className="text-2xl font-bold text-amber-800">5</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">W realizacji</p>
            <p className="text-2xl font-bold text-purple-800">2</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 italic">
          Funkcjonalność pełnego dashboardu zamówień będzie dostępna w kolejnych iteracjach.
        </p>
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
