"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, FileText } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import InventoryList from '../../../components/inventory/inventory/InventoryList';
import InventoryPlanModal from '../../../components/inventory/inventory/InventoryPlanModal';
import { mockInventories, Inventory } from '../../../components/inventory/mockInventory';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Alert from '@/components/ui/Alert';
import Skeleton from '@/components/ui/Skeleton';

const InventoryPage = () => {
  const router = useRouter();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

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
    setIsLoading(true);
    
    // Symulacja żądania API
    setTimeout(() => {
      setIsLoading(false);
      console.log('Planowanie nowej inwentaryzacji:', inventoryData);
      setShowAlert({
        type: 'success',
        message: 'Inwentaryzacja została pomyślnie zaplanowana.'
      });
      setIsPlanModalOpen(false);
      // Przekierowanie do listy wszystkich inwentaryzacji
      setActiveTab('active');
    }, 1000);
  };

  // Obsługa akcji na inwentaryzacji
  const handleViewDetails = (id: number) => {
    router.push(`/inventory/inventory/${id}`);
  };

  const handleStartInventory = (id: number) => {
    setIsLoading(true);
    
    // Symulacja żądania API
    setTimeout(() => {
      setIsLoading(false);
      console.log('Rozpoczynanie inwentaryzacji:', id);
      setShowAlert({
        type: 'success',
        message: 'Inwentaryzacja została rozpoczęta. Możesz teraz przejść do wprowadzania danych.'
      });
    }, 800);
  };

  const handleCancelInventory = (id: number) => {
    setIsLoading(true);
    
    // Symulacja żądania API
    setTimeout(() => {
      setIsLoading(false);
      console.log('Anulowanie inwentaryzacji:', id);
      setShowAlert({
        type: 'info',
        message: 'Inwentaryzacja została anulowana.'
      });
    }, 800);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Inwentaryzacja</h2>
          <p className="mt-1 text-sm text-slate-500">Planowanie i przeprowadzanie inwentaryzacji magazynowych</p>
        </div>
      </div>
      
      {/* Alert notifications */}
      {showAlert && (
        <div className="mb-4">
          <Alert 
            variant={showAlert.type}
            dismissible
            onDismiss={() => setShowAlert(null)}
          >
            {showAlert.message}
          </Alert>
        </div>
      )}

      <Card>
        {/* Nagłówek z przyciskami akcji */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between">
          <h3 className="text-lg leading-6 font-medium text-slate-800">
            Lista inwentaryzacji
          </h3>
          <div className="mt-3 sm:mt-0 flex space-x-3">
            <Button
              variant="outline"
              icon={<FileText size={16} />}
              onClick={() => router.push('/inventory/inventory/sheets')}
            >
              Arkusze inwentaryzacyjne
            </Button>
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsPlanModalOpen(true)}
            >
              Zaplanuj inwentaryzację
            </Button>
          </div>
        </div>

        {/* Zakładki */}
        <Tabs
          tabs={[
            {
              id: 'active',
              label: 'Aktywne',
              content: isLoading ? (
                <div className="p-4">
                  <Skeleton.Table rows={3} columns={4} />
                </div>
              ) : (
                <InventoryList 
                  inventories={sortedInventories}
                  activeTab={activeTab}
                  onViewDetails={handleViewDetails}
                  onStartInventory={handleStartInventory}
                  onCancelInventory={handleCancelInventory}
                />
              )
            },
            {
              id: 'completed',
              label: 'Zakończone',
              content: isLoading ? (
                <div className="p-4">
                  <Skeleton.Table rows={3} columns={4} />
                </div>
              ) : (
                <InventoryList 
                  inventories={sortedInventories}
                  activeTab={activeTab}
                  onViewDetails={handleViewDetails}
                  onStartInventory={handleStartInventory}
                  onCancelInventory={handleCancelInventory}
                />
              )
            }
          ]}
          defaultTab={activeTab}
          onChange={(id) => setActiveTab(id as 'active' | 'completed')}
        />
      </Card>

      {/* Modal planowania inwentaryzacji */}
      <InventoryPlanModal 
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={handlePlanInventory}
        isLoading={isLoading}
      />
    </MainLayout>
  );
};

export default InventoryPage;