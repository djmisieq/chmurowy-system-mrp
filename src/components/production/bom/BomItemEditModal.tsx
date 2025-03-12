"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { BomItem } from '@/types/bom.types';
import BomItemEditForm from './BomItemEditForm';

interface BomItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedItem: BomItem) => void;
  onDelete?: (item: BomItem) => void;
  item: BomItem | null;
}

const BomItemEditModal: React.FC<BomItemEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  item
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  if (!isOpen || !item) return null;

  const handleDelete = () => {
    if (showDeleteConfirm && onDelete) {
      onDelete(item);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {showDeleteConfirm ? (
          <div className="p-6">
            <div className="flex items-center mb-4 text-amber-600">
              <AlertTriangle className="mr-2" size={24} />
              <h3 className="text-lg font-medium">Potwierdzenie usunięcia</h3>
            </div>
            <p className="mb-6">
              Czy na pewno chcesz usunąć element <strong>"{item.itemName}"</strong>? 
              {item.children && item.children.length > 0 && (
                <span className="text-red-600 block mt-2">
                  Uwaga: Ten element posiada {item.children.length} elementów podrzędnych, które również zostaną usunięte!
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Usuń
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <BomItemEditForm
              item={item}
              onSave={onSave}
              onCancel={onClose}
              onDelete={onDelete ? handleDelete : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BomItemEditModal;