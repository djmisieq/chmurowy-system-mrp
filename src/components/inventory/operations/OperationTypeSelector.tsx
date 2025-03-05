import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { operationTypes } from '../mockOperations';

interface OperationTypeSelectorProps {
  onSelect: (type: string) => void;
}

const OperationTypeSelector: React.FC<OperationTypeSelectorProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Zamknij dropdown gdy kliknięcie jest poza komponentem
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelect = (type: string) => {
    onSelect(type);
    setIsOpen(false);
  };
  
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Nowa operacja</span>
        <ChevronDown size={18} className="ml-2 -mr-1" />
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              <span className="font-medium">Wybierz typ operacji:</span>
            </div>
            
            {operationTypes.map((type) => (
              <button
                key={type.id}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition ease-in-out duration-150"
                onClick={() => handleSelect(type.id)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {type.id}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{type.name}</p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationTypeSelector;