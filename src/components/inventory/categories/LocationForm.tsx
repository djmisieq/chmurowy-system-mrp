import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Location, mockLocations, getLocationById, getLocationPath, getLocationTypeLabel } from '../mockCategories';

interface LocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Partial<Location>) => void;
  editingLocationId?: number | null;
  parentLocationId?: number | null;
}

const LocationForm: React.FC<LocationFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLocationId,
  parentLocationId
}) => {
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    code: '',
    type: 'warehouse',
    parentId: parentLocationId || null,
    description: '',
    capacity: undefined,
    capacityUnit: 'kg',
    active: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Determine if this is an edit or add operation
  const isEditing = editingLocationId !== undefined && editingLocationId !== null;
  const parentLocation = parentLocationId ? getLocationById(parentLocationId) : null;
  
  // Determine available location types based on parent type
  const getAvailableTypes = (): { id: string, name: string }[] => {
    if (!parentLocation) {
      return [{ id: 'warehouse', name: 'Magazyn' }];
    }
    
    switch (parentLocation.type) {
      case 'warehouse':
        return [{ id: 'zone', name: 'Strefa' }];
      case 'zone':
        return [{ id: 'rack', name: 'Regał' }];
      case 'rack':
        return [{ id: 'shelf', name: 'Półka' }];
      case 'shelf':
        return [{ id: 'bin', name: 'Pojemnik' }];
      default:
        return [];
    }
  };
  
  // Auto-suggest location code based on parent and name
  const suggestCode = (name: string): string => {
    if (!name) return '';
    
    let prefix = '';
    let nameAbbrev = '';
    
    // Generate prefix based on parent
    if (parentLocation) {
      prefix = `${parentLocation.code}-`;
    } else {
      prefix = 'MAG-';
    }
    
    // Generate name abbreviation
    const words = name.trim().toUpperCase().split(/\s+/);
    if (words.length === 1) {
      // Single word - take first 4 chars or the whole word if shorter
      nameAbbrev = words[0].slice(0, 4);
    } else {
      // Multiple words - take first letter of each word up to 4 chars
      nameAbbrev = words.map(word => word[0]).join('').slice(0, 4);
    }
    
    return `${prefix}${nameAbbrev}`;
  };
  
  // Load location data for editing
  useEffect(() => {
    if (isEditing && editingLocationId) {
      const location = getLocationById(editingLocationId);
      if (location) {
        setFormData({
          id: location.id,
          name: location.name,
          code: location.code,
          type: location.type,
          parentId: location.parentId,
          description: location.description || '',
          capacity: location.capacity,
          capacityUnit: location.capacityUnit || 'kg',
          active: location.active
        });
      }
    } else {
      // For new location
      const availableTypes = getAvailableTypes();
      setFormData({
        name: '',
        code: '',
        type: availableTypes.length > 0 ? availableTypes[0].id as any : 'warehouse',
        parentId: parentLocationId || null,
        description: '',
        capacity: undefined,
        capacityUnit: 'kg',
        active: true
      });
    }
  }, [isEditing, editingLocationId, parentLocationId]);
  
  if (!isOpen) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Auto-suggest code when name changes
      if (name === 'name' && !isEditing) {
        setFormData(prev => ({
          ...prev,
          code: suggestCode(value)
        }));
      }
    }
    
    // Clear error when field is changed
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
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Nazwa lokalizacji jest wymagana';
    }
    
    if (!formData.code?.trim()) {
      newErrors.code = 'Kod lokalizacji jest wymagany';
    } else if (!/^[A-Z0-9-_]+$/.test(formData.code)) {
      newErrors.code = 'Kod może zawierać tylko wielkie litery, cyfry, myślniki i podkreślenia';
    }
    
    // Check for duplicate code (except when editing this location)
    const existingWithSameCode = mockLocations.find(
      l => l.code === formData.code && (isEditing ? l.id !== editingLocationId : true)
    );
    
    if (existingWithSameCode) {
      newErrors.code = 'Lokalizacja o takim kodzie już istnieje';
    }
    
    // Validate capacity if provided
    if (
      formData.capacity !== undefined && 
      formData.capacity !== null && 
      (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0)
    ) {
      newErrors.capacity = 'Pojemność musi być dodatnią liczbą';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert capacity to number if needed
      const finalFormData = {
        ...formData,
        capacity: formData.capacity !== undefined && formData.capacity !== '' 
          ? Number(formData.capacity) 
          : undefined
      };
      
      onSave(finalFormData);
      onClose();
    }
  };
  
  // Get parent location path for display
  const parentPath = parentLocationId 
    ? getLocationPath(parentLocationId).map(l => l.name).join(' > ')
    : null;
  
  // Get available location types
  const availableTypes = getAvailableTypes();
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {isEditing ? 'Edytuj lokalizację' : 'Dodaj nową lokalizację'}
              </h3>
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Zamknij</span>
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Parent Location Display */}
              {parentLocationId && parentLocation && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokalizacja nadrzędna
                  </label>
                  <div className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                    {parentPath}
                  </div>
                </div>
              )}
              
              {/* Location Type */}
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Typ lokalizacji *
                </label>
                <select
                  id="type"
                  name="type"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={isEditing || availableTypes.length <= 1}
                >
                  {availableTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {isEditing && (
                  <p className="mt-1 text-xs text-gray-500">
                    Typ lokalizacji nie może być zmieniony po utworzeniu
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa lokalizacji *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder={`np. ${
                    formData.type === 'warehouse' ? 'Magazyn Główny' :
                    formData.type === 'zone' ? 'Strefa A' :
                    formData.type === 'rack' ? 'Regał A01' :
                    formData.type === 'shelf' ? 'Półka A01-P01' :
                    'Pojemnik A01-P01-B01'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Kod lokalizacji *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md uppercase ${
                    errors.code ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={formData.code || ''}
                  onChange={handleInputChange}
                  placeholder={`np. ${
                    formData.type === 'warehouse' ? 'MAG-MAIN' :
                    formData.type === 'zone' ? 'STREFA-A' :
                    formData.type === 'rack' ? 'A-REG-01' :
                    formData.type === 'shelf' ? 'A-REG-01-P01' :
                    'A-REG-01-P01-B01'
                  }`}
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Kod powinien być unikalny i zawierać tylko wielkie litery, cyfry, myślniki i podkreślenia
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Opis lokalizacji
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Pojemność
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="0"
                    step="0.01"
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md ${
                      errors.capacity ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formData.capacity === undefined ? '' : formData.capacity}
                    onChange={handleInputChange}
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="capacityUnit" className="block text-sm font-medium text-gray-700 mb-1">
                    Jednostka
                  </label>
                  <select
                    id="capacityUnit"
                    name="capacityUnit"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.capacityUnit || 'kg'}
                    onChange={handleInputChange}
                  >
                    <option value="kg">kg</option>
                    <option value="szt">szt</option>
                    <option value="m3">m³</option>
                    <option value="m2">m²</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Lokalizacja aktywna
                </label>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {isEditing ? 'Zapisz zmiany' : 'Dodaj lokalizację'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;