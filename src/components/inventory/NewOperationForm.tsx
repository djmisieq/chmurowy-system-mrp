"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Trash2, FileText, Upload, Save } from 'lucide-react';
import { InventoryItem } from './mockData';
import { Supplier, Buyer, Warehouse, generateDocumentNumber } from './mockOperations';

interface NewOperationFormProps {
  type: string;
  items: InventoryItem[];
  suppliers: Supplier[];
  buyers: Buyer[];
  warehouses: Warehouse[];
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

interface OperationItem {
  id: number;
  itemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  location: string;
}

const NewOperationForm: React.FC<NewOperationFormProps> = ({
  type,
  items,
  suppliers,
  buyers,
  warehouses,
  onSubmit,
  onCancel
}) => {
  // Stan formularza
  const [formData, setFormData] = useState<any>({
    documentNumber: '',
    date: new Date().toISOString().slice(0, 10),
    sourceWarehouse: '',
    targetWarehouse: '',
    supplier: '',
    buyer: '',
    externalDocument: '',
    description: '',
    items: []
  });
  
  // Stan wyszukiwania i dodawania elementów
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // Stan dla elementów operacji
  const [operationItems, setOperationItems] = useState<OperationItem[]>([]);
  
  // Po zmianie typu operacji, generuj numer dokumentu
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      documentNumber: generateDocumentNumber(type)
    }));
  }, [type]);
  
  // Obsługa filtrowania elementów podczas wyszukiwania
  useEffect(() => {
    if (searchQuery.length < 2) {
      setFilteredItems([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = items.filter(item =>
      item.code.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query)
    );
    
    setFilteredItems(filtered);
  }, [searchQuery, items]);
  
  // Obsługa zmiany w formularzu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Dodawanie elementu do operacji
  const handleAddItem = (item: InventoryItem) => {
    if (!selectedLocation) {
      alert('Wybierz lokalizację magazynową');
      return;
    }
    
    // Sprawdź, czy element już został dodany
    const existingItem = operationItems.find(i => i.itemId === item.id);
    if (existingItem) {
      alert('Ten element został już dodany do operacji');
      return;
    }
    
    const newItem: OperationItem = {
      id: Date.now(), // Tymczasowe ID
      itemId: item.id,
      name: item.name,
      quantity: 1,
      unitPrice: item.value,
      location: selectedLocation
    };
    
    setOperationItems(prev => [...prev, newItem]);
    setSearchQuery('');
    setFilteredItems([]);
  };
  
  // Usuwanie elementu z operacji
  const handleRemoveItem = (id: number) => {
    setOperationItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Aktualizacja ilości elementu
  const handleQuantityChange = (id: number, quantity: number) => {
    setOperationItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Aktualizacja ceny jednostkowej elementu
  const handleUnitPriceChange = (id: number, unitPrice: number) => {
    setOperationItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, unitPrice } : item
      )
    );
  };
  
  // Obliczanie sumy wartości
  const calculateTotal = () => {
    return operationItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };
  
  // Obsługa wysłania formularza
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (operationItems.length === 0) {
      alert('Dodaj co najmniej jeden element do operacji');
      return;
    }
    
    // Walidacja w zależności od typu operacji
    if (['receipt', 'internal_receipt'].includes(type) && !formData.targetWarehouse) {
      alert('Wybierz magazyn docelowy');
      return;
    }
    
    if (['issue', 'internal_issue'].includes(type) && !formData.sourceWarehouse) {
      alert('Wybierz magazyn źródłowy');
      return;
    }
    
    if (type === 'transfer' && (!formData.sourceWarehouse || !formData.targetWarehouse)) {
      alert('Wybierz magazyn źródłowy i docelowy');
      return;
    }
    
    if (type === 'receipt' && !formData.supplier) {
      alert('Wybierz dostawcę');
      return;
    }
    
    if (type === 'issue' && !formData.buyer) {
      alert('Wybierz odbiorcę');
      return;
    }
    
    // Przygotuj dane do wysłania
    const submissionData = {
      ...formData,
      type,
      items: operationItems,
      totalValue: calculateTotal()
    };
    
    onSubmit(submissionData);
  };
  
  // Renderowanie formularza w zależności od typu operacji
  const renderTypeSpecificFields = () => {
    switch (type) {
      case 'receipt':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dostawca</label>
                <select
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Wybierz dostawcę</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Magazyn docelowy</label>
                <select
                  name="targetWarehouse"
                  value={formData.targetWarehouse}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Wybierz magazyn</option>
                  {warehouses.filter(w => w.isActive).map(warehouse => (
                    <option key={warehouse.id} value={warehouse.code}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dokument zewnętrzny (np. nr faktury)</label>
              <input
                type="text"
                name="externalDocument"
                value={formData.externalDocument}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Np. FV/2025/03/123"
              />
            </div>
          </>
        );
        
      case 'issue':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Odbiorca</label>
                <select
                  name="buyer"
                  value={formData.buyer}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Wybierz odbiorcę</option>
                  {buyers.map(buyer => (
                    <option key={buyer.id} value={buyer.name}>{buyer.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Magazyn źródłowy</label>
                <select
                  name="sourceWarehouse"
                  value={formData.sourceWarehouse}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Wybierz magazyn</option>
                  {warehouses.filter(w => w.isActive).map(warehouse => (
                    <option key={warehouse.id} value={warehouse.code}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dokument zewnętrzny (np. nr zamówienia)</label>
              <input
                type="text"
                name="externalDocument"
                value={formData.externalDocument}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Np. ZAM/2025/03/022"
              />
            </div>
          </>
        );
        
      case 'transfer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Magazyn źródłowy</label>
              <select
                name="sourceWarehouse"
                value={formData.sourceWarehouse}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Wybierz magazyn</option>
                {warehouses.filter(w => w.isActive).map(warehouse => (
                  <option key={warehouse.id} value={warehouse.code}>{warehouse.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Magazyn docelowy</label>
              <select
                name="targetWarehouse"
                value={formData.targetWarehouse}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Wybierz magazyn</option>
                {warehouses.filter(w => w.isActive && w.code !== formData.sourceWarehouse).map(warehouse => (
                  <option key={warehouse.id} value={warehouse.code}>{warehouse.name}</option>
                ))}
              </select>
            </div>
          </div>
        );
        
      case 'internal_receipt':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Magazyn docelowy</label>
            <select
              name="targetWarehouse"
              value={formData.targetWarehouse}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Wybierz magazyn</option>
              {warehouses.filter(w => w.isActive).map(warehouse => (
                <option key={warehouse.id} value={warehouse.code}>{warehouse.name}</option>
              ))}
            </select>
          </div>
        );
        
      case 'internal_issue':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Magazyn źródłowy</label>
            <select
              name="sourceWarehouse"
              value={formData.sourceWarehouse}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Wybierz magazyn</option>
              {warehouses.filter(w => w.isActive).map(warehouse => (
                <option key={warehouse.id} value={warehouse.code}>{warehouse.name}</option>
              ))}
            </select>
          </div>
        );
        
      case 'inventory':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Magazyn</label>
            <select
              name="targetWarehouse"
              value={formData.targetWarehouse}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Wybierz magazyn</option>
              {warehouses.filter(w => w.isActive).map(warehouse => (
                <option key={warehouse.id} value={warehouse.code}>{warehouse.name}</option>
              ))}
            </select>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Format waluty
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      {/* Nagłówek */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Nowa operacja: {getOperationTypeName(type)}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Podstawowe informacje */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numer dokumentu</label>
          <input
            type="text"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            readOnly
          />
        </div>
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
      </div>
      
      {/* Pola specyficzne dla typu operacji */}
      {renderTypeSpecificFields()}
      
      {/* Opis */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Dodatkowe informacje dotyczące operacji..."
        />
      </div>
      
      {/* Wybierz lokalizację dla elementów */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Lokalizacja elementów</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Wybierz lokalizację</option>
          {['A1-01', 'A1-02', 'B1-01', 'B2-01', 'C1-01', 'C2-01'].map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      
      {/* Wyszukiwanie elementów */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Dodaj elementy do operacji</label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Szukaj po kodzie lub nazwie elementu..."
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          
          {/* Wyniki wyszukiwania */}
          {filteredItems.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg overflow-hidden">
              <ul className="max-h-60 overflow-y-auto">
                {filteredItems.map(item => (
                  <li
                    key={item.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                    onClick={() => handleAddItem(item)}
                  >
                    <div>
                      <span className="font-medium">{item.code}</span>: {item.name}
                      <div className="text-xs text-gray-500">Stan: {item.stock} {item.unit} | Lokalizacja: {item.location}</div>
                    </div>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800"
                      title="Dodaj do operacji"
                    >
                      <Plus size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Tabela z elementami */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-900 mb-3">Elementy operacji</h4>
        
        {operationItems.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center text-gray-500">
            Brak dodanych elementów. Użyj wyszukiwarki powyżej, aby dodać elementy do operacji.
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kod/Nazwa
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokalizacja
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {operationItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">ID: {item.itemId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-20 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleUnitPriceChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-24 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Usuń"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="px-6 py-3 text-sm text-right" colSpan={3}>Suma:</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{formatCurrency(calculateTotal())}</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Przyciski do obsługi załączników */}
      <div className="mb-6">
        <button
          type="button"
          className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => alert('Funkcja załączania dokumentów będzie dostępna w przyszłej wersji')}
        >
          <FileText size={16} className="mr-2" />
          Załącz dokumenty
        </button>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => alert('Funkcja skanowania kodów kreskowych będzie dostępna w przyszłej wersji')}
        >
          <Upload size={16} className="mr-2" />
          Skanuj kody kreskowe
        </button>
      </div>
      
      {/* Przyciski formularza */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center"
        >
          <Save size={16} className="mr-2" />
          Zapisz i potwierdź
        </button>
      </div>
    </form>
  );
};

// Funkcja pomocnicza do uzyskiwania nazwy typu operacji
const getOperationTypeName = (type: string): string => {
  switch (type) {
    case 'receipt':
      return 'Przyjęcie zewnętrzne (PZ)';
    case 'issue':
      return 'Wydanie zewnętrzne (WZ)';
    case 'internal_receipt':
      return 'Przyjęcie wewnętrzne (PW)';
    case 'internal_issue':
      return 'Wydanie wewnętrzne (RW)';
    case 'transfer':
      return 'Przesunięcie międzymagazynowe (MM)';
    case 'inventory':
      return 'Inwentaryzacja (IN)';
    default:
      return 'Nowa operacja';
  }
};

export default NewOperationForm;
