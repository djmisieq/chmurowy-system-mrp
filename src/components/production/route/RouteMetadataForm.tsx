"use client";

import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { ProductionRoute } from '@/types/route.types';

interface RouteMetadataFormProps {
  route?: Partial<ProductionRoute>;
  onSave: (data: Partial<ProductionRoute>) => void;
  onCancel: () => void;
  products?: { id: string; name: string }[];
  isLoading?: boolean;
}

const RouteMetadataForm: React.FC<RouteMetadataFormProps> = ({ 
  route,
  onSave,
  onCancel,
  products = [],
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<ProductionRoute>>({
    name: '',
    description: '',
    productId: '',
    productName: '',
    version: '1.0',
    status: 'draft',
    effectiveDate: new Date(),
    notes: '',
    ...route
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (route) {
      setFormData({
        name: '',
        description: '',
        productId: '',
        productName: '',
        version: '1.0',
        status: 'draft',
        effectiveDate: new Date(),
        notes: '',
        ...route
      });
    }
  }, [route]);

  // Format date for input fields
  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Nazwa marszruty jest wymagana';
    }

    if (!formData.productId) {
      errors.productId = 'Produkt jest wymagany';
    }

    if (!formData.version?.trim()) {
      errors.version = 'Wersja jest wymagana';
    }

    if (!formData.effectiveDate) {
      errors.effectiveDate = 'Data wejścia w życie jest wymagana';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle special case for the product selection
    if (name === 'productId') {
      const selectedProduct = products.find(p => p.id === value);
      setFormData(prev => ({
        ...prev,
        productId: value,
        productName: selectedProduct?.name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? new Date(value) : undefined
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {route?.id ? 'Edycja marszruty technologicznej' : 'Nowa marszruta technologiczna'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded"
          disabled={isLoading}
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nazwa marszruty */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nazwa marszruty*
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              validationErrors.name ? 'border-red-500' : ''
            }`}
            placeholder="Np. Marszruta produkcji łodzi Model A"
            disabled={isLoading}
          />
          {validationErrors.name && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
          )}
        </div>

        {/* Produkt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Produkt*
          </label>
          <select
            name="productId"
            value={formData.productId || ''}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              validationErrors.productId ? 'border-red-500' : ''
            }`}
            disabled={isLoading}
          >
            <option value="">Wybierz produkt</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {validationErrors.productId && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.productId}</p>
          )}
        </div>

        {/* Wersja */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wersja*
          </label>
          <input
            type="text"
            name="version"
            value={formData.version || ''}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              validationErrors.version ? 'border-red-500' : ''
            }`}
            placeholder="Np. 1.0"
            disabled={isLoading}
          />
          {validationErrors.version && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.version}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status || 'draft'}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          >
            <option value="draft">Wersja robocza</option>
            <option value="approved">Zatwierdzona</option>
            <option value="active">Aktywna</option>
            <option value="obsolete">Wycofana</option>
          </select>
        </div>

        {/* Data wejścia w życie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data wejścia w życie*
          </label>
          <input
            type="date"
            name="effectiveDate"
            value={formatDateForInput(formData.effectiveDate)}
            onChange={handleDateChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              validationErrors.effectiveDate ? 'border-red-500' : ''
            }`}
            disabled={isLoading}
          />
          {validationErrors.effectiveDate && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.effectiveDate}</p>
          )}
        </div>

        {/* Data wycofania */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data wycofania (opcjonalnie)
          </label>
          <input
            type="date"
            name="obsoleteDate"
            value={formatDateForInput(formData.obsoleteDate)}
            onChange={handleDateChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
        </div>

        {/* Domyślna wielkość partii */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domyślna wielkość partii
          </label>
          <input
            type="number"
            name="batchSize"
            value={formData.batchSize || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Np. 10"
            disabled={isLoading}
            min="1"
            step="1"
          />
        </div>

        {/* Opis */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opis
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Szczegółowy opis marszruty"
            disabled={isLoading}
          />
        </div>

        {/* Notatki */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notatki dodatkowe
          </label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleInputChange}
            rows={2}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Dodatkowe informacje"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <Save size={18} className="mr-1" /> 
          {isLoading ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </div>
    </form>
  );
};

export default RouteMetadataForm;