"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Package, Layers, Box, HardDrive } from 'lucide-react';
import { BomItem, AlternativeItem } from '@/types/bom.types';

interface BomItemEditFormProps {
  item: BomItem;
  onSave: (editedItem: BomItem) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const BomItemEditForm: React.FC<BomItemEditFormProps> = ({
  item,
  onSave,
  onCancel,
  onDelete
}) => {
  const [formData, setFormData] = useState<BomItem>({ ...item });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // For alternative items
  const [showAlternativeForm, setShowAlternativeForm] = useState(false);
  const [newAlternative, setNewAlternative] = useState<Omit<AlternativeItem, 'id'>>({
    itemId: '',
    itemName: '',
    replacementRatio: 1,
    priority: 1
  });

  useEffect(() => {
    // Reset form when item changes
    setFormData({ ...item });
  }, [item]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.itemId.trim()) {
      errors.itemId = 'ID elementu jest wymagane';
    }

    if (!formData.itemName.trim()) {
      errors.itemName = 'Nazwa elementu jest wymagana';
    }

    if (formData.quantity <= 0) {
      errors.quantity = 'Ilość musi być większa od zera';
    }

    if (!formData.unit.trim()) {
      errors.unit = 'Jednostka jest wymagana';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  const handleAlternativeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAlternative(prev => ({
      ...prev,
      [name]: name.includes('Ratio') || name.includes('priority') 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  const addAlternative = () => {
    // Validate the alternative
    if (!newAlternative.itemId || !newAlternative.itemName) {
      return; // Don't add invalid alternatives
    }
    
    const alternativeWithId: AlternativeItem = {
      ...newAlternative,
      id: `alt-${Date.now()}`
    };
    
    // Add the alternative to formData
    setFormData(prev => ({
      ...prev,
      alternativeItems: [
        ...(prev.alternativeItems || []),
        alternativeWithId
      ]
    }));
    
    // Reset the form
    setNewAlternative({
      itemId: '',
      itemName: '',
      replacementRatio: 1,
      priority: 1
    });
    
    setShowAlternativeForm(false);
  };
  
  const removeAlternative = (altId: string) => {
    setFormData(prev => ({
      ...prev,
      alternativeItems: prev.alternativeItems?.filter(alt => alt.id !== altId)
    }));
  };

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'product':
        return <Layers className="text-blue-600" size={24} />;
      case 'assembly':
        return <Box className="text-green-600" size={24} />;
      case 'component':
        return <Package className="text-amber-600" size={24} />;
      case 'material':
        return <HardDrive className="text-gray-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="mr-3">
            {getItemIcon(formData.itemType)}
          </div>
          <h3 className="text-lg font-medium">Edycja elementu</h3>
        </div>
        
        <div className="flex gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
              title="Usuń element"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Anuluj"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Typ elementu
        </label>
        <select
          name="itemType"
          value={formData.itemType}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="product">Produkt</option>
          <option value="assembly">Zespół</option>
          <option value="component">Komponent</option>
          <option value="material">Materiał</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID elementu*
        </label>
        <input
          type="text"
          name="itemId"
          value={formData.itemId}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            validationErrors.itemId ? 'border-red-500' : ''
          }`}
          placeholder="Np. P-1001"
        />
        {validationErrors.itemId && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.itemId}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nazwa elementu*
        </label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            validationErrors.itemName ? 'border-red-500' : ''
          }`}
          placeholder="Podaj nazwę elementu"
        />
        {validationErrors.itemName && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.itemName}</p>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ilość*
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              validationErrors.quantity ? 'border-red-500' : ''
            }`}
          />
          {validationErrors.quantity && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.quantity}</p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jednostka*
          </label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              validationErrors.unit ? 'border-red-500' : ''
            }`}
            placeholder="Np. szt., kg, m"
          />
          {validationErrors.unit && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.unit}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opis
        </label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Dodatkowy opis elementu (opcjonalnie)"
        />
      </div>

      {/* Alternative items section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Alternatywne materiały</h4>
          <button
            type="button"
            onClick={() => setShowAlternativeForm(true)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
          >
            Dodaj alternatywę
          </button>
        </div>
        
        {/* List of alternative items */}
        {formData.alternativeItems && formData.alternativeItems.length > 0 ? (
          <div className="bg-gray-50 rounded p-3 mb-3">
            {formData.alternativeItems.map((alt) => (
              <div key={alt.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <div>
                  <span className="font-medium">{alt.itemName}</span>
                  <span className="text-xs text-gray-500 ml-2">({alt.itemId})</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-3">
                    {alt.replacementRatio}:1 | Priorytet: {alt.priority}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAlternative(alt.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic mb-3">Brak alternatyw</p>
        )}
        
        {/* Form for adding new alternative */}
        {showAlternativeForm && (
          <div className="border p-3 rounded bg-gray-50 mb-3">
            <h5 className="text-sm font-medium mb-2">Dodaj alternatywny materiał</h5>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">ID materiału</label>
                <input
                  type="text"
                  name="itemId"
                  value={newAlternative.itemId}
                  onChange={handleAlternativeInputChange}
                  className="w-full p-1 text-sm border rounded"
                  placeholder="Np. M-1002"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Nazwa materiału</label>
                <input
                  type="text"
                  name="itemName"
                  value={newAlternative.itemName}
                  onChange={handleAlternativeInputChange}
                  className="w-full p-1 text-sm border rounded"
                  placeholder="Nazwa alternatywnego materiału"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Współczynnik zamiany</label>
                <input
                  type="number"
                  name="replacementRatio"
                  value={newAlternative.replacementRatio}
                  onChange={handleAlternativeInputChange}
                  min="0.01"
                  step="0.01"
                  className="w-full p-1 text-sm border rounded"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Priorytet</label>
                <input
                  type="number"
                  name="priority"
                  value={newAlternative.priority}
                  onChange={handleAlternativeInputChange}
                  min="1"
                  step="1"
                  className="w-full p-1 text-sm border rounded"
                  placeholder="1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAlternativeForm(false)}
                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={addAlternative}
                className="px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600"
              >
                Dodaj
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 flex items-center"
        >
          <Save size={18} className="mr-1" /> Zapisz zmiany
        </button>
      </div>
    </form>
  );
};

export default BomItemEditForm;