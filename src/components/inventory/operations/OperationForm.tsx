"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, FileText, MessageSquare, Paperclip } from 'lucide-react';
import OperationTypeSelector, { OperationType } from './OperationTypeSelector';
import OperationItemsTable, { OperationItem } from './OperationItemsTable';
import { mockInventoryItems } from '../mockData';

export interface OperationFormData {
  type: OperationType;
  date: string;
  documentNumber: string;
  items: OperationItem[];
  notes: string;
  attachments: File[];
}

interface OperationFormProps {
  initialData?: Partial<OperationFormData>;
  onSubmit: (data: OperationFormData) => void;
  onCancel: () => void;
}

const OperationForm: React.FC<OperationFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  // Stan formularza
  const [formData, setFormData] = useState<OperationFormData>({
    type: initialData?.type || 'receipt',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    documentNumber: initialData?.documentNumber || '',
    items: initialData?.items || [],
    notes: initialData?.notes || '',
    attachments: initialData?.attachments || []
  });
  
  // Stan walidacji
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Efekt aktualizujący widoczność pól na podstawie typu operacji
  const [showPrices, setShowPrices] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  
  useEffect(() => {
    // Zależnie od typu operacji pokazujemy/ukrywamy różne pola
    setShowPrices(['receipt', 'issue'].includes(formData.type));
    setShowLocations(['transfer', 'internal_issue', 'internal_receipt'].includes(formData.type));
    
    // Reset błędów przy zmianie typu
    setErrors({});
  }, [formData.type]);
  
  // Generuj nowy identyfikator dla pozycji
  const generateItemId = () => `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Obsługa dodawania pozycji
  const handleAddItem = () => {
    const newItem: OperationItem = {
      id: generateItemId(),
      itemId: 0,
      itemCode: '',
      itemName: '',
      quantity: 1,
      unitMeasure: 'szt.',
      unitPrice: 0,
      locationFrom: '',
      locationTo: ''
    };
    
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };
  
  // Obsługa aktualizacji pozycji
  const handleUpdateItem = (id: string, field: string, value: any) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === id) {
        if (field === 'item') {
          // Gdy aktualizujemy cały element
          return {
            ...item,
            itemId: value.itemId,
            itemCode: value.itemCode,
            itemName: value.itemName,
            unitMeasure: value.unitMeasure,
            unitPrice: value.unitPrice
          };
        } else {
          // Gdy aktualizujemy pojedyncze pole
          return { ...item, [field]: value };
        }
      }
      return item;
    });
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  // Obsługa usuwania pozycji
  const handleDeleteItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
  };
  
  // Obsługa zmiany typu operacji
  const handleTypeChange = (type: OperationType) => {
    setFormData({
      ...formData,
      type
    });
  };
  
  // Obsługa zmiany pola formularza
  const handleFieldChange = (field: keyof OperationFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  
  // Obsługa dodawania załączników
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...newFiles]
      });
    }
  };
  
  // Obsługa usuwania załączników
  const handleRemoveFile = (index: number) => {
    const updatedAttachments = [...formData.attachments];
    updatedAttachments.splice(index, 1);
    setFormData({
      ...formData,
      attachments: updatedAttachments
    });
  };
  
  // Walidacja formularza
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = 'Data jest wymagana';
    }
    
    if (!formData.documentNumber) {
      newErrors.documentNumber = 'Numer dokumentu jest wymagany';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'Dodaj co najmniej jedną pozycję';
    } else {
      const invalidItems = formData.items.filter(item => !item.itemId || item.quantity <= 0);
      if (invalidItems.length > 0) {
        newErrors.items = 'Wszystkie pozycje muszą mieć wybrany element i poprawną ilość';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Obsługa zapisywania formularza
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  // Pobranie dzisiejszej daty w formacie YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Pozyskanie tytułu formularza na podstawie typu operacji
  const getFormTitle = () => {
    switch (formData.type) {
      case 'receipt':
        return 'Nowe przyjęcie zewnętrzne (PZ)';
      case 'issue':
        return 'Nowe wydanie zewnętrzne (WZ)';
      case 'internal_receipt':
        return 'Nowe przyjęcie wewnętrzne (PW)';
      case 'internal_issue':
        return 'Nowe wydanie wewnętrzne (RW)';
      case 'transfer':
        return 'Nowe przesunięcie międzymagazynowe (MM)';
      case 'inventory':
        return 'Nowa inwentaryzacja (IN)';
      default:
        return 'Nowa operacja magazynowa';
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{getFormTitle()}</h2>
        
        {/* Wybór typu operacji */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Typ operacji</h3>
          <OperationTypeSelector
            selectedType={formData.type}
            onTypeSelect={handleTypeChange}
          />
        </div>
        
        {/* Informacje o dokumencie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data operacji</label>
            <div className="relative">
              <input
                type="date"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.date}
                max={today}
                onChange={(e) => handleFieldChange('date', e.target.value)}
              />
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numer dokumentu</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.documentNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Np. PZ/2025/03/001"
                value={formData.documentNumber}
                onChange={(e) => handleFieldChange('documentNumber', e.target.value)}
              />
              <FileText size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {errors.documentNumber && <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>}
            </div>
          </div>
        </div>
        
        {/* Pozycje operacji */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pozycje</h3>
          {errors.items && <p className="mb-2 text-sm text-red-600">{errors.items}</p>}
          <OperationItemsTable
            items={formData.items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            showPrices={showPrices}
            showLocations={showLocations}
            inventoryItems={mockInventoryItems}
          />
        </div>
        
        {/* Uwagi */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Uwagi</label>
          <div className="relative">
            <textarea
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Dodatkowe informacje..."
              value={formData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
            />
            <MessageSquare size={16} className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>
        
        {/* Załączniki */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Załączniki</label>
          <div className="mb-2">
            <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <Paperclip size={16} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-700">Dodaj plik</span>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          {formData.attachments.length > 0 && (
            <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {formData.attachments.map((file, index) => (
                <li key={index} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                  <div className="flex items-center">
                    <Paperclip size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleRemoveFile(index)}
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Przyciski akcji */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onCancel}
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Zapisz
        </button>
      </div>
    </form>
  );
};

export default OperationForm;
