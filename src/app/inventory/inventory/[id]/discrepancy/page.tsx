"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, FileText, CheckCircle } from 'lucide-react';
import MainLayout from '../../../../../components/layout/MainLayout';
import DiscrepancyReport from '../../../../../components/inventory/inventory/DiscrepancyReport';
import { mockInventories, InventoryItem } from '../../../../../components/inventory/mockInventory';

// Interfejs dla pozycji z rozbieżnością
interface DiscrepancyItem extends InventoryItem {
  bookQuantity: number;
  actualQuantity: number;
  difference: number;
  differencePercent: number;
  correctionApproved?: boolean;
}

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
        // W rzeczywistej aplikacji, te dane pochodziłyby z API
        const mockItems: InventoryItem[] = [
          { id: 1, code: 'SIL-001', name: 'Silnik zaburtowy 40HP', category: 'Napęd', unit: 'szt', quantity: 12, minQuantity: 5, maxQuantity: 20, location: 'A-12-3' },
          { id: 2, code: 'KAD-001', name: 'Kadłub 5.5m', category: 'Kadłuby', unit: 'szt', quantity: 4, minQuantity: 2, maxQuantity: 8, location: 'B-01-1' },
          { id: 3, code: 'STE-002', name: 'Koło sterowe standard', category: 'Sterowanie', unit: 'szt', quantity: 25, minQuantity: 10, maxQuantity: 40, location: 'A-04-2' },
          { id: 4, code: 'SIE-001', name: 'Siedzisko kapitańskie', category: 'Wyposażenie', unit: 'szt', quantity: 15, minQuantity: 5, maxQuantity: 25, location: 'C-07-4' },
          { id: 5, code: 'PAL-001', name: 'Paliwo do testów', category: 'Materiały', unit: 'l', quantity: 120, minQuantity: 50, maxQuantity: 200, location: 'D-11-1' },
          { id: 6, code: 'FRB-001', name: 'Farba biała podkładowa', category: 'Materiały', unit: 'l', quantity: 75, minQuantity: 30, maxQuantity: 100, location: 'D-02-3' },
          { id: 7, code: 'LAM-001', name: 'Laminat - mata 450g', category: 'Materiały', unit: 'm2', quantity: 350, minQuantity: 100, maxQuantity: 500, location: 'D-03-1' },
          { id: 8, code: 'ZYW-001', name: 'Żywica epoksydowa', category: 'Materiały', unit: 'kg', quantity: 180, minQuantity: 50, maxQuantity: 250, location: 'D-04-2' }
        ];

        // Generowanie danych o rozbieżnościach
        const mockDiscrepancies: DiscrepancyItem[] = mockItems.map(item => {
          // Losowe generowanie różnic (dla celów demonstracyjnych)
          const variation = Math.random() > 0.6 
            ? Math.floor(Math.random() * 10) - 5  // Generuj różnicę między -5 a +5
            : 0;  // Brak różnicy
          
          const bookQuantity = item.quantity;
          const actualQuantity = bookQuantity + variation;
          const difference = actualQuantity - bookQuantity;
          const differencePercent = bookQuantity !== 0 
            ? (difference / bookQuantity) * 100 
            : 0;
          
          return {
            ...item,
            bookQuantity,
            actualQuantity,
            difference,
            differencePercent,
            correctionApproved: false
          };
        });

        setDiscrepancies(mockDiscrepancies);
        setIsLoading(false);
      }, 500);
    };

    loadData();
  }, [inventory, router]);

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

      {/* Raport rozbieżności */}
      <DiscrepancyReport 
        inventory={inventory}
        discrepancies={discrepancies}
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
    </MainLayout>
  );
};

export default InventoryDiscrepancyPage;