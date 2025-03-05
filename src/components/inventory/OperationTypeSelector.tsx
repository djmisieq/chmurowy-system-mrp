"use client";

import React from 'react';
import { ArrowDown, ArrowUp, ArrowLeftRight, RefreshCw, Clipboard, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface OperationType {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface OperationTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (typeId: string) => void;
}

const OperationTypeSelector: React.FC<OperationTypeSelectorProps> = ({ 
  selectedType, 
  onTypeSelect 
}) => {
  // Definicje typów operacji
  const operationTypes: OperationType[] = [
    {
      id: 'receipt',
      code: 'PZ',
      name: 'Przyjęcie zewnętrzne',
      description: 'Przyjęcie towaru od dostawcy zewnętrznego',
      icon: <ArrowDown size={24} />,
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'issue',
      code: 'WZ',
      name: 'Wydanie zewnętrzne',
      description: 'Wydanie towaru na zewnątrz firmy',
      icon: <ArrowUp size={24} />,
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'internal_receipt',
      code: 'PW',
      name: 'Przyjęcie wewnętrzne',
      description: 'Przyjęcie towaru z produkcji wewnętrznej',
      icon: <ArrowDownLeft size={24} />,
      color: 'bg-teal-100 text-teal-700 border-teal-200'
    },
    {
      id: 'internal_issue',
      code: 'RW',
      name: 'Wydanie wewnętrzne',
      description: 'Wydanie towaru do produkcji wewnętrznej',
      icon: <ArrowUpRight size={24} />,
      color: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      id: 'transfer',
      code: 'MM',
      name: 'Przesunięcie międzymagazynowe',
      description: 'Przesunięcie towaru między magazynami',
      icon: <ArrowLeftRight size={24} />,
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'inventory',
      code: 'IN',
      name: 'Inwentaryzacja',
      description: 'Aktualizacja stanów magazynowych po inwentaryzacji',
      icon: <Clipboard size={24} />,
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  ];
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Wybierz typ operacji</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operationTypes.map((type) => (
          <div 
            key={type.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all
              ${selectedType === type.id ? `${type.color} ring-2 ring-offset-2 ring-opacity-50 ring-blue-500` : 'border-gray-200 hover:border-blue-300'}
            `}
            onClick={() => onTypeSelect(type.id)}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${selectedType === type.id ? '' : 'bg-gray-100'}`}>
                {type.icon}
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <span className="text-sm font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded mr-2">
                    {type.code}
                  </span>
                  <h4 className="font-medium">{type.name}</h4>
                </div>
                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationTypeSelector;
