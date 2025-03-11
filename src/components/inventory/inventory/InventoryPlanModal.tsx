import React, { useState } from 'react';
import { X, Plus, Calendar, Users } from 'lucide-react';
import { Inventory, mockCategories, mockLocations } from '../mockInventory';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Alert from '@/components/ui/Alert';

interface InventoryPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Inventory>) => void;
  isLoading?: boolean;
}

const InventoryPlanModal: React.FC<InventoryPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false
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
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  
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
    
    if (Object.keys(newErrors).length > 0) {
      setShowValidationAlert(true);
      return false;
    }
    
    return true;
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
            
            {showValidationAlert && (
              <div className="mb-4">
                <Alert 
                  variant="error" 
                  title="Błędy formularza" 
                  dismissible 
                  onDismiss={() => setShowValidationAlert(false)}
                >
                  Prosimy poprawić błędy w formularzu, aby kontynuować.
                </Alert>
              </div>
            )}
            
            <div className="mt-2 max-h-[70vh] overflow-y-auto pr-1">
              <form>
                {/* Podstawowe informacje */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Input
                      label="Nazwa inwentaryzacji *"
                      name="name"
                      id="name"
                      value={inventoryData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Data inwentaryzacji *"
                      type="date"
                      name="planDate"
                      id="planDate"
                      value={inventoryData.planDate}
                      onChange={handleInputChange}
                      error={errors.planDate}
                      icon={<Calendar size={18} />}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Select
                    label="Typ inwentaryzacji *"
                    id="type"
                    name="type"
                    value={inventoryData.type}
                    onChange={handleInputChange}
                    options={[
                      { value: 'full', label: 'Pełna' },
                      { value: 'partial', label: 'Częściowa' },
                      { value: 'random', label: 'Wyrywkowa' }
                    ]}
                  />
                </div>
                
                <div className="mt-4">
                  <Input
                    label="Opis"
                    name="description"
                    id="description"
                    value={inventoryData.description || ''}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
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
                        errors.categories ? 'border-danger-500' : ''
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
                      {errors.categories && <p className="mt-1 text-sm text-danger-500">{errors.categories}</p>}
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
                    errors.assignedUsers ? 'border-danger-500' : ''
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
                  {errors.assignedUsers && <p className="mt-1 text-sm text-danger-500">{errors.assignedUsers}</p>}
                  
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Dodaj nowego użytkownika"
                      className="flex-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md rounded-r-none"
                      value={newUser}
                      onChange={(e) => setNewUser(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUser())}
                    />
                    <Button
                      variant="primary"
                      icon={<Plus size={16} />}
                      onClick={handleAddUser}
                      className="rounded-l-none"
                    >
                      Dodaj
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-col sm:flex-row-reverse sm:gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Przetwarzanie...' : 'Zaplanuj inwentaryzację'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Anuluj
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPlanModal;