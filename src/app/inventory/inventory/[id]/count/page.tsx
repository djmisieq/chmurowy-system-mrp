"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, XCircle } from 'lucide-react';
import MainLayout from '../../../../../components/layout/MainLayout';
import { 
  getInventoryById, 
  Inventory, 
  InventoryItem,
  formatDate
} from '../../../../../components/inventory/mockInventory';

interface InventoryCountPageProps {
  params: {
    id: string;
  }
}

const InventoryCountPage: React.FC<InventoryCountPageProps> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId');
  
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [countedQuantity, setCountedQuantity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [difference, setDifference] = useState<number | null>(null);
  const [percentageDifference, setPercentageDifference] = useState<number | null>(null);
  const [hasDifference, setHasDifference] = useState<boolean>(false);
  
  // Pobierz dane inwentaryzacji i elementu
  useEffect(() => {
    const inventoryData = getInventoryById(Number(params.id));
    
    if (inventoryData) {
      setInventory(inventoryData);
      
      if (itemId) {
        const item = inventoryData.items.find(item => item.id === Number(itemId));
        if (item) {
          setSelectedItem(item);
          setCountedQuantity(item.countedQuantity !== undefined ? item.countedQuantity.toString() : '');
          setNotes(item.notes || '');
          
          if (item.countedQuantity !== undefined) {
            const diff = item.countedQuantity - item.expectedQuantity;
            setDifference(diff);
            
            const percentDiff = item.expectedQuantity !== 0 
              ? (diff / item.expectedQuantity) * 100 
              : 0;
            setPercentageDifference(percentDiff);
            setHasDifference(diff !== 0);
          }
        }
      }
    }
  }, [params.id, itemId]);
  
  // Obsługa zmiany ilości
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountedQuantity(value);
    
    if (selectedItem) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const diff = numValue - selectedItem.expectedQuantity;
        setDifference(diff);
        
        const percentDiff = selectedItem.expectedQuantity !== 0 
          ? (diff / selectedItem.expectedQuantity) * 100 
          : 0;
        setPercentageDifference(percentDiff);
        setHasDifference(diff !== 0);
      } else {
        setDifference(null);
        setPercentageDifference(null);
        setHasDifference(false);
      }
    }
  };
  
  // Zapisz wyniki
  const handleSave = () => {
    if (!selectedItem || !inventory) return;
    
    const numValue = parseFloat(countedQuantity);
    if (isNaN(numValue)) {
      alert('Wprowadź prawidłową wartość liczbową');
      return;
    }
    
    // W rzeczywistej aplikacji tutaj byłoby API call
    console.log('Zapisywanie wyniku inwentaryzacji:', {
      inventoryId: inventory.id,
      itemId: selectedItem.id,
      countedQuantity: numValue,
      notes,
      difference,
      hasDifference
    });
    
    alert('Wynik inwentaryzacji został zapisany');
    
    // Przekierowanie do listy
    router.push(`/inventory/inventory/sheets`);
  };
  
  // Anuluj wprowadzanie
  const handleCancel = () => {
    router.push(`/inventory/inventory/sheets`);
  };
  
  if (!inventory || !selectedItem) {
    return (
      <MainLayout>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie danych...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory/inventory/sheets" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Wprowadzanie wyników inwentaryzacji</h2>
          <p className="mt-1 text-sm text-gray-500">
            {inventory.name} ({formatDate(inventory.planDate)})
          </p>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {selectedItem.itemName} ({selectedItem.itemCode})
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Kategoria: {selectedItem.category} | Lokalizacja: {selectedItem.location}
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stan księgowy</label>
                  <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 font-medium">
                    {selectedItem.expectedQuantity} {selectedItem.unit}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="counted-quantity" className="block text-sm font-medium text-gray-700">
                    Stan faktyczny <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      id="counted-quantity"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Wprowadź ilość"
                      value={countedQuantity}
                      onChange={handleQuantityChange}
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">{selectedItem.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {difference !== null && (
                <div className={`mt-4 p-3 rounded-md ${
                  hasDifference ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                }`}>
                  <h4 className={`text-sm font-medium ${
                    hasDifference ? 'text-yellow-800' : 'text-green-800'
                  }`}>
                    Różnica inwentaryzacyjna
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Wartość</p>
                      <p className={`text-sm font-medium ${
                        difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {difference > 0 ? '+' : ''}{difference} {selectedItem.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Procent</p>
                      <p className={`text-sm font-medium ${
                        percentageDifference! > 0 ? 'text-green-600' : percentageDifference! < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {percentageDifference! > 0 ? '+' : ''}{percentageDifference!.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notatki / uwagi
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  rows={5}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Wprowadź uwagi dotyczące tego elementu"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Wpisz uwagi w przypadku znalezienia rozbieżności (np. uszkodzony produkt, niezgodność etykiet itp.)
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <XCircle size={16} className="mr-2" />
            Anuluj
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Save size={16} className="mr-2" />
            Zapisz wynik
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryCountPage;