"use client";

import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Tag, MapPin, PackageCheck, DollarSign, Hash } from 'lucide-react';

// Types from the detail component
interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  stock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  value: number;
  category: string;
  location: string;
  status: string;
  code: string;
  lastUpdate?: string;
}

// Mock categories and locations for the form
const MOCK_CATEGORIES = [
  { value: 'Silniki', label: 'Silniki' },
  { value: 'Kadłuby', label: 'Kadłuby' },
  { value: 'Wyposażenie', label: 'Wyposażenie' },
  { value: 'Elektronika', label: 'Elektronika' },
  { value: 'Tapicerka', label: 'Tapicerka' },
];

const MOCK_LOCATIONS = [
  { value: 'Magazyn A', label: 'Magazyn A' },
  { value: 'Magazyn B', label: 'Magazyn B' },
  { value: 'Magazyn zewnętrzny', label: 'Magazyn zewnętrzny' },
  { value: 'Hala produkcyjna', label: 'Hala produkcyjna' },
];

const MOCK_UNITS = [
  { value: 'szt.', label: 'Sztuka' },
  { value: 'kg', label: 'Kilogram' },
  { value: 'm', label: 'Metr' },
  { value: 'm²', label: 'Metr kwadratowy' },
  { value: 'l', label: 'Litr' },
  { value: 'par.', label: 'Para' },
  { value: 'kpl.', label: 'Komplet' },
];

interface InventoryItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  item?: InventoryItem | null;
  isEdit?: boolean;
}

/**
 * Form component for creating and editing inventory items
 */
const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
  isOpen,
  onClose,
  onSave,
  item = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    description: '',
    stock: 0,
    minStock: 0,
    maxStock: 0,
    unit: 'szt.',
    value: 0,
    category: '',
    location: '',
    code: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Initialize form with item data when editing
  useEffect(() => {
    if (item && isEdit) {
      setFormData({
        ...item,
      });
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        description: '',
        stock: 0,
        minStock: 0,
        maxStock: 0,
        unit: 'szt.',
        value: 0,
        category: '',
        location: '',
        code: '',
      });
    }
    setErrors({});
  }, [item, isEdit, isOpen]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convert number inputs to numbers
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nazwa jest wymagana';
    }

    if (!formData.code?.trim()) {
      newErrors.code = 'Kod produktu jest wymagany';
    }

    if (formData.stock === undefined || formData.stock < 0) {
      newErrors.stock = 'Stan magazynowy nie może być ujemny';
    }

    if (formData.minStock === undefined || formData.minStock < 0) {
      newErrors.minStock = 'Minimalny stan nie może być ujemny';
    }

    if (
      formData.maxStock !== undefined &&
      formData.maxStock !== 0 &&
      formData.minStock !== undefined &&
      formData.maxStock < formData.minStock
    ) {
      newErrors.maxStock = 'Maksymalny stan musi być większy od minimalnego';
    }

    if (formData.value === undefined || formData.value < 0) {
      newErrors.value = 'Wartość nie może być ujemna';
    }

    if (!formData.category) {
      newErrors.category = 'Kategoria jest wymagana';
    }

    if (!formData.location) {
      newErrors.location = 'Lokalizacja jest wymagana';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // In a real app, you'd send this to your API
      // But for now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Prepare item for saving
      const itemToSave = {
        ...formData,
        id: isEdit && item ? item.id : Date.now(), // Fake ID for new items
        status: calculateStatus(),
        lastUpdate: new Date().toISOString(),
      } as InventoryItem;

      onSave(itemToSave);
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
      setErrors({
        form: 'Wystąpił błąd podczas zapisywania. Spróbuj ponownie.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate status based on stock levels
  const calculateStatus = (): string => {
    if (formData.stock === undefined || formData.minStock === undefined) {
      return 'normal';
    }
    
    if (formData.stock < formData.minStock) {
      return 'critical';
    }
    
    if (
      formData.maxStock !== undefined &&
      formData.maxStock > 0 &&
      formData.stock > formData.maxStock
    ) {
      return 'warning';
    }
    
    return 'good';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edycja produktu: ${item?.name}` : 'Dodaj nowy produkt'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Podstawowe informacje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Kod produktu"
                name="code"
                id="code"
                value={formData.code}
                onChange={handleChange}
                error={errors.code}
                fullWidth
                icon={<Hash size={16} />}
                required
              />
              
              <Input
                label="Nazwa"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                fullWidth
                required
              />

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Opis
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>

              <Select
                label="Kategoria"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                options={MOCK_CATEGORIES}
                error={errors.category}
                icon={<Tag size={16} />}
                fullWidth
                required
              />

              <Select
                label="Lokalizacja"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                options={MOCK_LOCATIONS}
                error={errors.location}
                icon={<MapPin size={16} />}
                fullWidth
                required
              />
            </div>
          </div>

          {/* Stock and value information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stan i wartość</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Stan magazynowy"
                name="stock"
                id="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock?.toString() || '0'}
                onChange={handleChange}
                error={errors.stock}
                icon={<PackageCheck size={16} />}
                fullWidth
                required
              />
              
              <Select
                label="Jednostka miary"
                name="unit"
                id="unit"
                value={formData.unit}
                onChange={handleChange}
                options={MOCK_UNITS}
                fullWidth
                required
              />

              <Input
                label="Wartość jednostkowa"
                name="value"
                id="value"
                type="number"
                min="0"
                step="0.01"
                value={formData.value?.toString() || '0'}
                onChange={handleChange}
                error={errors.value}
                icon={<DollarSign size={16} />}
                fullWidth
                required
              />

              <Input
                label="Minimalny stan"
                name="minStock"
                id="minStock"
                type="number"
                min="0"
                step="1"
                value={formData.minStock?.toString() || '0'}
                onChange={handleChange}
                error={errors.minStock}
                helpText="Poziom, poniżej którego generowane są alerty"
                fullWidth
                required
              />

              <Input
                label="Maksymalny stan"
                name="maxStock"
                id="maxStock"
                type="number"
                min="0"
                step="1"
                value={formData.maxStock?.toString() || '0'}
                onChange={handleChange}
                error={errors.maxStock}
                helpText="Opcjonalnie, 0 = brak limitu"
                fullWidth
              />
            </div>
          </div>

          {/* Error message */}
          {errors.form && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
              {errors.form}
            </div>
          )}
        </div>

        {/* Form footer */}
        <div className="mt-6 border-t pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            {loading ? 'Zapisywanie...' : isEdit ? 'Zapisz zmiany' : 'Dodaj produkt'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryItemForm;