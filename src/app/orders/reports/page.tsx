"use client";

import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';

const OrderReportsPage = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Raporty zamówień</h2>
        <p className="mt-1 text-sm text-gray-500">Analityka i raporty dotyczące zamówień</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium">Ta sekcja jest w trakcie implementacji</h3>
          <p className="text-gray-500 mt-1">Funkcjonalność raportów zamówień zostanie dodana wkrótce.</p>
        </div>
        
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-center px-4">
            Tutaj pojawi się generator raportów z konfigurowalnymi parametrami, wizualizacjami danych i możliwością eksportu.
            <br /><br />
            Wróć do <a href="/orders" className="text-blue-600 hover:underline">Zamówień</a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderReportsPage;
