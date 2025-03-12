"use client";

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Plus, 
  Clock, 
  Layers, 
  ArrowUpDown, 
  MoreHorizontal,
  FileText
} from 'lucide-react';
import { RouteOperation, ProductionRoute } from '@/types/route.types';

interface RouteOperationsListProps {
  route: ProductionRoute;
  onAddOperation?: () => void;
  onEditOperation?: (operation: RouteOperation) => void;
  onDeleteOperation?: (operationId: string) => void;
  onReorderOperations?: (operations: RouteOperation[]) => void;
  onOperationSelect?: (operation: RouteOperation) => void;
  selectedOperationId?: string;
}

const RouteOperationsList: React.FC<RouteOperationsListProps> = ({
  route,
  onAddOperation,
  onEditOperation,
  onDeleteOperation,
  onReorderOperations,
  onOperationSelect,
  selectedOperationId
}) => {
  const [expandedOperations, setExpandedOperations] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleExpand = (operationId: string) => {
    setExpandedOperations(prev => ({
      ...prev,
      [operationId]: !prev[operationId]
    }));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOperations = [...route.operations].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA: any = (a as any)[sortField];
    let valueB: any = (b as any)[sortField];
    
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getTotalTime = (operation: RouteOperation): number => {
    const setupTime = operation.setupTime || 0;
    const operationTime = operation.operationTime || 0;
    const waitTime = operation.waitTime || 0;
    const moveTime = operation.moveTime || 0;
    
    return setupTime + operationTime + waitTime + moveTime;
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={14} />;
    return sortDirection === 'asc' ? <ChevronDown size={14} /> : <ChevronRight size={14} />;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Operacje marszruty</h3>
        <button 
          onClick={onAddOperation}
          className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition flex items-center"
        >
          <Plus size={16} className="mr-1" /> Dodaj operację
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-3 py-3"></th>
              <th 
                onClick={() => handleSort('id')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  ID {renderSortIcon('id')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('name')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Nazwa operacji {renderSortIcon('name')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('workCenterName')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Centrum robocze {renderSortIcon('workCenterName')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('setupTime')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Czas przyg. {renderSortIcon('setupTime')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('operationTime')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Czas operacji {renderSortIcon('operationTime')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Status {renderSortIcon('status')}
                </div>
              </th>
              <th className="px-3 py-3 w-20 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOperations.map((operation) => (
              <React.Fragment key={operation.id}>
                <tr 
                  className={`hover:bg-gray-50 cursor-pointer ${selectedOperationId === operation.id ? 'bg-primary-50' : ''}`}
                  onClick={() => onOperationSelect && onOperationSelect(operation)}
                >
                  <td className="px-3 py-4 whitespace-nowrap">
                    {operation.subOperations && operation.subOperations.length > 0 ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(operation.id);
                        }}
                        className="text-gray-500 hover:text-primary-500"
                      >
                        {expandedOperations[operation.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                    ) : (
                      <span className="px-4"></span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {operation.id}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      {operation.subOperations && operation.subOperations.length > 0 && (
                        <Layers size={16} className="mr-2 text-gray-400" />
                      )}
                      {operation.name}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.workCenterName}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.setupTime} min
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operation.operationTime} min/szt
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${operation.status === 'active' ? 'bg-green-100 text-green-800' : 
                      operation.status === 'draft' ? 'bg-blue-100 text-blue-800' : 
                      operation.status === 'obsolete' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'}`}
                    >
                      {operation.status === 'active' ? 'Aktywna' :
                       operation.status === 'draft' ? 'Robocza' :
                       operation.status === 'obsolete' ? 'Wycofana' : 
                       operation.status || 'Nieokreślony'}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex space-x-1 justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditOperation && onEditOperation(operation);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Edytuj operację"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteOperation && onDeleteOperation(operation.id);
                        }}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Usuń operację"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Sub-operations if expanded */}
                {expandedOperations[operation.id] && operation.subOperations && operation.subOperations.map((subOperation) => (
                  <tr 
                    key={subOperation.id}
                    className={`bg-gray-50 hover:bg-gray-100 cursor-pointer ${selectedOperationId === subOperation.id ? 'bg-primary-50' : ''}`}
                    onClick={() => onOperationSelect && onOperationSelect(subOperation)}
                  >
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="px-4"></span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subOperation.id}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center ml-6">
                        {subOperation.name}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                      {subOperation.workCenterName}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                      {subOperation.setupTime} min
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                      {subOperation.operationTime} min/szt
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${subOperation.status === 'active' ? 'bg-green-100 text-green-800' : 
                        subOperation.status === 'draft' ? 'bg-blue-100 text-blue-800' : 
                        subOperation.status === 'obsolete' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                      >
                        {subOperation.status === 'active' ? 'Aktywna' :
                        subOperation.status === 'draft' ? 'Robocza' :
                        subOperation.status === 'obsolete' ? 'Wycofana' : 
                        subOperation.status || 'Nieokreślony'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex space-x-1 justify-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditOperation && onEditOperation(subOperation);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edytuj podoperację"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteOperation && onDeleteOperation(subOperation.id);
                          }}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Usuń podoperację"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            
            {sortedOperations.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                  Brak zdefiniowanych operacji. Kliknij "Dodaj operację", aby dodać pierwszą operację do marszruty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t text-right text-sm text-gray-500">
        Łączna liczba operacji: {sortedOperations.length}
      </div>
    </div>
  );
};

export default RouteOperationsList;