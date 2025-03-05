"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, FileText, CheckCircle } from 'lucide-react';
import MainLayout from '../../../../../components/layout/MainLayout';
import DiscrepancyReport from '../../../../../components/inventory/inventory/DiscrepancyReport';
import { mockInventories } from '../../../../../components/inventory/mockInventory';
import { DiscrepancyItem, generateMockDiscrepancies } from '../../../../../components/inventory/mockDiscrepancies';

const InventoryDiscrepancyPage = () => {
  const params = useParams();
  const router = useRouter();
  const inventoryId = parseInt(params.id as string);
  
  // Stan dla danych inwentaryzacji i rozbieżności
  const [inventory, setInventory] = useState(mockInventories.find(inv => inv.id === inventoryId));
  const [discrepancies, setDiscrepancies] = useState<DiscrepancyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inicjalizacja danych
  useEffect(() => {
    if (!inventory) {
      router.push('/inventory/inventory');
      return;
    }

    // Symulacja ładowania danych z API
    const loadData = () => {
      setIsLoading(true);
      
      // Symulacja opóźnienia odpowiedzi z serwera
      setTimeout(() => {
        // Generowanie danych testowych dla rozbieżności
        const mockDiscrepancies = generateMockDiscrepancies(inventoryId);
        setDiscrepancies(mockDiscrepancies);
        setIsLoading(false);
      }, 500);
    };

    loadData();
  }, [inventory, router, inventoryId]);

  // Obsługa zatwierdzania pojedynczej korekty
  const handleApproveCorrection = (itemId: number) => {
    setDiscrepancies(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, correctionApproved: true } 
          : item
      )
    );
  };

  // Obsługa zatwierdzania wszystkich korekt
  const handleApproveAll = () => {
    setDiscrepancies(prev => 
      prev.map(item => 
        item.difference !== 0 
          ? { ...item, correctionApproved: true } 
          : item
      )
    );
  };

  // Obsługa zapisu zmian
  const handleSave = () => {
    // W rzeczywistej aplikacji, tutaj byłoby wywołanie API
    console.log('Zapisywanie korekt stanów magazynowych...');
    alert('Korekty stanów magazynowych zostały zapisane');
    
    // Po zapisie można by np. przekierować do szczegółów inwentaryzacji
    router.push(`/inventory/inventory/${inventoryId}`);
  };

  // Obsługa generowania raportu PDF
  const handleGenerateReport = () => {
    // W rzeczywistej aplikacji, tutaj byłoby wywołanie API do generowania PDF
    console.log('Generowanie raportu PDF...');
    alert('Raport PDF został wygenerowany i jest dostępny do pobrania');
  };

  // Jeśli trwa ładowanie danych, wyświetl komunikat
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Ładowanie danych raportu...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Jeśli nie znaleziono inwentaryzacji, przekieruj (obsłużone w useEffect)
  if (!inventory) {
    return null;
  }

  // Filtruj tylko pozycje z rozbieżnościami
  const filteredDiscrepancies = discrepancies.filter(item => item.difference !== 0);

  return (
    <MainLayout>
      {/* Nagłówek strony */}
      <div className="mb-6 flex items-center">
        <Link href={`/inventory/inventory/${inventoryId}`} className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Raport rozbieżności</h2>
          <p className="mt-1 text-sm text-gray-500">
            Inwentaryzacja #{inventoryId}: {inventory.name} - {new Date(inventory.planDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {filteredDiscrepancies.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Brak rozbieżności inwentaryzacyjnych</h3>
          <p className="text-gray-500">
            Wszystkie stany magazynowe zgadzają się z oczekiwanymi ilościami.
          </p>
          <div className="mt-6">
            <Link
              href={`/inventory/inventory/${inventoryId}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft size={16} className="mr-2" />
              Powrót do szczegółów inwentaryzacji
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Raport rozbieżności */}
          <DiscrepancyReport 
            inventory={inventory}
            discrepancies={filteredDiscrepancies}
            onApproveCorrection={handleApproveCorrection}
            onApproveAll={handleApproveAll}
            onGenerateReport={handleGenerateReport}
            onSave={handleSave}
          />
          
          {/* Pomocnicze przyciski nawigacyjne na dole strony */}
          <div className="mt-6 flex justify-between">
            <Link 
              href={`/inventory/inventory/${inventoryId}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft size={16} className="mr-2" />
              Powrót do szczegółów
            </Link>
            
            <div className="flex space-x-3">
              <button
                onClick={handleGenerateReport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FileText size={16} className="mr-2" />
                Generuj raport PDF
              </button>
              
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Save size={16} className="mr-2" />
                Zapisz korekty
              </button>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default InventoryDiscrepancyPage;