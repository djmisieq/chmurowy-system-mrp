"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { RouteOperation, ProductionRoute } from '@/types/route.types';
import RouteOperationForm from './RouteOperationForm';
import SubOperationsManager from './SubOperationsManager';
import OperationDependenciesManager from './OperationDependenciesManager';

interface RouteOperationModalProps {
  isOpen: boolean;
  operation: RouteOperation | null;
  parentOperationId?: string;
  route: ProductionRoute;
  workCenters: { id: string; name: string }[];
  resources: { id: string; name: string; type: string }[];
  materials: { id: string; name: string; unit: string }[];
  onSave: (operation: RouteOperation, isSubOperation?: boolean) => void;
  onCancel: () => void;
}

const RouteOperationModal: React.FC<RouteOperationModalProps> = ({
  isOpen,
  operation,
  parentOperationId,
  route,
  workCenters,
  resources,
  materials,
  onSave,
  onCancel
}) => {
  const isNewOperation = !operation;
  const isSubOperation = !!parentOperationId;

  const [currentOperation, setCurrentOperation] = useState<RouteOperation | null>(operation);
  const [currentTab, setCurrentTab] = useState<'details' | 'subOperations' | 'dependencies'>('details');
  const [showSubOperationForm, setShowSubOperationForm] = useState(false);
  const [selectedSubOperation, setSelectedSubOperation] = useState<RouteOperation | null>(null);

  useEffect(() => {
    setCurrentOperation(operation);
    setCurrentTab('details');
    setShowSubOperationForm(false);
    setSelectedSubOperation(null);
  }, [operation, isOpen]);

  if (!isOpen) return null;

  const handleSave = (updatedOperation: RouteOperation) => {
    setCurrentOperation(updatedOperation);
    onSave(updatedOperation, isSubOperation);
  };

  const handleDependenciesChange = (predecessorOperations: string[]) => {
    if (!currentOperation) return;
    
    setCurrentOperation({
      ...currentOperation,
      predecessorOperations
    });
  };

  const handleAddSubOperation = () => {
    setSelectedSubOperation(null);
    setShowSubOperationForm(true);
  };

  const handleEditSubOperation = (subOperation: RouteOperation) => {
    setSelectedSubOperation(subOperation);
    setShowSubOperationForm(true);
  };

  const handleDeleteSubOperation = (subOperationId: string) => {
    if (!currentOperation) return;
    
    const confirmed = window.confirm('Czy na pewno chcesz usunąć tę podoperację?');
    if (!confirmed) return;
    
    const updatedSubOperations = currentOperation.subOperations?.filter(
      op => op.id !== subOperationId
    ) || [];
    
    const updatedOperation = {
      ...currentOperation,
      subOperations: updatedSubOperations
    };
    
    setCurrentOperation(updatedOperation);
    onSave(updatedOperation, isSubOperation);
  };

  const handleReorderSubOperations = (subOperations: RouteOperation[]) => {
    if (!currentOperation) return;
    
    const updatedOperation = {
      ...currentOperation,
      subOperations
    };
    
    setCurrentOperation(updatedOperation);
    onSave(updatedOperation, isSubOperation);
  };

  const handleSaveSubOperation = (subOperation: RouteOperation) => {
    if (!currentOperation) return;
    
    // If editing an existing sub-operation, replace it
    // Otherwise, add a new one
    let updatedSubOperations: RouteOperation[] = [];
    
    if (selectedSubOperation) {
      updatedSubOperations = currentOperation.subOperations?.map(op => 
        op.id === selectedSubOperation.id ? subOperation : op
      ) || [];
    } else {
      updatedSubOperations = [...(currentOperation.subOperations || []), subOperation];
    }
    
    const updatedOperation = {
      ...currentOperation,
      subOperations: updatedSubOperations
    };
    
    setCurrentOperation(updatedOperation);
    setShowSubOperationForm(false);
    onSave(updatedOperation, isSubOperation);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold">
            {isNewOperation 
              ? (isSubOperation ? 'Dodaj podoperację' : 'Dodaj operację') 
              : 'Edytuj operację'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Zamknij"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        {!isSubOperation && !isNewOperation && (
          <div className="flex border-b">
            <button 
              onClick={() => setCurrentTab('details')}
              className={`px-6 py-3 text-sm font-medium ${
                currentTab === 'details' 
                  ? 'border-b-2 border-primary-500 text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Szczegóły operacji
            </button>
            <button 
              onClick={() => setCurrentTab('subOperations')}
              className={`px-6 py-3 text-sm font-medium ${
                currentTab === 'subOperations' 
                  ? 'border-b-2 border-primary-500 text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Podoperacje
            </button>
            <button 
              onClick={() => setCurrentTab('dependencies')}
              className={`px-6 py-3 text-sm font-medium ${
                currentTab === 'dependencies' 
                  ? 'border-b-2 border-primary-500 text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Zależności
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showSubOperationForm ? (
            <RouteOperationForm
              operation={selectedSubOperation}
              parentOperationId={currentOperation?.id}
              workCenters={workCenters}
              resources={resources}
              materials={materials}
              onSave={handleSaveSubOperation}
              onCancel={() => setShowSubOperationForm(false)}
            />
          ) : currentTab === 'details' || isSubOperation || isNewOperation ? (
            <RouteOperationForm
              operation={currentOperation}
              parentOperationId={parentOperationId}
              workCenters={workCenters}
              resources={resources}
              materials={materials}
              onSave={handleSave}
              onCancel={onCancel}
            />
          ) : currentTab === 'subOperations' && currentOperation ? (
            <SubOperationsManager
              operation={currentOperation}
              onAddSubOperation={handleAddSubOperation}
              onEditSubOperation={handleEditSubOperation}
              onDeleteSubOperation={handleDeleteSubOperation}
              onReorderSubOperations={handleReorderSubOperations}
            />
          ) : currentTab === 'dependencies' && currentOperation ? (
            <OperationDependenciesManager
              operation={currentOperation}
              allOperations={route.operations}
              onDependenciesChange={handleDependenciesChange}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RouteOperationModal;