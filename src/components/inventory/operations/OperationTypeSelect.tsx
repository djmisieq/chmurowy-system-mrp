"use client";

import React from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowLeftRight, 
  ClipboardCheck,
  Package,
  Truck 
} from 'lucide-react';
import { OPERATION_TYPE_LIST, OperationType } from '../models/operationTypes';

interface OperationTypeSelectProps {
  selectedType: OperationType | null;
  onTypeSelect: (type: OperationType) => void;
  showDescription?: boolean;
}

const OperationTypeSelect: React.FC<OperationTypeSelectProps> = ({ 
  selectedType, 
  onTypeSelect,
  showDescription = true 
}) => {
  // Mapowanie typów operacji na ikony
  const getTypeIcon = (type: OperationType) => {
    switch (type) {
      case 'receipt_external':
        return <Truck className="h-6 w-6 text-green-600" />;
      case 'issue_external':
        return <Truck className="h-6 w-6 text-red-600" />;
      case 'receipt_internal':
        return <ArrowDown className="h-6 w-6 text-teal-600" />;
      case 'issue_internal':
        return <ArrowUp className="h-6 w-6 text-orange-600" />;
      case 'transfer':
        return <ArrowLeftRight className="h-6 w-6 text-blue-600" />;
      case 'inventory':
        return <ClipboardCheck className="h-6 w-6 text-purple-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Wybierz typ operacji</h3>
        <p className="mt-1 text-sm text-gray-500">Zacznij od wybrania typu operacji magazynowej</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {OPERATION_TYPE_LIST.map((type) => (
          <div 
            key={type.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedType === type.id ? `bg-${type.color}-50 border-${type.color}-200` : 'hover:bg-gray-50'}`}
            onClick={() => onTypeSelect(type.id as OperationType)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getTypeIcon(type.id as OperationType)}
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-900">{type.code} - {type.name}</h4>
                {showDescription && (
                  <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationTypeSelect;
