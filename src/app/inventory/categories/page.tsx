"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import CategoryTree from '../../../components/inventory/categories/CategoryTree';
import LocationManager from '../../../components/inventory/categories/LocationManager';
import CategoryForm from '../../../components/inventory/categories/CategoryForm';
import LocationForm from '../../../components/inventory/categories/LocationForm';
import { mockCategories, mockLocations, Category, Location } from '../../../components/inventory/mockCategories';

const InventoryCategoriesPage = () => {
  // Stan aktywnych zakładek
  const [activeTab, setActiveTab] = useState<'categories' | 'locations'>('categories');
  
  // Stan formularzy
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  const [parentLocationId, setParentLocationId] = useState<number | null>(null);
  
  // Obsługa kategorii
  const handleAddCategory = (parentId: number | null) => {
    setParentCategoryId(parentId);
    setEditingCategoryId(null);
    setIsCategoryFormOpen(true);
  };
  
  const handleEditCategory = (id: number) => {
    setEditingCategoryId(id);
    setParentCategoryId(null);
    setIsCategoryFormOpen(true);
  };
  
  const handleDeleteCategory = (id: number) => {
    // W rzeczywistej aplikacji tutaj byłoby API call
    alert(`Usuwanie kategorii o ID: ${id}`);
  };
  
  const handleSaveCategory = (category: Partial<Category>) => {
    // W rzeczywistej aplikacji tutaj byłoby API call
    console.log('Zapisywanie kategorii:', category);
    
    if (editingCategoryId) {
      alert(`Zaktualizowano kategorię: ${category.name}`);
    } else {
      alert(`Dodano nową kategorię: ${category.name}`);
    }
  };
  
  const handleAttributesManage = (id: number) => {
    // W rzeczywistej aplikacji tutaj byłoby modalne okno dla atrybutów
    alert(`Zarządzanie atrybutami kategorii o ID: ${id}`);
  };
  
  // Obsługa lokalizacji
  const handleAddLocation = (parentId: number | null) => {
    setParentLocationId(parentId);
    setEditingLocationId(null);
    setIsLocationFormOpen(true);
  };
  
  const handleEditLocation = (id: number) => {
    setEditingLocationId(id);
    setParentLocationId(null);
    setIsLocationFormOpen(true);
  };
  
  const handleDeleteLocation = (id: number) => {
    // W rzeczywistej aplikacji tutaj byłoby API call
    alert(`Usuwanie lokalizacji o ID: ${id}`);
  };
  
  const handleSaveLocation = (location: Partial<Location>) => {
    // W rzeczywistej aplikacji tutaj byłoby API call
    console.log('Zapisywanie lokalizacji:', location);
    
    if (editingLocationId) {
      alert(`Zaktualizowano lokalizację: ${location.name}`);
    } else {
      alert(`Dodano nową lokalizację: ${location.name}`);
    }
  };
  
  const handleItemsManage = (id: number) => {
    // W rzeczywistej aplikacji tutaj byłoby przekierowanie lub modalne okno
    alert(`Zarządzanie elementami w lokalizacji o ID: ${id}`);
  };
  
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
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onAttributesManage={handleAttributesManage}
          />
        ) : (
          <LocationManager 
            locations={mockLocations}
            onAddLocation={handleAddLocation}
            onEditLocation={handleEditLocation}
            onDeleteLocation={handleDeleteLocation}
            onItemsManage={handleItemsManage}
          />
        )}
      </div>
      
      {/* Formularze */}
      <CategoryForm 
        isOpen={isCategoryFormOpen}
        onClose={() => setIsCategoryFormOpen(false)}
        onSave={handleSaveCategory}
        editingCategoryId={editingCategoryId}
        parentCategoryId={parentCategoryId}
      />
      
      <LocationForm 
        isOpen={isLocationFormOpen}
        onClose={() => setIsLocationFormOpen(false)}
        onSave={handleSaveLocation}
        editingLocationId={editingLocationId}
        parentLocationId={parentLocationId}
      />
    </MainLayout>
  );
};

export default InventoryCategoriesPage;