"use client";

import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Edit, Trash, Clock, Tag, MapPin, Box, TrendingUp, BarChart2 } from 'lucide-react';

// Sample inventory item type
interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  stock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  value: number;
  category: string;
  location: string;
  status: string;
  code: string;
  lastUpdate?: string;
}

interface InventoryItemDetailProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
}

/**
 * Component for displaying detailed information about an inventory item
 */
const InventoryItemDetail: React.FC<InventoryItemDetailProps> = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!item) {
    return null;
  }

  // Format currency value
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return <Badge variant="success" dot>Dobry</Badge>;
      case 'warning':
      case 'low':
        return <Badge variant="warning" dot>Niski stan</Badge>;
      case 'critical':
        return <Badge variant="danger" dot>Krytyczny</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Szczegóły produktu: ${item.name}`}
        size="lg"
        footer={
          <>
            <div className="flex justify-between w-full">
              <div>
                {onDelete && (
                  <Button
                    variant="outline"
                    icon={<Trash size={16} />}
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="text-danger-500 border-danger-200 hover:bg-danger-50"
                  >
                    Usuń
                  </Button>
                )}
              </div>
              <div className="space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Zamknij
                </Button>
                {onEdit && (
                  <Button
                    variant="primary"
                    icon={<Edit size={16} />}
                    onClick={() => onEdit(item)}
                  >
                    Edytuj
                  </Button>
                )}
              </div>
            </div>
          </>
        }
      >
        <div className="space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Podstawowe informacje</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Kod produktu</p>
                  <p className="font-mono font-medium">{item.code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nazwa</p>
                  <p className="font-medium">{item.name}</p>
                </div>
                {item.description && (
                  <div>
                    <p className="text-xs text-gray-500">Opis</p>
                    <p>{item.description}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <Tag className="text-gray-400 mr-2" size={16} />
                  <p className="text-sm">{item.category}</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-gray-400 mr-2" size={16} />
                  <p className="text-sm">{item.location}</p>
                </div>
                {item.lastUpdate && (
                  <div className="flex items-center">
                    <Clock className="text-gray-400 mr-2" size={16} />
                    <p className="text-xs text-gray-500">
                      Ostatnia aktualizacja: {new Date(item.lastUpdate).toLocaleString('pl-PL')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Stan magazynowy</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Stan</p>
                    <p className="text-lg font-bold">
                      {item.stock} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                    </p>
                  </div>
                </div>

                {/* Stock level indicator */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Min: {item.minStock}</span>
                    {item.maxStock && <span>Max: {item.maxStock}</span>}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.stock < item.minStock 
                          ? 'bg-danger-500' 
                          : item.maxStock && item.stock > item.maxStock 
                          ? 'bg-warning-500' 
                          : 'bg-success-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, item.maxStock ? (item.stock / item.maxStock) * 100 : (item.stock / (item.minStock * 2)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Wartość jednostkowa</p>
                    <p className="font-medium">{formatCurrency(item.value)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Wartość całkowita</p>
                    <p className="font-medium">{formatCurrency(item.value * item.stock)}</p>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" icon={<Box size={14} />}>
                  Ruch magazynowy
                </Button>
                <Button variant="outline" size="sm" icon={<TrendingUp size={14} />}>
                  Historia
                </Button>
                <Button variant="outline" size="sm" icon={<BarChart2 size={14} />}>
                  Statystyki
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Potwierdź usunięcie"
        size="sm"
        footer={
          <Modal.Footer
            onClose={() => setIsDeleteConfirmOpen(false)}
            onConfirm={() => {
              onDelete?.(item);
              setIsDeleteConfirmOpen(false);
              onClose();
            }}
            confirmText="Usuń"
            danger
          />
        }
      >
        <div className="py-4">
          <p className="text-gray-700">
            Czy na pewno chcesz usunąć produkt <strong>{item.name}</strong>?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Ta operacja jest nieodwracalna.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default InventoryItemDetail;