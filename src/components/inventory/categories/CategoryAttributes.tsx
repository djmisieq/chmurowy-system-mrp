import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { Category, CategoryAttribute, getCategoryById } from '../mockCategories';

interface CategoryAttributesProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryId: number, attributes: CategoryAttribute[]) => void;
  categoryId: number | null;
}

const CategoryAttributes: React.FC<CategoryAttributesProps> = ({
  isOpen,
  onClose,
  onSave,
  categoryId
}) => {
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  
  // Load category and attributes data
  useEffect(() => {
    if (categoryId) {
      const foundCategory = getCategoryById(categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
        setAttributes([...foundCategory.attributes]);
      }
    }
  }, [categoryId]);
  
  if (!isOpen || !categoryId || !category) return null;
  
  const handleAddAttribute = () => {
    const newId = attributes.length > 0 
      ? Math.max(...attributes.map(attr => attr.id)) + 1 
      : 1;
      
    setAttributes([
      ...attributes,
      {
        id: newId,
        name: '',
        type: 'text',
        required: false
      }
    ]);
  };
  
  const handleRemoveAttribute = (id: number) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };
  
  const handleAttributeChange = (id: number, field: keyof CategoryAttribute, value: any) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === id) {
        // Handle option changes for select type
        if (field === 'type' && value === 'select' && !attr.options) {
          return { ...attr, [field]: value, options: [''] };
        }
        
        // If changing from select to another type, remove options
        if (field === 'type' && value !== 'select' && attr.options) {
          const { options, ...rest } = attr;
          return { ...rest, [field]: value };
        }
        
        return { ...attr, [field]: value };
      }
      return attr;
    }));
  };
  
  const handleOptionChange = (attributeId: number, index: number, value: string) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === attributeId && attr.options) {
        const newOptions = [...attr.options];
        newOptions[index] = value;
        return { ...attr, options: newOptions };
      }
      return attr;
    }));
  };
  
  const handleAddOption = (attributeId: number) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === attributeId && attr.options) {
        return { ...attr, options: [...attr.options, ''] };
      }
      return attr;
    }));
  };
  
  const handleRemoveOption = (attributeId: number, index: number) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === attributeId && attr.options && attr.options.length > 1) {
        const newOptions = [...attr.options];
        newOptions.splice(index, 1);
        return { ...attr, options: newOptions };
      }
      return attr;
    }));
  };
  
  const handleSave = () => {
    // Validate attributes before saving
    const isValid = attributes.every(attr => 
      attr.name.trim() !== '' && 
      (attr.type !== 'select' || (attr.options && attr.options.every(opt => opt.trim() !== '')))
    );
    
    if (!isValid) {
      alert('Wszystkie atrybuty muszą mieć nazwę, a opcje wyboru nie mogą być puste.');
      return;
    }
    
    onSave(categoryId, attributes);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Atrybuty kategorii: {category.name}
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
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Atrybuty definiują dodatkowe właściwości dla wszystkich elementów w tej kategorii.
                Elementy dziedziczą również atrybuty z kategorii nadrzędnych.
              </p>
            </div>
            
            {/* Lista atrybutów */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {attributes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                  <p className="text-gray-500">
                    Ta kategoria nie ma jeszcze zdefiniowanych atrybutów.
                  </p>
                </div>
              ) : (
                attributes.map((attribute, index) => (
                  <div key={attribute.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Atrybut #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(attribute.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                      {/* Nazwa atrybutu */}
                      <div className="md:col-span-5">
                        <label htmlFor={`name-${attribute.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Nazwa
                        </label>
                        <input
                          type="text"
                          id={`name-${attribute.id}`}
                          value={attribute.name}
                          onChange={(e) => handleAttributeChange(attribute.id, 'name', e.target.value)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      {/* Typ atrybutu */}
                      <div className="md:col-span-4">
                        <label htmlFor={`type-${attribute.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Typ
                        </label>
                        <select
                          id={`type-${attribute.id}`}
                          value={attribute.type}
                          onChange={(e) => handleAttributeChange(attribute.id, 'type', e.target.value)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="text">Tekst</option>
                          <option value="number">Liczba</option>
                          <option value="boolean">Tak/Nie</option>
                          <option value="select">Lista wyboru</option>
                        </select>
                      </div>
                      
                      {/* Wymagane */}
                      <div className="md:col-span-3 flex items-end mb-2">
                        <div className="flex items-center h-5">
                          <input
                            id={`required-${attribute.id}`}
                            type="checkbox"
                            checked={attribute.required}
                            onChange={(e) => handleAttributeChange(attribute.id, 'required', e.target.checked)}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                          <label htmlFor={`required-${attribute.id}`} className="ml-2 block text-sm text-gray-700">
                            Wymagane
                          </label>
                        </div>
                      </div>
                      
                      {/* Wartość domyślna */}
                      {attribute.type !== 'select' && (
                        <div className="md:col-span-6">
                          <label htmlFor={`default-${attribute.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Wartość domyślna
                          </label>
                          {attribute.type === 'text' && (
                            <input
                              type="text"
                              id={`default-${attribute.id}`}
                              value={attribute.defaultValue || ''}
                              onChange={(e) => handleAttributeChange(attribute.id, 'defaultValue', e.target.value)}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          )}
                          {attribute.type === 'number' && (
                            <input
                              type="number"
                              id={`default-${attribute.id}`}
                              value={attribute.defaultValue || ''}
                              onChange={(e) => handleAttributeChange(attribute.id, 'defaultValue', e.target.value === '' ? undefined : Number(e.target.value))}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          )}
                          {attribute.type === 'boolean' && (
                            <select
                              id={`default-${attribute.id}`}
                              value={attribute.defaultValue === undefined ? '' : String(attribute.defaultValue)}
                              onChange={(e) => handleAttributeChange(attribute.id, 'defaultValue', e.target.value === '' ? undefined : e.target.value === 'true')}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="">Nie wybrano</option>
                              <option value="true">Tak</option>
                              <option value="false">Nie</option>
                            </select>
                          )}
                        </div>
                      )}
                      
                      {/* Opcje dla typu 'select' */}
                      {attribute.type === 'select' && attribute.options && (
                        <div className="md:col-span-12 mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Opcje wyboru
                          </label>
                          <div className="space-y-2">
                            {attribute.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleOptionChange(attribute.id, optIndex, e.target.value)}
                                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  placeholder={`Opcja ${optIndex + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(attribute.id, optIndex)}
                                  className="ml-2 text-red-500 hover:text-red-600"
                                  disabled={attribute.options && attribute.options.length <= 1}
                                >
                                  <Trash2 size={18} className={attribute.options && attribute.options.length <= 1 ? 'opacity-50' : ''} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => handleAddOption(attribute.id)}
                              className="mt-1 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <Plus size={14} className="mr-1" />
                              Dodaj opcję
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Przyciski akcji */}
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handleAddAttribute}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus size={16} className="mr-1" />
                Dodaj atrybut
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Save size={16} className="mr-1" />
                  Zapisz atrybuty
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAttributes;