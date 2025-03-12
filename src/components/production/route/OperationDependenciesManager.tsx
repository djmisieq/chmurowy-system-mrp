"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  X, 
  ChevronDown, 
  ChevronRight, 
  AlertTriangle 
} from 'lucide-react';
import { RouteOperation } from '@/types/route.types';

interface OperationDependenciesManagerProps {
  operation: RouteOperation;
  allOperations: RouteOperation[];
  onDependenciesChange: (predecessorOperations: string[]) => void;
}

const OperationDependenciesManager: React.FC<OperationDependenciesManagerProps> = ({
  operation,
  allOperations,
  onDependenciesChange
}) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedPredecessors, setSelectedPredecessors] = useState<string[]>(
    operation.predecessorOperations || []
  );
  const [cycles, setCycles] = useState<string[]>([]);

  // Update selected dependencies if operation changes
  useEffect(() => {
    setSelectedPredecessors(operation.predecessorOperations || []);
  }, [operation]);

  // Filter out the current operation and its sub-operations from available operations
  const availableOperations = allOperations.filter(op => 
    op.id !== operation.id && 
    (!op.subOperations || !op.subOperations.some(subOp => subOp.id === operation.id))
  );

  // Check for circular dependencies
  const checkForCycles = (predecessorId: string): boolean => {
    // Direct cycle
    if (predecessorId === operation.id) {
      return true;
    }

    // If the predecessor operation has its own predecessors
    const predecessor = allOperations.find(op => op.id === predecessorId);
    if (predecessor && predecessor.predecessorOperations) {
      // Check if this operation is in the predecessor's chain
      if (predecessor.predecessorOperations.includes(operation.id)) {
        return true;
      }

      // Check recursively
      for (const predPred of predecessor.predecessorOperations) {
        if (checkForCycles(predPred)) {
          return true;
        }
      }
    }

    return false;
  };

  const handlePredecessorToggle = (predecessorId: string) => {
    setSelectedPredecessors(prev => {
      const newPredecessors = prev.includes(predecessorId)
        ? prev.filter(id => id !== predecessorId)
        : [...prev, predecessorId];
      
      // Update parent component
      onDependenciesChange(newPredecessors);
      
      // Check for cycles after update
      const newCycles = newPredecessors.filter(predId => checkForCycles(predId));
      setCycles(newCycles);
      
      return newPredecessors;
    });
  };

  const getPredecessorName = (predecessorId: string): string => {
    const predecessor = allOperations.find(op => op.id === predecessorId);
    return predecessor ? predecessor.name : 'Nieznana operacja';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 bg-gray-50 border-b cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          {expanded ? <ChevronDown size={20} className="mr-2" /> : <ChevronRight size={20} className="mr-2" />}
          Zależności operacji
        </h3>
        <div className="text-sm text-gray-500">
          {selectedPredecessors.length} {selectedPredecessors.length === 1 ? 'zależność' : 
            (selectedPredecessors.length >= 2 && selectedPredecessors.length <= 4) ? 'zależności' : 'zależności'}
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          {cycles.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertTriangle size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">Wykryto cykl zależności!</p>
                <p className="text-sm text-red-600">
                  Następujące operacje tworzą cykl (operacja zależy pośrednio lub bezpośrednio od siebie):
                </p>
                <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                  {cycles.map(cycleOpId => (
                    <li key={cycleOpId}>{getPredecessorName(cycleOpId)} ({cycleOpId})</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">
              Wybierz operacje, które muszą być zakończone przed rozpoczęciem tej operacji:
            </p>
          </div>

          {availableOperations.length > 0 ? (
            <div className="space-y-2">
              {availableOperations.map(op => (
                <div 
                  key={op.id}
                  className={`p-3 rounded-md border flex items-center justify-between ${
                    selectedPredecessors.includes(op.id)
                      ? cycles.includes(op.id)
                        ? 'bg-red-50 border-red-300'
                        : 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div>
                    <div className="font-medium">{op.name}</div>
                    <div className="text-xs text-gray-500">ID: {op.id} | Centrum: {op.workCenterName}</div>
                  </div>
                  <div className="flex items-center">
                    {selectedPredecessors.includes(op.id) && (
                      <ArrowRight size={20} className="mr-2 text-blue-500" />
                    )}
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedPredecessors.includes(op.id)}
                        onChange={() => handlePredecessorToggle(op.id)}
                        className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {selectedPredecessors.includes(op.id) ? 'Wybrano' : 'Wybierz'}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
              <p>Brak dostępnych operacji do wybrania jako poprzedniki</p>
            </div>
          )}

          {selectedPredecessors.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Wybrane poprzedniki:</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex flex-wrap gap-2">
                  {selectedPredecessors.map(predId => (
                    <div 
                      key={predId}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        cycles.includes(predId)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {getPredecessorName(predId)}
                      <button
                        type="button"
                        onClick={() => handlePredecessorToggle(predId)}
                        className="ml-1.5 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OperationDependenciesManager;