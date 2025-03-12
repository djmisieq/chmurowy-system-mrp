"use client";

import React, { useState } from 'react';
import { X, Save, Package, Layers, Box, HardDrive } from 'lucide-react';
import { BomItem } from '@/types/bom.types';

interface BomItemAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newItem: Omit<BomItem, 'id'>) => void;
  parentItem?: BomItem;
}

const BomItemAddModal: React.FC<BomItemAddModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parentItem
}) => {
  const [formData, setFormData] = useState<Omit<BomItem, 'id'>>({
    itemId: '',
    itemName: '',
    itemType: 'component',
    quantity: 1,
    unit: 'szt.',
    description: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      itemId: '',
      itemName: '',
      itemType: 'component',
      quantity: 1,
      unit: 'szt.',
      description: '',
    });
    setValidationErrors({});
  };

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Dodaj nowy element</h3>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {parentItem && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Dodawanie jako element podrzędny do:</p>
              <div className="flex items-center mt-1">
                <div className="mr-2">
                  {getItemIcon(parentItem.itemType)}
                </div>
                <div>
                  <span className="font-medium">{parentItem.itemName}</span>
                  <span className="text-sm text-gray-500 ml-2">({parentItem.itemId})</span>
                </div>
              </div>
            </div>
          )}

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
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Dodatkowy opis elementu (opcjonalnie)"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 flex items-center"
            >
              <Save size={18} className="mr-1" /> Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BomItemAddModal;