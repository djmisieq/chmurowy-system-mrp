import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category, mockCategories, getCategoryById, getCategoryPath } from '../mockCategories';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
  editingCategoryId?: number | null;
  parentCategoryId?: number | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategoryId,
  parentCategoryId
}) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    code: '',
    parentId: parentCategoryId || null,
    description: '',
    attributes: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Determine if this is an edit or add operation
  const isEditing = editingCategoryId !== undefined && editingCategoryId !== null;
  const parentCategory = parentCategoryId ? getCategoryById(parentCategoryId) : null;
  
  // Load category data for editing
  useEffect(() => {
    if (isEditing && editingCategoryId) {
      const category = getCategoryById(editingCategoryId);
      if (category) {
        setFormData({
          id: category.id,
          name: category.name,
          code: category.code,
          parentId: category.parentId,
          description: category.description || '',
          attributes: [...category.attributes]
        });
      }
    } else {
      // For new category
      setFormData({
        name: '',
        code: '',
        parentId: parentCategoryId || null,
        description: '',
        attributes: []
      });
    }
  }, [isEditing, editingCategoryId, parentCategoryId]);
  
  if (!isOpen) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
      newErrors.name = 'Nazwa kategorii jest wymagana';
    }
    
    if (!formData.code?.trim()) {
      newErrors.code = 'Kod kategorii jest wymagany';
    } else if (!/^[A-Z0-9-_]+$/.test(formData.code)) {
      newErrors.code = 'Kod może zawierać tylko wielkie litery, cyfry, myślniki i podkreślenia';
    }
    
    // Check for duplicate code (except when editing this category)
    const existingWithSameCode = mockCategories.find(
      c => c.code === formData.code && (isEditing ? c.id !== editingCategoryId : true)
    );
    
    if (existingWithSameCode) {
      newErrors.code = 'Kategoria o takim kodzie już istnieje';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };
  
  // Get parent category path for display
  const parentPath = parentCategoryId 
    ? getCategoryPath(parentCategoryId).map(c => c.name).join(' > ')
    : null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {isEditing ? 'Edytuj kategorię' : 'Dodaj nową kategorię'}
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
              {/* Parent Category Display */}
              {parentCategoryId && parentCategory && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategoria nadrzędna
                  </label>
                  <div className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                    {parentPath}
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa kategorii *
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
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Kod kategorii *
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
                  placeholder="np. MAT-STAL"
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
                  Opis kategorii
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                />
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
                  {isEditing ? 'Zapisz zmiany' : 'Dodaj kategorię'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;