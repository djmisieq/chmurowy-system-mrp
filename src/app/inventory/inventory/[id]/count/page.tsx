"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, XCircle, BarcodeScan, Camera, Camera2, RefreshCcw } from 'lucide-react';
import MainLayout from '../../../../../components/layout/MainLayout';
import { 
  getInventoryById, 
  Inventory, 
  InventoryItem,
  formatDate,
  formatCurrency
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
  const [differenceValue, setDifferenceValue] = useState<number | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [saveDisabled, setSaveDisabled] = useState<boolean>(true);
  
  // Referencja do inputu skanowania
  const scanInputRef = useRef<HTMLInputElement>(null);
  
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
            
            // Obliczenie wartości różnicy
            if (item.price) {
              setDifferenceValue(diff * item.price);
            }
          }
        }
      }
    }
  }, [params.id, itemId]);
  
  // Sprawdź czy przycisk zapisz powinien być aktywny
  useEffect(() => {
    const numValue = parseFloat(countedQuantity);
    setSaveDisabled(isNaN(numValue));
  }, [countedQuantity]);
  
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
        
        // Obliczenie wartości różnicy
        if (selectedItem.price) {
          setDifferenceValue(diff * selectedItem.price);
        }
      } else {
        setDifference(null);
        setPercentageDifference(null);
        setHasDifference(false);
        setDifferenceValue(null);
      }
    }
  };
  
  // Obsługa skanowania kodu
  const handleScan = () => {
    setShowScanner(true);
    
    // Symulacja skanowania kodu kreskowego/QR (w rzeczywistej aplikacji tutaj byłaby obsługa skanera)
    setTimeout(() => {
      if (selectedItem) {
        // Symulacja odczytu numeru seryjnego produktu
        const mockedSerialNumber = `SN${selectedItem.itemCode}-${Math.floor(Math.random() * 100000)}`;
        setSerialNumber(mockedSerialNumber);
        setScanSuccess(true);
        
        // Automatycznie zwiększamy liczność o 1 przy każdym skanie
        const currentQuantity = parseFloat(countedQuantity) || 0;
        setCountedQuantity((currentQuantity + 1).toString());
        
        // Aktualizacja różnicy i pozostałych wartości
        if (selectedItem) {
          const newQuantity = currentQuantity + 1;
          const diff = newQuantity - selectedItem.expectedQuantity;
          setDifference(diff);
          
          const percentDiff = selectedItem.expectedQuantity !== 0 
            ? (diff / selectedItem.expectedQuantity) * 100 
            : 0;
          setPercentageDifference(percentDiff);
          setHasDifference(diff !== 0);
          
          // Obliczenie wartości różnicy
          if (selectedItem.price) {
            setDifferenceValue(diff * selectedItem.price);
          }
        }
      }
    }, 1000);
  };
  
  // Resetuj stan skanera
  const resetScanner = () => {
    setShowScanner(false);
    setScanSuccess(false);
    setSerialNumber('');
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
      hasDifference,
      serialNumbers: serialNumber ? [serialNumber] : []
    });
    
    alert('Wynik inwentaryzacji został zapisany');
    
    // Przekierowanie do szczegółów inwentaryzacji
    router.push(`/inventory/inventory/${inventory.id}`);
  };
  
  // Przejdź do następnego elementu na arkuszu
  const handleSaveAndNext = () => {
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
      hasDifference,
      serialNumbers: serialNumber ? [serialNumber] : []
    });
    
    // Znajdź następny element do inwentaryzacji
    const currentIndex = inventory.items.findIndex(item => item.id === selectedItem.id);
    if (currentIndex < inventory.items.length - 1) {
      const nextItem = inventory.items[currentIndex + 1];
      router.push(`/inventory/inventory/${inventory.id}/count?itemId=${nextItem.id}`);
    } else {
      // Jeśli to ostatni element, wróć do szczegółów inwentaryzacji
      alert('To był ostatni element na arkuszu inwentaryzacyjnym');
      router.push(`/inventory/inventory/${inventory.id}`);
    }
  };
  
  // Anuluj wprowadzanie
  const handleCancel = () => {
    router.push(`/inventory/inventory/${params.id}`);
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
        <Link href={`/inventory/inventory/${params.id}`} className="mr-4 text-gray-500 hover:text-gray-700">
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
                  {selectedItem.price && (
                    <div className="mt-1 text-xs text-gray-500">
                      Wartość: {formatCurrency(selectedItem.expectedQuantity * selectedItem.price)}
                    </div>
                  )}
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
                  {selectedItem.price && countedQuantity && !isNaN(parseFloat(countedQuantity)) && (
                    <div className="mt-1 text-xs text-gray-500">
                      Wartość: {formatCurrency(parseFloat(countedQuantity) * selectedItem.price)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Skaner kodów kreskowych/QR */}
              <div className="mt-4 p-3 rounded-md border border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-700">
                    Skanowanie produktu
                  </h4>
                  {showScanner ? (
                    <button 
                      type="button"
                      onClick={resetScanner}
                      className="text-xs text-primary-600 hover:text-primary-800"
                    >
                      <RefreshCcw size={14} className="inline mr-1" />
                      Reset
                    </button>
                  ) : null}
                </div>
                
                {!showScanner ? (
                  <button
                    type="button"
                    onClick={handleScan}
                    className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <BarcodeScan size={16} className="mr-2" />
                    Skanuj produkt
                  </button>
                ) : (
                  <div className="mt-2">
                    {!scanSuccess ? (
                      <div className="animate-pulse text-center p-3 bg-white rounded-md border border-gray-200">
                        <Camera2 size={24} className="mx-auto text-primary-500 mb-2" />
                        <p className="text-sm text-gray-600">Skanowanie kodu...</p>
                      </div>
                    ) : (
                      <div className="text-center p-3 bg-green-50 rounded-md border border-green-200">
                        <div className="flex items-center justify-center text-green-600 mb-1">
                          <CheckCircle size={20} className="mr-1" />
                          <span className="font-medium">Zeskanowano</span>
                        </div>
                        <p className="text-sm text-gray-600">Nr seryjny: {serialNumber}</p>
                      </div>
                    )}
                  </div>
                )}
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
                      <p className="text-xs text-gray-500">Ilość</p>
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
                  
                  {differenceValue !== null && selectedItem.price && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Wartość różnicy</p>
                      <p className={`text-sm font-medium ${
                        differenceValue > 0 ? 'text-green-600' : differenceValue < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {differenceValue > 0 ? '+' : ''}{formatCurrency(differenceValue)}
                      </p>
                    </div>
                  )}
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
              
              {/* Instrukcje skanowania */}
              <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800">Wskazówki inwentaryzacji</h4>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>Sprawdź fizyczny stan produktu</li>
                  <li>Sprawdź etykiety i oznaczenia</li>
                  <li>W przypadku dużej rozbieżności zweryfikuj ponownie</li>
                  <li>Możesz użyć skanera kodów kreskowych dla przyspieszenia pracy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 sm:px-6 flex flex-col sm:flex-row sm:justify-between gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <XCircle size={16} className="mr-2" />
            Anuluj
          </button>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveDisabled}
              className={`inline-flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                saveDisabled
                  ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              <Save size={16} className="mr-2" />
              Zapisz
            </button>
            
            <button
              type="button"
              onClick={handleSaveAndNext}
              disabled={saveDisabled}
              className={`inline-flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                saveDisabled
                  ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
            >
              <ArrowRight size={16} className="mr-2" />
              Zapisz i następny
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Dodajemy brakującą ikonę
const CheckCircle = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// Dodajemy brakującą ikonę
const ArrowRight = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default InventoryCountPage;