"use client";

import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import SalesOrdersList from '../../../components/orders/sales/SalesOrdersList';
import { Plus, Filter, Download, Printer } from 'lucide-react';

const SalesOrdersPage = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Zamówienia klientów</h2>
          <p className="mt-1 text-sm text-gray-500">Zarządzanie zamówieniami od klientów</p>
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 flex items-center hover:bg-gray-50"
          >
            <Filter size={16} className="mr-2" />
            Filtry
          </button>
          <button 
            onClick={() => {}}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 flex items-center hover:bg-gray-50"
          >
            <Download size={16} className="mr-2" />
            Eksport
          </button>
          <button 
            onClick={() => {}}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 flex items-center hover:bg-gray-50"
          >
            <Printer size={16} className="mr-2" />
            Drukuj
          </button>
          <button 
            onClick={() => {}}
            className="px-4 py-2 bg-blue-600 rounded-md text-white flex items-center hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Nowe zamówienie
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">Filtry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Wszystkie statusy</option>
                <option value="draft">Wersja robocza</option>
                <option value="confirmed">Potwierdzone</option>
                <option value="in_production">W produkcji</option>
                <option value="ready">Gotowe</option>
                <option value="shipped">Wysłane</option>
                <option value="delivered">Dostarczone</option>
                <option value="cancelled">Anulowane</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Klient
              </label>
              <input 
                type="text" 
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nazwa klienta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data od
              </label>
              <input 
                type="date" 
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data do
              </label>
              <input 
                type="date" 
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button 
              onClick={() => {}}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              Wyczyść filtry
            </button>
            <button 
              onClick={() => {}}
              className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
            >
              Zastosuj filtry
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium">Lista zamówień klientów</h3>
          <p className="text-gray-500 mt-1">Przeglądaj i zarządzaj zamówieniami od klientów.</p>
        </div>
        
        <SalesOrdersList />
      </div>
    </MainLayout>
  );
};

export default SalesOrdersPage;