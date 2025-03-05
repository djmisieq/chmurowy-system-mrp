"use client";

import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const InventoryCategoriesPage = () => {
  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Kategorie i lokalizacje</h2>
          <p className="mt-1 text-sm text-gray-500">Zarządzaj kategoriami elementów i lokalizacjami magazynowymi</p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium">Ta sekcja jest w trakcie implementacji</h3>
          <p className="text-gray-500 mt-1">Zarządzanie kategoriami i lokalizacjami zostanie dodane w kolejnej iteracji.</p>
        </div>
        
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-center px-4">
            Tutaj pojawi się interfejs do zarządzania kategoriami elementów magazynowych oraz ich 
            lokalizacjami w magazynie (regały, półki, przegródki).
            <br /><br />
            Wróć do <Link href="/inventory" className="text-blue-600 hover:underline">Dashboardu magazynu</Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryCategoriesPage;
