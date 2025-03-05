import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, XCircle } from 'lucide-react';
import { mockInventoryItems } from '../mockData';
import { operationTypes, OperationType } from '../mockOperations';

interface OperationFormProps {
  type: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
  existingData?: any; // Opcjonalne dane do edycji istniejącej operacji
}

const OperationForm: React.FC<OperationFormProps> = ({
  type,
  onCancel,
  onSubmit,
  existingData
}) => {
  // Stan formularza
  const [formData, setFormData] = useState({
    type: type as OperationType,
    date: existingData?.date || new Date().toISOString().split('T')[0],
    externalDocument: existingData?.externalDocument || '',
    executor: existingData?.executor || '',
    description: existingData?.description || '',
    items: existingData?.items || [],
    attachments: existingData?.attachments || []
  });
  
  // Stan walidacji
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Pobierz dane typu operacji
  const operationType = operationTypes.find(op => op.id === type) || operationTypes[0];
  
  // Aktualizuj typ operacji gdy zmienia się prop
  useEffect(() => {
    setFormData(prev => ({ ...prev, type: type as OperationType }));
  }, [type]);
  
  // Obsługa zmiany w głównych polach formularza
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Wyczyść błąd gdy pole jest zmieniane
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Dodaj nowy element do operacji
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(), // Tymczasowe ID
          itemId: 0,
          itemCode: '',
          itemName: '',
          quantity: 1,
          unitPrice: 0,
          unit: 'szt',
          locationFrom: type === 'MM' ? '' : undefined,
          locationTo: type === 'MM' ? '' : undefined
        }
      ]
    }));
  };
  
  // Usuń element z operacji
  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  // Aktualizuj dane elementu
  const handleItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      
      // Jeśli zmienia się ID elementu, zaktualizuj też powiązane pola
      if (field === 'itemId') {
        const selectedItem = mockInventoryItems.find(item => item.id === Number(value));
        if (selectedItem) {
          newItems[index] = {
            ...newItems[index],
            itemId: selectedItem.id,
            itemCode: selectedItem.code,
            itemName: selectedItem.name,
            unitPrice: selectedItem.value,
            unit: selectedItem.unit
          };
        }
      } else {
        // Dla innych pól po prostu zaktualizuj wartość
        newItems[index] = {
          ...newItems[index],
          [field]: value
        };
      }
      
      return { ...prev, items: newItems };
    });
  };
  
  // Dodaj załącznik
  const handleAddAttachment = () => {
    alert('Funkcja dodawania załączników zostanie zaimplementowana w kolejnej iteracji.');
  };
  
  // Walidacja formularza
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Sprawdź wymagane pola
    if (!formData.date) newErrors.date = 'Data jest wymagana';
    if (!formData.executor) newErrors.executor = 'Wykonawca jest wymagany';
    
    // Sprawdź pozycje
    if (formData.items.length === 0) {
      newErrors.items = 'Dodaj co najmniej jedną pozycję';
    } else {
      // Sprawdź każdą pozycję
      formData.items.forEach((item, index) => {
        if (!item.itemId) newErrors[`item_${index}_itemId`] = 'Wybierz element';
        if (!item.quantity || item.quantity <= 0) newErrors[`item_${index}_quantity`] = 'Podaj prawidłową ilość';
        
        // Sprawdź lokalizacje dla przesunięć międzymagazynowych
        if (formData.type === 'MM') {
          if (!item.locationFrom) newErrors[`item_${index}_locationFrom`] = 'Podaj lokalizację źródłową';
          if (!item.locationTo) newErrors[`item_${index}_locationTo`] = 'Podaj lokalizację docelową';
          if (item.locationFrom === item.locationTo) newErrors[`item_${index}_locationTo`] = 'Lokalizacje muszą być różne';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Obsługa wysłania formularza
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Generowanie numeru dokumentu (w rzeczywistości byłoby generowane przez backend)
      const documentNumber = `${formData.type}/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
      
      const finalData = {
        ...formData,
        number: documentNumber,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      
      onSubmit(finalData);
    } else {
      // Przewiń do pierwszego błędu
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
        {/* Nagłówek formularza */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Nowa operacja: {operationType.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {operationType.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft size={16} className="mr-1" />
              Powrót
            </button>
          </div>
        </div>
        
        {/* Zawartość formularza */}
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Typ operacji */}
            <div className="sm:col-span-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Typ operacji
              </label>
              <div className="mt-1">
                <select
                  id="type"
                  name="type"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={formData.type}
                  disabled
                >
                  {operationTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.id} - {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Data operacji */}
            <div className="sm:col-span-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Data operacji *
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  } rounded-md`}
                  value={formData.date}
                  onChange={handleInputChange}
                  data-error={errors.date ? "true" : "false"}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>
            </div>
            
            {/* Dokument zewnętrzny (tylko dla PZ/WZ) */}
            {(formData.type === 'PZ' || formData.type === 'WZ') && (
              <div className="sm:col-span-2">
                <label htmlFor="externalDocument" className="block text-sm font-medium text-gray-700">
                  Dokument zewnętrzny
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="externalDocument"
                    id="externalDocument"
                    placeholder={formData.type === 'PZ' ? "Nr faktury / WZ" : "Nr zamówienia"}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.externalDocument}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            
            {/* Wykonawca */}
            <div className="sm:col-span-3">
              <label htmlFor="executor" className="block text-sm font-medium text-gray-700">
                Wykonawca *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="executor"
                  id="executor"
                  placeholder="Imię i nazwisko"
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm ${
                    errors.executor ? 'border-red-300' : 'border-gray-300'
                  } rounded-md`}
                  value={formData.executor}
                  onChange={handleInputChange}
                  data-error={errors.executor ? "true" : "false"}
                />
                {errors.executor && (
                  <p className="mt-1 text-sm text-red-600">{errors.executor}</p>
                )}
              </div>
            </div>
            
            {/* Opis */}
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Opis / uwagi
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Dodatkowe informacje o operacji"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          {/* Tabela pozycji */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-medium text-gray-900">Pozycje</h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus size={16} className="mr-1" />
                Dodaj pozycję
              </button>
            </div>
            
            {errors.items && (
              <p className="mb-2 text-sm text-red-600" data-error="true">{errors.items}</p>
            )}
            
            {formData.items.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Element
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ilość
                      </th>
                      {formData.type !== 'IN' && (
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cena jednostkowa
                        </th>
                      )}
                      {formData.type === 'MM' && (
                        <>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Z lokalizacji
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Do lokalizacji
                          </th>
                        </>
                      )}
                      <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcje
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <select
                            className={`block w-full py-2 px-3 border ${
                              errors[`item_${index}_itemId`] ? 'border-red-300' : 'border-gray-300'
                            } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                            value={item.itemId || ''}
                            onChange={(e) => handleItemChange(index, 'itemId', Number(e.target.value))}
                            data-error={errors[`item_${index}_itemId`] ? "true" : "false"}
                          >
                            <option value="">Wybierz element</option>
                            {mockInventoryItems.map(inventoryItem => (
                              <option key={inventoryItem.id} value={inventoryItem.id}>
                                {inventoryItem.code} - {inventoryItem.name}
                              </option>
                            ))}
                          </select>
                          {errors[`item_${index}_itemId`] && (
                            <p className="mt-1 text-xs text-red-600">{errors[`item_${index}_itemId`]}</p>
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <input
                              type="number"
                              className={`block w-20 py-2 px-3 border ${
                                errors[`item_${index}_quantity`] ? 'border-red-300' : 'border-gray-300'
                              } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                              min="0.01"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                              data-error={errors[`item_${index}_quantity`] ? "true" : "false"}
                            />
                            <span className="ml-2 text-gray-500">{item.unit}</span>
                          </div>
                          {errors[`item_${index}_quantity`] && (
                            <p className="mt-1 text-xs text-red-600">{errors[`item_${index}_quantity`]}</p>
                          )}
                        </td>
                        {formData.type !== 'IN' && (
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="block w-24 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                min="0.01"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                              />
                              <span className="ml-2 text-gray-500">PLN</span>
                            </div>
                          </td>
                        )}
                        {formData.type === 'MM' && (
                          <>
                            <td className="px-3 py-4 text-sm text-gray-500">
                              <input
                                type="text"
                                className={`block w-full py-2 px-3 border ${
                                  errors[`item_${index}_locationFrom`] ? 'border-red-300' : 'border-gray-300'
                                } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                                placeholder="Lokalizacja źródłowa"
                                value={item.locationFrom || ''}
                                onChange={(e) => handleItemChange(index, 'locationFrom', e.target.value)}
                                data-error={errors[`item_${index}_locationFrom`] ? "true" : "false"}
                              />
                              {errors[`item_${index}_locationFrom`] && (
                                <p className="mt-1 text-xs text-red-600">{errors[`item_${index}_locationFrom`]}</p>
                              )}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500">
                              <input
                                type="text"
                                className={`block w-full py-2 px-3 border ${
                                  errors[`item_${index}_locationTo`] ? 'border-red-300' : 'border-gray-300'
                                } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                                placeholder="Lokalizacja docelowa"
                                value={item.locationTo || ''}
                                onChange={(e) => handleItemChange(index, 'locationTo', e.target.value)}
                                data-error={errors[`item_${index}_locationTo`] ? "true" : "false"}
                              />
                              {errors[`item_${index}_locationTo`] && (
                                <p className="mt-1 text-xs text-red-600">{errors[`item_${index}_locationTo`]}</p>
                              )}
                            </td>
                          </>
                        )}
                        <td className="px-3 py-4 text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-gray-500">
                  Brak pozycji. Kliknij "Dodaj pozycję" aby rozpocząć.
                </p>
              </div>
            )}
          </div>
          
          {/* Załączniki */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-medium text-gray-900">Załączniki</h4>
              <button
                type="button"
                onClick={handleAddAttachment}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Upload size={16} className="mr-1" />
                Dodaj załącznik
              </button>
            </div>
            
            {formData.attachments.length > 0 ? (
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                {formData.attachments.map((attachment, index) => (
                  <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex items-center flex-1 w-0">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 flex-1 w-0 truncate">{attachment}</span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="font-medium text-red-600 hover:text-red-500"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            attachments: prev.attachments.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-gray-500">
                  Brak załączników. Kliknij "Dodaj załącznik" aby dodać pliki.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Przyciski akcji */}
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Zapisz
          </button>
        </div>
      </div>
    </form>
  );
};

export default OperationForm;