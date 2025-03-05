import React from 'react';
import MainLayout from '../../components/layout/MainLayout';

const InventoryPage = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Magazyn</h2>
        <p className="mt-1 text-sm text-gray-500">Zarządzanie stanem magazynowym i materiałami</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium">Ta sekcja jest w trakcie implementacji</h3>
          <p className="text-gray-500 mt-1">Funkcjonalność zarządzania magazynem zostanie dodana w kolejnej iteracji.</p>
        </div>
        
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-center px-4">
            Tutaj pojawi się kompletny widok magazynu z możliwością zarządzania stanami materiałów,
            wydawania i przyjmowania towarów oraz kontroli zapasów.
            <br /><br />
            Wróć do <a href="/" className="text-blue-600 hover:underline">Dashboard</a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryPage;
