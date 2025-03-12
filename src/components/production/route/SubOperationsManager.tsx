"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  ChevronDown, 
  ChevronRight,
  Clock,
  ArrowRight
} from 'lucide-react';
import { RouteOperation } from '@/types/route.types';

interface SubOperationsManagerProps {
  operation: RouteOperation;
  onAddSubOperation: () => void;
  onEditSubOperation: (subOperation: RouteOperation) => void;
  onDeleteSubOperation: (subOperationId: string) => void;
  onReorderSubOperations: (subOperations: RouteOperation[]) => void;
}

const SubOperationsManager: React.FC<SubOperationsManagerProps> = ({
  operation,
  onAddSubOperation,
  onEditSubOperation,
  onDeleteSubOperation,
  onReorderSubOperations
}) => {
  const [expandedList, setExpandedList] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
    // For Firefox compatibility
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === id) return;
    
    const draggedElement = document.getElementById(`sub-op-${draggedItem}`);
    const targetElement = document.getElementById(`sub-op-${id}`);
    
    if (draggedElement && targetElement) {
      targetElement.classList.add('border-primary-500');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(`sub-op-${id}`);
    if (targetElement) {
      targetElement.classList.remove('border-primary-500');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === id || !operation.subOperations) return;
    
    const targetElement = document.getElementById(`sub-op-${id}`);
    if (targetElement) {
      targetElement.classList.remove('border-primary-500');
    }
    
    // Find indices of dragged and target items
    const draggedIndex = operation.subOperations.findIndex(op => op.id === draggedItem);
    const targetIndex = operation.subOperations.findIndex(op => op.id === id);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Create a new array with the reordered items
      const newSubOperations = [...operation.subOperations];
      const [draggedOp] = newSubOperations.splice(draggedIndex, 1);
      newSubOperations.splice(targetIndex, 0, draggedOp);
      
      // Update the order
      onReorderSubOperations(newSubOperations);
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    // Clean up any remaining highlights
    document.querySelectorAll('.border-primary-500').forEach(el => {
      el.classList.remove('border-primary-500');
    });
  };

  // Calculate total time for the sub-operation
  const getTotalTime = (op: RouteOperation): number => {
    const setupTime = op.setupTime || 0;
    const operationTime = op.operationTime || 0;
    const waitTime = op.waitTime || 0;
    const moveTime = op.moveTime || 0;
    
    return setupTime + operationTime + waitTime + moveTime;
  };

  // Calculate the total time for all sub-operations
  const getTotalSubOperationsTime = (): number => {
    if (!operation.subOperations || operation.subOperations.length === 0) return 0;
    
    return operation.subOperations.reduce((total, subOp) => {
      return total + getTotalTime(subOp);
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 bg-gray-50 border-b cursor-pointer"
        onClick={() => setExpandedList(!expandedList)}
      >
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          {expandedList ? <ChevronDown size={20} className="mr-2" /> : <ChevronRight size={20} className="mr-2" />}
          Podoperacje ({operation.subOperations?.length || 0})
        </h3>
        <div className="flex items-center">
          <div className="mr-4 text-sm text-gray-500 flex items-center">
            <Clock size={16} className="mr-1" />
            Łączny czas: {getTotalSubOperationsTime()} min
          </div>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddSubOperation();
            }}
            className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition flex items-center"
          >
            <Plus size={16} className="mr-1" /> Dodaj podoperację
          </button>
        </div>
      </div>

      {expandedList && (
        <div className="p-4">
          {operation.subOperations && operation.subOperations.length > 0 ? (
            <div className="space-y-3">
              {operation.subOperations.map((subOperation) => (
                <div 
                  key={subOperation.id}
                  id={`sub-op-${subOperation.id}`}
                  className={`p-3 bg-gray-50 rounded-lg border-2 border-transparent ${
                    draggedItem === subOperation.id ? 'opacity-50' : 'opacity-100'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, subOperation.id)}
                  onDragOver={(e) => handleDragOver(e, subOperation.id)}
                  onDragLeave={(e) => handleDragLeave(e, subOperation.id)}
                  onDrop={(e) => handleDrop(e, subOperation.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{subOperation.name}</h4>
                      <div className="text-sm text-gray-500 mt-1">
                        {subOperation.workCenterName} | {getTotalTime(subOperation)} min
                      </div>
                      {subOperation.description && (
                        <p className="text-sm text-gray-600 mt-2">{subOperation.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => onEditSubOperation(subOperation)}
                        className="p-1 text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        title="Edytuj podoperację"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSubOperation(subOperation.id)}
                        className="p-1 text-red-600 hover:text-red-900 focus:outline-none"
                        title="Usuń podoperację"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
              <p>Brak zdefiniowanych podoperacji</p>
              <p className="mt-2 text-sm">Kliknij "Dodaj podoperację", aby dodać pierwszą podoperację</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubOperationsManager;