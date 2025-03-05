"use client";

import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, ClipboardList, ArrowLeftRight } from 'lucide-react';

export type OperationType = 'receipt' | 'issue' | 'internal_receipt' | 'internal_issue' | 'transfer' | 'inventory';

interface OperationTypeSelectorProps {
  selectedType: OperationType;
  onTypeSelect: (type: OperationType) => void;
}

interface OperationTypeOption {
  value: OperationType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const OperationTypeSelector: React.FC<OperationTypeSelectorProps> = ({ 
  selectedType,
  onTypeSelect 
}) => {
  const operationTypes: OperationTypeOption[] = [
    {
      value: 'receipt',
      label: 'Przyjęcie zewnętrzne (PZ)',
      description: 'Przyjęcie materiałów lub towarów od dostawcy zewnętrznego',
      icon: <ArrowDownCircle size={24} />,
      color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
    },
    {
      value: 'issue',
      label: 'Wydanie zewnętrzne (WZ)',
      description: 'Wydanie materiałów lub produktów na zewnątrz',
      icon: <ArrowUpCircle size={24} />,
      color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
    },
    {
      value: 'internal_receipt',
      label: 'Przyjęcie wewnętrzne (PW)',
      description: 'Przyjęcie materiałów lub produktów z produkcji własnej',
      icon: <ArrowDownCircle size={24} />,
      color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
    },
    {
      value: 'internal_issue',
      label: 'Wydanie wewnętrzne (RW)',
      description: 'Wydanie materiałów do produkcji lub zużycia wewnętrznego',
      icon: <ArrowUpCircle size={24} />,
      color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
    },
    {
      value: 'transfer',
      label: 'Przesunięcie międzymagazynowe (MM)',
      description: 'Przesunięcie materiałów między lokalizacjami magazynowymi',
      icon: <ArrowLeftRight size={24} />,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
    },
    {
      value: 'inventory',
      label: 'Inwentaryzacja (IN)',
      description: 'Korekta stanów magazynowych na podstawie inwentaryzacji',
      icon: <ClipboardList size={24} />,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {operationTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => onTypeSelect(type.value)}
          className={`p-4 border rounded-lg text-left transition-colors ${type.color} ${
            selectedType === type.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              {type.icon}
            </div>
            <div className="ml-4">
              <h3 className="font-medium">{type.label}</h3>
              <p className="mt-1 text-sm opacity-80">{type.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default OperationTypeSelector;
