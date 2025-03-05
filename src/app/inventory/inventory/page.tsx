"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, FileText } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import InventoryList from '../../../components/inventory/inventory/InventoryList';
import InventoryPlanModal from '../../../components/inventory/inventory/InventoryPlanModal';
import { mockInventories, Inventory, InventoryStatus } from '../../../components/inventory/mockInventory';

const InventoryPage = () => {
  const router = useRouter();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Filtruj inwentaryzacje według aktywnej zakładki
  const filteredInventories = mockInventories.filter(inv => {
    if (activeTab === 'active') {
      return ['planned', 'in_progress'].includes(inv.status);
    } else {
      return ['completed', 'approved', 'canceled'].includes(inv.status);
    }
  });

  // Sortowanie według daty (od najnowszej)
  const sortedInventories = [...filteredInventories].sort((a, b) => {
    // Dla aktywnych sortuj według planDate, dla zakończonych według endDate lub planDate
    const dateA = activeTab === 'active' 
      ? new Date(a.planDate).getTime() 
      : (a.endDate ? new Date(a.endDate).getTime() : new Date(a.planDate).getTime());
    
    const dateB = activeTab === 'active' 
      ? new Date(b.planDate).getTime() 
      : (b.endDate ? new Date(b.endDate).getTime() : new Date(b.planDate).getTime());
    
    return dateB - dateA; // Od najnowszej do najstarszej
  });

  // Obsługa planowania nowej inwentaryzacji
  const handlePlanInventory = (inventoryData: Partial<Inventory>) => {
    // W rzeczywistej aplikacji tutaj byłoby API call
    console.log('Planowanie nowej inwentaryzacji:', inventoryData);
    alert('Inwentaryzacja została zaplanowana');
    setIsPlanModalOpen(false);
    // Przekierowanie do listy wszystkich inwentaryzacji
    setActiveTab('active');
  };

  // Obsługa akcji na inwentaryzacji
  const handleViewDetails = (id: number) => {
    router.push(`/inventory/inventory/${id}`);
  };

  const handleStartInventory = (id: number) => {
    // W rzeczywistej aplikacji tutaj byłoby API call
    console.log('Rozpoczynanie inwentaryzacji:', id);
    alert('Inwentaryzacja została rozpoczęta');
  };

  const handleCancelInventory = (id: number) => {
    // W rzeczywistej aplikacji tutaj byłoby API call
    console.log('Anulowanie inwentaryzacji:', id);
    alert('Inwentaryzacja została anulowana');
  };

  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Inwentaryzacja</h2>
          <p className="mt-1 text-sm text-gray-500">Planowanie i przeprowadzanie inwentaryzacji magazynowych</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Nagłówek z przyciskami akcji */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista inwentaryzacji
          </h3>
          <div className="mt-3 sm:mt-0 flex space-x-3">
            <button
              onClick={() => router.push('/inventory/inventory/sheets')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FileText size={16} className="mr-2" />
              Arkusze inwentaryzacyjne
            </button>
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus size={16} className="mr-2" />
              Zaplanuj inwentaryzację
            </button>
          </div>
        </div>

        {/* Zakładki */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('active')}
              className={`${
                activeTab === 'active'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Aktywne
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`${
                activeTab === 'completed'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Zakończone
            </button>
          </nav>
        </div>

        {/* Lista inwentaryzacji */}
        <InventoryList 
          inventories={sortedInventories}
          activeTab={activeTab}
          onViewDetails={handleViewDetails}
          onStartInventory={handleStartInventory}
          onCancelInventory={handleCancelInventory}
        />
      </div>

      {/* Modal planowania inwentaryzacji */}
      <InventoryPlanModal 
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={handlePlanInventory}
      />
    </MainLayout>
  );
};

export default InventoryPage;