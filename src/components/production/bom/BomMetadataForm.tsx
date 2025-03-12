"use client";

import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { ProductBom } from '@/types/bom.types';

interface BomMetadataFormProps {
  bomId?: string; // Jeśli edytujemy istniejący BOM
  onSave: (bom: ProductBom) => void;
  onCancel: () => void;
}

const BomMetadataForm: React.FC<BomMetadataFormProps> = ({ bomId, onSave, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<ProductBom>>({
    name: '',
    description: '',
    version: '1.0',
    status: 'draft',
    productId: ''
  });
  const [products, setProducts] = useState<Array<{id: string, name: string}>>([]);

  // Pobierz dane BOM jeśli mamy bomId
  useEffect(() => {
    const fetchData = async () => {
      if (!bomId) return;
      
      try {
        setLoading(true);
        const response = await axios.get('/product-boms.json');
        const boms: ProductBom[] = response.data;
        const bom = boms.find(b => b.id === bomId);
        
        if (bom) {
          setFormData({
            id: bom.id,
            name: bom.name,
            description: bom.description,
            version: bom.version,
            status: bom.status,
            productId: bom.productId,
            effectiveDate: bom.effectiveDate,
            obsoleteDate: bom.obsoleteDate
          });
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych BOM:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bomId]);

  // Pobierz listę produktów
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/db.json');
        if (response.data.products) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania listy produktów:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Wyczyść błąd dla pola, które jest edytowane
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Nazwa jest wymagana';
    }
    
    if (!formData.productId) {
      newErrors.productId = 'Produkt musi być wybrany';
    }
    
    if (!formData.version || formData.version.trim() === '') {
      newErrors.version = 'Wersja jest wymagana';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Symulacja zapisu danych (w rzeczywistości byłoby API)
      // W prawdziwym API tutaj byłby POST lub PUT
      
      // Generuj ID, jeśli nie ma
      if (!formData.id) {
        formData.id = `BOM-${Math.floor(Math.random() * 10000)}`;
      }
      
      // Dodaj brakujące pola dla nowego BOM
      if (!bomId) {
        formData.createdBy = 'current_user';
        formData.createdAt = new Date();
        formData.effectiveDate = formData.effectiveDate || new Date();
      } else {
        formData.modifiedBy = 'current_user';
        formData.modifiedAt = new Date();
      }
      
      // Mock - normalnie byłoby API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave(formData as ProductBom);
    } catch (error) {
      console.error('Błąd podczas zapisywania BOM:', error);
      setErrors({ submit: 'Wystąpił błąd podczas zapisywania. Spróbuj ponownie.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {bomId ? 'Edycja struktury BOM' : 'Nowa struktura BOM'}
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded text-gray-500 hover:bg-gray-100"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nazwa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Wprowadź nazwę BOM"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                Produkt <span className="text-red-500">*</span>
              </label>
              <select
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:ring-primary-500 focus:border-primary-500 ${
                  errors.productId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Wybierz produkt</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="mt-1 text-sm text-red-500">{errors.productId}</p>
              )}
            </div>

            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                Wersja <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="version"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:ring-primary-500 focus:border-primary-500 ${
                  errors.version ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="np. 1.0"
              />
              {errors.version && (
                <p className="mt-1 text-sm text-red-500">{errors.version}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="draft">Wersja robocza</option>
                <option value="approved">Zatwierdzona</option>
                <option value="active">Aktywna</option>
                <option value="obsolete">Wycofana</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Opis
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
              placeholder="Dodaj opis struktury BOM..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50"
            disabled={loading}
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:bg-gray-400"
            disabled={loading}
          >
            <Save size={18} className="mr-2" />
            {loading ? 'Zapisywanie...' : 'Zapisz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BomMetadataForm;