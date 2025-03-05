"use client";

import React from 'react';
import { ArrowDown, ArrowUp, ArrowLeftRight, Edit, Trash2 } from 'lucide-react';

interface ItemActionPanelProps {
  onReceive?: () => void;
  onIssue?: () => void;
  onTransfer?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disableDelete?: boolean;
}

const ItemActionPanel: React.FC<ItemActionPanelProps> = ({ 
  onReceive = () => {},
  onIssue = () => {},
  onTransfer = () => {},
  onEdit = () => {},
  onDelete = () => {},
  disableDelete = false
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3">
      <button
        onClick={onReceive}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <ArrowDown size={18} className="mr-2" />
        Przyjęcie na magazyn
      </button>
      
      <button
        onClick={onIssue}
        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        <ArrowUp size={18} className="mr-2" />
        Wydanie z magazynu
      </button>
      
      <button
        onClick={onTransfer}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <ArrowLeftRight size={18} className="mr-2" />
        Przesunięcie międzymagazynowe
      </button>
      
      <button
        onClick={onEdit}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Edit size={18} className="mr-2" />
        Edycja danych elementu
      </button>
      
      {!disableDelete && (
        <button
          onClick={onDelete}
          className="flex items-center px-4 py-2 bg-gray-100 text-red-600 rounded-md hover:bg-gray-200 transition-colors ml-auto"
        >
          <Trash2 size={18} className="mr-2" />
          Usuń
        </button>
      )}
    </div>
  );
};

export default ItemActionPanel;
