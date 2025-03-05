"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import CategoryTree from '../../../components/inventory/categories/CategoryTree';
import LocationManager from '../../../components/inventory/categories/LocationManager';
import { mockCategories, mockLocations } from '../../../components/inventory/mockCategories';

const InventoryCategoriesPage = () => {
  // Stan aktywnych zakładek
  const [activeTab, setActiveTab] = useState<'categories' | 'locations'>('categories');
  
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
      
      {/* Zakładki */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('categories')}
            className={`${
              activeTab === 'categories'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Kategorie
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`${
              activeTab === 'locations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Lokalizacje
          </button>
        </nav>
      </div>
      
      {/* Zawartość zakładek */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {activeTab === 'categories' ? (
          <CategoryTree 
            categories={mockCategories} 
            onAddCategory={(parentId) => console.log(`Dodaj kategorię pod`, parentId)}
            onEditCategory={(id) => console.log(`Edytuj kategorię`, id)}
            onDeleteCategory={(id) => console.log(`Usuń kategorię`, id)}
            onAttributesManage={(id) => console.log(`Zarządzaj atrybutami kategorii`, id)}
          />
        ) : (
          <LocationManager 
            locations={mockLocations}
            onAddLocation={(parentId) => console.log(`Dodaj lokalizację pod`, parentId)}
            onEditLocation={(id) => console.log(`Edytuj lokalizację`, id)}
            onDeleteLocation={(id) => console.log(`Usuń lokalizację`, id)}
            onItemsManage={(id) => console.log(`Zarządzaj elementami w lokalizacji`, id)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default InventoryCategoriesPage;