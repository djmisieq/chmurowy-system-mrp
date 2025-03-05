"use client";

import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Save, Check } from 'lucide-react';
import { mockInventoryItems, InventoryItem } from './mockData';

interface OperationFormItem {
  itemId: number;
  quantity: number;
  price: number;
}

interface OperationFormProps {
  type: string;
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const OperationForm: React.FC<OperationFormProps> = ({ 
  type,
  onSave,
  onCancel,
  initialData = {}
}) => {
  // Stan formularza
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    documentNumber: '',
    externalDocument: '',
    description: '',
    sourceLocation: '',
    targetLocation: '',
    ...initialData
  });
  
  // Stan dla pozycji
  const [items, setItems] = useState<OperationFormItem[]>(initialData.items || []);
  
  // Lista elementów magazynowych do wyboru
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  
  // Przykładowe lokalizacje
  const locations = [
    'A1-01', 'A1-02', 'A1-03', 'A2-01', 'A2-02', 'A3-01',
    'B1-01', 'B1-02', 'B2-01', 'B2-02', 'B2-03', 'B3-01',
    'C1-01', 'C1-02', 'C2-01', 'C2-02', 'C3-01', 'C3-02',
  ];
  
  // Pobranie elementów magazynowych
  useEffect(() => {
    // W rzeczywistej aplikacji pobieranie z API
    setInventoryItems(mockInventoryItems);
  }, []);
  
  // Generowanie numeru dokumentu
  useEffect(() => {
    if (!formData.documentNumber && type) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      const docNumber = `${type}/${year}/${month}/${randomNum}`;
      setFormData(prev => ({ ...prev, documentNumber: docNumber }));
    }
  }, [type, formData.documentNumber]);
  
  // Obsługa zmiany pól formularza
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Dodawanie nowej pozycji
  const addItem = () => {
    setItems(prev => [...prev, { itemId: 0, quantity: 1, price: 0 }]);
  };
  
  // Usuwanie pozycji
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };
  
  // Zmiana danych pozycji
  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => {
      const newItems = [...prev];
      (newItems[index] as any)[field] = value;
      
      // Jeśli zmienia się element, aktualizuj cenę
      if (field === 'itemId') {
        const selectedItem = inventoryItems.find(item => item.id === Number(value));
        if (selectedItem) {
          newItems[index].price = selectedItem.value;
        }
      }
      
      return newItems;
    });
  };
  
  // Zapisanie formularza
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja formularza
    if (!formData.date) {
      alert('Proszę podać datę operacji');
      return;
    }
    
    if (items.length === 0) {
      alert('Proszę dodać co najmniej jedną pozycję');
      return;
    }
    
    // Walidacja pozycji
    const invalidItems = items.filter(item => item.itemId === 0 || item.quantity <= 0);
    if (invalidItems.length > 0) {
      alert('Proszę uzupełnić wszystkie pozycje');
      return;
    }
    
    // W zależności od typu operacji, sprawdź czy wybrano lokalizacje
    if ((type === 'MM' || type === 'RW') && !formData.sourceLocation) {
      alert('Proszę wybrać lokalizację źródłową');
      return;
    }
    
    if ((type === 'MM' || type === 'PZ' || type === 'PW') && !formData.targetLocation) {
      alert('Proszę wybrać lokalizację docelową');
      return;
    }
    
    // Wszystko OK, zapisz formularz
    onSave({
      ...formData,
      items,
      type,
      total: items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status: 'draft'
    });
  };
  
  // Tytuł formularza w zależności od typu operacji
  const getFormTitle = () => {
    switch (type) {
      case 'PZ': return 'Nowe przyjęcie zewnętrzne (PZ)';
      case 'WZ': return 'Nowe wydanie zewnętrzne (WZ)';
      case 'PW': return 'Nowe przyjęcie wewnętrzne (PW)';
      case 'RW': return 'Nowe wydanie wewnętrzne (RW)';
      case 'MM': return 'Nowe przesunięcie międzymagazynowe (MM)';
      case 'IN': return 'Nowa inwentaryzacja (IN)';
      default: return 'Nowa operacja magazynowa';
    }
  };
  
  // Formatowanie ceny
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Obliczenie wartości całkowitej
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{getFormTitle()}</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Dane nagłówkowe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data operacji</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numer dokumentu</label>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dokument zewnętrzny</label>
            <input
              type="text"
              name="externalDocument"
              value={formData.externalDocument}
              onChange={handleChange}
              placeholder="Np. numer faktury, WZ dostawcy"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Lokalizacje w zależności od typu operacji */}
          {(type === 'MM' || type === 'RW') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokalizacja źródłowa</label>
              <select
                name="sourceLocation"
                value={formData.sourceLocation}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Wybierz lokalizację</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          )}
          
          {(type === 'MM' || type === 'PZ' || type === 'PW') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokalizacja docelowa</label>
              <select
                name="targetLocation"
                value={formData.targetLocation}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Wybierz lokalizację</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Uwagi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Dodatkowe informacje o operacji"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
        
        {/* Pozycje */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-700">Pozycje</h3>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-1" />
              Dodaj pozycję
            </button>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Element
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ilość
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cena jedn.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wartość
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Akcje</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Brak pozycji. Kliknij "Dodaj pozycję" aby dodać element.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, 'itemId', Number(e.target.value))}
                          className="w-full p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value={0}>Wybierz element</option>
                          {inventoryItems.map(invItem => (
                            <option key={invItem.id} value={invItem.id}>
                              {invItem.code} - {invItem.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                          className="w-20 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.quantity * item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                
                {/* Suma */}
                {items.length > 0 && (
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                      Suma:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(calculateTotal())}
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Załączniki */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Załączniki</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać pliki
              </p>
              <input
                type="file"
                className="hidden"
                multiple
              />
              <button
                type="button"
                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => document.querySelector('input[type="file"]')?.click()}
              >
                Wybierz pliki
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Przyciski akcji */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save size={16} className="inline mr-1" />
          Zapisz wersję roboczą
        </button>
        <button
          type="button"
          onClick={() => {
            // Tutaj można dodać logikę zatwierdzania operacji
            // (np. zmiana statusu na 'completed')
            alert('Operacja zostanie zatwierdzona');
          }}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Check size={16} className="inline mr-1" />
          Zatwierdź
        </button>
      </div>
    </form>
  );
};

export default OperationForm;
