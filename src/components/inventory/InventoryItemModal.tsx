"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { InventoryItem } from './mockData';

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  item?: InventoryItem;
  categories: string[];
  locations: string[];
  suppliers: { id: number; name: string }[];
  isEdit?: boolean;
}

const defaultItem: Omit<InventoryItem, 'id'> = {
  code: '',
  name: '',
  category: '',
  stock: 0,
  minStock: 0,
  maxStock: 0,
  unit: 'szt.',
  location: '',
  value: 0,
  status: 'good',
  lastUpdated: new Date().toISOString().slice(0, 10),
  supplier: '',
  description: ''
};

const InventoryItemModal: React.FC<InventoryItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
  categories,
  locations,
  suppliers,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'> & { id?: number }>(
    item || defaultItem
  );

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData(defaultItem);
    }
  }, [item, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Konwersja wartości numerycznych
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Aktualizacja statusu na podstawie stanu magazynowego
    if (name === 'stock' || name === 'minStock' || name === 'maxStock') {
      const stock = name === 'stock' ? parseFloat(value) || 0 : formData.stock;
      const minStock = name === 'minStock' ? parseFloat(value) || 0 : formData.minStock;
      
      let status = 'good';
      if (stock < minStock) {
        status = stock === 0 ? 'critical' : 'warning';
      }
      
      setFormData(prev => ({
        ...prev,
        status: status as 'good' | 'warning' | 'critical'
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as InventoryItem);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              {isEdit ? 'Edytuj element magazynowy' : 'Dodaj nowy element'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Kod/ID */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    Kod/ID*
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Nazwa elementu */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa elementu*
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Kategoria */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategoria*
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Wybierz kategorię</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stan magazynowy */}
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stan magazynowy*
                  </label>
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    required
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Stan minimalny */}
                <div>
                  <label htmlFor="minStock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stan minimalny*
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    id="minStock"
                    required
                    min="0"
                    step="1"
                    value={formData.minStock}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Stan maksymalny */}
                <div>
                  <label htmlFor="maxStock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stan maksymalny*
                  </label>
                  <input
                    type="number"
                    name="maxStock"
                    id="maxStock"
                    required
                    min="0"
                    step="1"
                    value={formData.maxStock}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Jednostka miary */}
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Jednostka miary*
                  </label>
                  <select
                    name="unit"
                    id="unit"
                    required
                    value={formData.unit}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="szt.">szt.</option>
                    <option value="kg">kg</option>
                    <option value="m">m</option>
                    <option value="l">l</option>
                    <option value="zestaw">zestaw</option>
                  </select>
                </div>

                {/* Lokalizacja */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Lokalizacja*
                  </label>
                  <select
                    name="location"
                    id="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Wybierz lokalizację</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wartość jednostkowa */}
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                    Wartość jednostkowa (PLN)*
                  </label>
                  <input
                    type="number"
                    name="value"
                    id="value"
                    required
                    min="0"
                    step="0.01"
                    value={formData.value}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Dostawca */}
                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                    Dostawca
                  </label>
                  <select
                    name="supplier"
                    id="supplier"
                    value={formData.supplier || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Wybierz dostawcę</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Opis */}
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Opis
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isEdit ? 'Zapisz zmiany' : 'Dodaj element'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemModal;
