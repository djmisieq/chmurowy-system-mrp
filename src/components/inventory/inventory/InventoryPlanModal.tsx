import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Inventory, mockCategories, mockLocations, getCategoryName, getLocationName } from '../mockInventory';

interface InventoryPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Inventory>) => void;
}

const InventoryPlanModal: React.FC<InventoryPlanModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [inventoryData, setInventoryData] = useState<Partial<Inventory>>({
    name: '',
    type: 'full',
    planDate: new Date().toISOString().split('T')[0],
    description: '',
    categories: [],
    locations: [],
    assignedUsers: []
  });
  
  const [users, setUsers] = useState<string[]>([
    'Jan Kowalski',
    'Anna Nowak',
    'Piotr Wiśniewski',
    'Katarzyna Wójcik',
    'Marcin Lewandowski'
  ]);
  
  const [newUser, setNewUser] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  if (!isOpen) return null;
  
  // Obsługa zmiany pól formularza
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInventoryData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Wyczyść błąd dla zmienionego pola
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Obsługa zaznaczania checkboxów (dla kategorii, lokalizacji, użytkowników)
  const handleCheckboxChange = (field: 'categories' | 'locations' | 'assignedUsers', value: number | string) => {
    setInventoryData(prev => {
      const currentValues = prev[field] || [];
      const valueExists = currentValues.includes(value);
      
      let newValues;
      if (valueExists) {
        newValues = currentValues.filter(v => v !== value);
      } else {
        newValues = [...currentValues, value];
      }
      
      return {
        ...prev,
        [field]: newValues
      };
    });
    
    // Wyczyść błąd dla list wielokrotnego wyboru
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Dodawanie nowego użytkownika
  const handleAddUser = () => {
    if (newUser.trim() === '') return;
    
    // Dodaj użytkownika do głównej listy jeśli go tam nie ma
    if (!users.includes(newUser)) {
      setUsers(prev => [...prev, newUser]);
    }
    
    // Dodaj użytkownika do przypisanych
    if (!inventoryData.assignedUsers?.includes(newUser)) {
      setInventoryData(prev => ({
        ...prev,
        assignedUsers: [...(prev.assignedUsers || []), newUser]
      }));
    }
    
    setNewUser('');
  };
  
  // Walidacja formularza
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!inventoryData.name?.trim()) {
      newErrors.name = 'Nazwa inwentaryzacji jest wymagana';
    }
    
    if (!inventoryData.planDate) {
      newErrors.planDate = 'Data jest wymagana';
    }
    
    if (inventoryData.type === 'partial') {
      if (!inventoryData.categories?.length && !inventoryData.locations?.length) {
        newErrors.categories = 'Dla inwentaryzacji częściowej wybierz przynajmniej jedną kategorię lub lokalizację';
      }
    }
    
    if (!inventoryData.assignedUsers?.length) {
      newErrors.assignedUsers = 'Przypisz przynajmniej jednego użytkownika';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Zapisz inwentaryzację
  const handleSave = () => {
    if (validateForm()) {
      onSave(inventoryData);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Zaplanuj nową inwentaryzację
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
            
            <div className="mt-2 max-h-[70vh] overflow-y-auto pr-1">
              <form>
                {/* Podstawowe informacje */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nazwa inwentaryzacji *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={inventoryData.name}
                      onChange={handleInputChange}
                      className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="planDate" className="block text-sm font-medium text-gray-700">
                      Data inwentaryzacji *
                    </label>
                    <input
                      type="date"
                      name="planDate"
                      id="planDate"
                      value={inventoryData.planDate}
                      onChange={handleInputChange}
                      className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.planDate ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.planDate && <p className="mt-1 text-sm text-red-600">{errors.planDate}</p>}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Typ inwentaryzacji *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={inventoryData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="full">Pełna</option>
                    <option value="partial">Częściowa</option>
                    <option value="random">Wyrywkowa</option>
                  </select>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Opis
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={inventoryData.description}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Kategorie i lokalizacje (dla inwentaryzacji częściowej) */}
                {inventoryData.type === 'partial' && (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategorie
                      </label>
                      <div className={`border border-gray-300 rounded-md max-h-40 overflow-y-auto p-2 ${
                        errors.categories ? 'border-red-300' : ''
                      }`}>
                        {mockCategories.map(category => (
                          <div key={category.id} className="flex items-center mb-1">
                            <input
                              id={`category-${category.id}`}
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={inventoryData.categories?.includes(category.id) || false}
                              onChange={() => handleCheckboxChange('categories', category.id)}
                            />
                            <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-700">
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokalizacje
                      </label>
                      <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto p-2">
                        {mockLocations
                          .filter(location => ['warehouse', 'zone'].includes(location.type))
                          .map(location => (
                            <div key={location.id} className="flex items-center mb-1">
                              <input
                                id={`location-${location.id}`}
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                checked={inventoryData.locations?.includes(location.id) || false}
                                onChange={() => handleCheckboxChange('locations', location.id)}
                              />
                              <label htmlFor={`location-${location.id}`} className="ml-2 block text-sm text-gray-700">
                                {location.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Przypisani użytkownicy */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Przypisani użytkownicy *
                  </label>
                  <div className={`border border-gray-300 rounded-md max-h-32 overflow-y-auto p-2 mb-2 ${
                    errors.assignedUsers ? 'border-red-300' : ''
                  }`}>
                    {users.map(user => (
                      <div key={user} className="flex items-center mb-1">
                        <input
                          id={`user-${user}`}
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={inventoryData.assignedUsers?.includes(user) || false}
                          onChange={() => handleCheckboxChange('assignedUsers', user)}
                        />
                        <label htmlFor={`user-${user}`} className="ml-2 block text-sm text-gray-700">
                          {user}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.assignedUsers && <p className="mt-1 text-sm text-red-600">{errors.assignedUsers}</p>}
                  
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Dodaj nowego użytkownika"
                      className="flex-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md rounded-r-none"
                      value={newUser}
                      onChange={(e) => setNewUser(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUser())}
                    />
                    <button
                      type="button"
                      onClick={handleAddUser}
                      className="inline-flex items-center px-3 py-2 border border-transparent border-l-0 text-sm font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Dodaj
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-col sm:flex-row-reverse sm:gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Zaplanuj inwentaryzację
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPlanModal;