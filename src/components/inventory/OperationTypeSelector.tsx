"use client";

import React from 'react';
import { ArrowDown, ArrowUp, ArrowLeftRight, RefreshCw, Truck, Box } from 'lucide-react';

interface OperationType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface OperationTypeSelectorProps {
  onSelect: (typeId: string) => void;
  selectedType?: string;
}

const OperationTypeSelector: React.FC<OperationTypeSelectorProps> = ({ 
  onSelect,
  selectedType = '' 
}) => {
  // Typy operacji magazynowych
  const operationTypes: OperationType[] = [
    {
      id: 'PZ',
      name: 'Przyjęcie zewnętrzne (PZ)',
      description: 'Przyjęcie elementów od dostawcy zewnętrznego',
      icon: <Truck />,
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'WZ',
      name: 'Wydanie zewnętrzne (WZ)',
      description: 'Wydanie elementów dla klienta zewnętrznego',
      icon: <ArrowUp />,
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'PW',
      name: 'Przyjęcie wewnętrzne (PW)',
      description: 'Przyjęcie elementów z produkcji lub innego działu',
      icon: <ArrowDown />,
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'RW',
      name: 'Wydanie wewnętrzne (RW)',
      description: 'Wydanie elementów do produkcji lub innego działu',
      icon: <Box />,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    {
      id: 'MM',
      name: 'Przesunięcie międzymagazynowe (MM)',
      description: 'Przesunięcie elementów między lokalizacjami',
      icon: <ArrowLeftRight />,
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    {
      id: 'IN',
      name: 'Inwentaryzacja (IN)',
      description: 'Korekta stanów magazynowych po spisie z natury',
      icon: <RefreshCw />,
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {operationTypes.map((type) => (
        <div 
          key={type.id}
          className={`
            cursor-pointer border rounded-lg p-4 transition-colors
            ${selectedType === type.id ? type.color : 'bg-white border-gray-200 hover:bg-gray-50'}
          `}
          onClick={() => onSelect(type.id)}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${selectedType === type.id ? 'bg-white' : 'bg-gray-100'}`}>
              {type.icon}
            </div>
            <div className="ml-3">
              <h3 className="font-medium">{type.name}</h3>
              <p className="text-sm mt-1">{type.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OperationTypeSelector;
