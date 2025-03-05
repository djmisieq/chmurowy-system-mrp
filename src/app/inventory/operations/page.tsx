"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Filter, 
  Plus, 
  Calendar, 
  User, 
  FileText
} from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import { 
  mockOperations,
  mockInventoryItems
} from '../../../components/inventory/mockData';

// Typy operacji
const operationTypes = [
  { id: 'PZ', name: 'Przyjęcie zewnętrzne (PZ)', description: 'Przyjęcie towarów od dostawcy zewnętrznego' },
  { id: 'WZ', name: 'Wydanie zewnętrzne (WZ)', description: 'Wydanie towarów do odbiorcy zewnętrznego' },
  { id: 'PW', name: 'Przyjęcie wewnętrzne (PW)', description: 'Przyjęcie towarów z produkcji' },
  { id: 'RW', name: 'Wydanie wewnętrzne (RW)', description: 'Wydanie towarów do produkcji' },
  { id: 'MM', name: 'Przesunięcie międzymagazynowe (MM)', description: 'Przemieszczenie towarów między magazynami' },
  { id: 'IN', name: 'Inwentaryzacja (IN)', description: 'Korekta stanów magazynowych' }
];

// Typ dla operacji magazynowej
interface InventoryOperation {
  id: number;
  type: string;
  documentNumber: string;
  date: string;
  externalDocument?: string;
  createdBy: string;
  status: 'completed' | 'pending' | 'cancelled';
  items: {
    id: number;
    itemName: string;
    itemCode: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
}

// Komponenty pomocnicze

const FilterPanel: React.FC<{
  onFilterChange: (filters: any) => void;
}> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    type: '',
    dateFrom: '',
    dateTo: '',
    createdBy: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Filter size={18} className="mr-2 text-gray-500" />
        Filtry operacji
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Typ operacji</label>
          <select 
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Wszystkie typy</option>
            {operationTypes.map(type => (
              <option key={type.id} value={type.id}>{type.id}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data od</label>
          <div className="flex items-center relative">
            <Calendar size={16} className="absolute left-2 text-gray-500" />
            <input 
              type="date" 
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data do</label>
          <div className="flex items-center relative">
            <Calendar size={16} className="absolute left-2 text-gray-500" />
            <input 
              type="date" 
              name="dateTo"
              value={filters.dateTo}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wykonawca</label>
          <div className="flex items-center relative">
            <User size={16} className="absolute left-2 text-gray-500" />
            <input 
              type="text" 
              name="createdBy"
              value={filters.createdBy}
              onChange={handleChange}
              placeholder="Imię i nazwisko"
              className="w-full rounded-md border border-gray-300 p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const OperationTypeSelector: React.FC<{
  selectedType: string;
  onTypeSelect: (type: string) => void;
}> = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Wybierz typ operacji</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {operationTypes.map(type => (
          <div 
            key={type.id}
            onClick={() => onTypeSelect(type.id)}
            className={`
              p-4 rounded-lg border cursor-pointer transition-all
              ${selectedType === type.id 
                ? 'border-primary-500 bg-primary-50 shadow-sm' 
                : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/30'}
            `}
          >
            <h4 className="font-medium text-gray-900 mb-1">{type.name}</h4>
            <p className="text-sm text-gray-500">{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewOperationForm: React.FC<{
  operationType: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}> = ({ operationType, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    externalDocument: '',
    notes: '',
    items: [{ itemId: '', quantity: 1, unitPrice: 0 }]
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Jeśli wybrano przedmiot, zaktualizuj cenę jednostkową
    if (field === 'itemId' && value) {
      const selectedItem = mockInventoryItems.find(item => item.id === parseInt(value));
      if (selectedItem) {
        newItems[index].unitPrice = selectedItem.value;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };
  
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: '', quantity: 1, unitPrice: 0 }]
    });
  };
  
  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type: operationType
    });
  };
  
  // Znalezienie wybranego typu operacji
  const selectedOperationType = operationTypes.find(type => type.id === operationType);
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Plus size={18} className="mr-2 text-gray-500" />
        Nowa operacja: {selectedOperationType?.name || operationType}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data operacji</label>
            <input 
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dokument zewnętrzny
              <span className="text-gray-400 text-xs ml-1">(opcjonalnie)</span>
            </label>
            <input 
              type="text"
              name="externalDocument"
              value={formData.externalDocument}
              onChange={handleChange}
              placeholder="Np. numer faktury, WZ, zamówienia"
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900">Pozycje dokumentu</h4>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              + Dodaj pozycję
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Element</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ilość</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena jednostkowa</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wartość</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <select 
                        value={item.itemId}
                        onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                        required
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Wybierz element</option>
                        {mockInventoryItems.map(invItem => (
                          <option key={invItem.id} value={invItem.id}>
                            {invItem.code} - {invItem.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        min="1"
                        required
                        className="w-24 rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input 
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                        min="0"
                        step="0.01"
                        required
                        className="w-32 rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Intl.NumberFormat('pl-PL', {
                          style: 'currency',
                          currency: 'PLN'
                        }).format(item.quantity * item.unitPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Usuń
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uwagi / komentarze
            <span className="text-gray-400 text-xs ml-1">(opcjonalnie)</span>
          </label>
          <textarea 
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Dodatkowe informacje dotyczące operacji..."
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Załączniki
            <span className="text-gray-400 text-xs ml-1">(opcjonalnie)</span>
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col rounded-lg border-2 border-dashed border-gray-300 w-full h-32 p-10 group text-center cursor-pointer hover:bg-gray-50">
              <div className="h-full w-full text-center flex flex-col items-center justify-center">
                <FileText className="w-10 h-10 text-gray-400 group-hover:text-primary-500" />
                <p className="text-sm text-gray-500 group-hover:text-gray-600 mt-2">
                  Przeciągnij pliki tutaj lub
                  <span className="text-primary-600 hover:underline ml-1">wybierz z dysku</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG lub Excel (max. 10MB)</p>
              </div>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Zapisz operację
          </button>
        </div>
      </form>
    </div>
  );
};

const RecentOperationsList: React.FC<{
  operations: InventoryOperation[];
  onViewDetails: (id: number) => void;
  onPrint: (id: number) => void;
  onCancel: (id: number) => void;
}> = ({ operations, onViewDetails, onPrint, onCancel }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Ostatnie operacje</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nr dokumentu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dok. zewnętrzny</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wykonawca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {operations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Brak operacji spełniających kryteria wyszukiwania
                </td>
              </tr>
            ) : (
              operations.map((operation) => (
                <tr key={operation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {operation.documentNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {operation.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.externalDocument || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        operation.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : operation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {operation.status === 'completed'
                        ? 'Zatwierdzona'
                        : operation.status === 'pending'
                        ? 'W realizacji'
                        : 'Anulowana'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewDetails(operation.id)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        Szczegóły
                      </button>
                      <button
                        onClick={() => onPrint(operation.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Drukuj
                      </button>
                      {operation.status !== 'cancelled' && (
                        <button
                          onClick={() => onCancel(operation.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Anuluj
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Główny komponent strony
const InventoryOperationsPage = () => {
  const [view, setView] = useState<'list' | 'new'>('list');
  const [selectedOperationType, setSelectedOperationType] = useState<string>('');
  const [operations, setOperations] = useState<InventoryOperation[]>([]);
  const [filteredOperations, setFilteredOperations] = useState<InventoryOperation[]>([]);
  
  // Ładowanie danych operacji
  useEffect(() => {
    // Symulowane pobieranie danych
    setOperations(mockOperations);
    setFilteredOperations(mockOperations);
  }, []);
  
  // Obsługa filtrów
  const handleFilterChange = (filters: any) => {
    let filtered = [...operations];
    
    if (filters.type) {
      filtered = filtered.filter(op => op.type === filters.type);
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(op => new Date(op.date) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(op => new Date(op.date) <= new Date(filters.dateTo));
    }
    
    if (filters.createdBy) {
      const query = filters.createdBy.toLowerCase();
      filtered = filtered.filter(op => op.createdBy.toLowerCase().includes(query));
    }
    
    setFilteredOperations(filtered);
  };
  
  // Obsługa akcji operacji
  const handleViewDetails = (id: number) => {
    alert(`Podgląd szczegółów operacji ${id}`);
  };
  
  const handlePrintOperation = (id: number) => {
    alert(`Drukowanie dokumentu operacji ${id}`);
  };
  
  const handleCancelOperation = (id: number) => {
    if (confirm(`Czy na pewno chcesz anulować operację ${id}?`)) {
      // Tutaj byłaby logika anulowania operacji
      alert(`Operacja ${id} anulowana`);
    }
  };
  
  // Obsługa nowej operacji
  const handleCreateOperation = (data: any) => {
    console.log('Dane nowej operacji:', data);
    
    // Symulacja zapisania danych
    alert(`Utworzono nową operację typu ${data.type}`);
    
    // Powrót do listy operacji
    setView('list');
    setSelectedOperationType('');
  };
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link href="/inventory" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Operacje magazynowe</h2>
          <p className="mt-1 text-sm text-gray-500">Zarządzaj przyjmowaniem, wydawaniem i przesuwaniem elementów</p>
        </div>
      </div>
      
      {view === 'list' ? (
        <>
          {/* Panel akcji */}
          <div className="mb-6 flex justify-between items-center">
            <div></div>
            <button
              onClick={() => setView('new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus size={16} className="mr-2" />
              Nowa operacja
            </button>
          </div>
          
          {/* Panel filtrów */}
          <FilterPanel onFilterChange={handleFilterChange} />
          
          {/* Lista operacji */}
          <RecentOperationsList
            operations={filteredOperations}
            onViewDetails={handleViewDetails}
            onPrint={handlePrintOperation}
            onCancel={handleCancelOperation}
          />
        </>
      ) : (
        <>
          {selectedOperationType ? (
            <NewOperationForm
              operationType={selectedOperationType}
              onCancel={() => {
                setView('list');
                setSelectedOperationType('');
              }}
              onSubmit={handleCreateOperation}
            />
          ) : (
            <OperationTypeSelector
              selectedType={selectedOperationType}
              onTypeSelect={(type) => setSelectedOperationType(type)}
            />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default InventoryOperationsPage;