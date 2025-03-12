"use client";

import React from 'react';
import { Package, Layers, Box, HardDrive, Edit, X } from 'lucide-react';
import { BomItem } from '@/types/bom.types';

interface BomItemDetailProps {
  item: BomItem | null;
  onClose?: () => void;
  onEdit?: (item: BomItem) => void;
}

const BomItemDetail: React.FC<BomItemDetailProps> = ({ item, onClose, onEdit }) => {
  if (!item) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Wybierz element z drzewa BOM, aby zobaczyć szczegóły
      </div>
    );
  }

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'product':
        return <Layers className="text-blue-600" size={24} />;
      case 'assembly':
        return <Box className="text-green-600" size={24} />;
      case 'component':
        return <Package className="text-amber-600" size={24} />;
      case 'material':
        return <HardDrive className="text-gray-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  const getItemTypeLabel = (itemType: string) => {
    switch (itemType) {
      case 'product':
        return 'Produkt';
      case 'assembly':
        return 'Zespół';
      case 'component':
        return 'Komponent';
      case 'material':
        return 'Materiał';
      default:
        return itemType;
    }
  };

  const getItemTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'product':
        return 'bg-blue-100 text-blue-800';
      case 'assembly':
        return 'bg-green-100 text-green-800';
      case 'component':
        return 'bg-amber-100 text-amber-800';
      case 'material':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-semibold">Szczegóły elementu</h3>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
              title="Edytuj element"
            >
              <Edit size={20} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
              title="Zamknij"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex items-center">
        <div className="mr-4">
          {getItemIcon(item.itemType)}
        </div>
        <div>
          <h2 className="text-lg font-bold">{item.itemName}</h2>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getItemTypeColor(item.itemType)}`}>
            {getItemTypeLabel(item.itemType)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="text-sm text-gray-500 mb-1">ID elementu</h4>
          <p>{item.itemId}</p>
        </div>
        <div>
          <h4 className="text-sm text-gray-500 mb-1">Ilość</h4>
          <p>{item.quantity} {item.unit}</p>
        </div>
        {item.version && (
          <div>
            <h4 className="text-sm text-gray-500 mb-1">Wersja</h4>
            <p>{item.version}</p>
          </div>
        )}
      </div>

      {item.description && (
        <div className="mb-6">
          <h4 className="text-sm text-gray-500 mb-1">Opis</h4>
          <p className="text-gray-700">{item.description}</p>
        </div>
      )}

      {item.alternativeItems && item.alternativeItems.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Alternatywne materiały</h4>
          <div className="bg-gray-50 rounded p-3">
            {item.alternativeItems.map((altItem, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <span>{altItem.itemName}</span>
                <span className="text-xs text-gray-500">Współczynnik: {altItem.replacementRatio}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.attributes && Object.keys(item.attributes).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Atrybuty</h4>
          <div className="bg-gray-50 rounded p-3">
            {Object.entries(item.attributes).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <span className="text-gray-700">{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.files && item.files.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Dokumenty</h4>
          <div className="bg-gray-50 rounded p-3">
            {item.files.map((file, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <span>{file.name}</span>
                <span className="text-xs text-primary-600 cursor-pointer">Pobierz</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for additional data that might be added in the future */}
      <div className="mt-8 p-4 bg-gray-50 rounded text-sm text-gray-500">
        Dodatkowe informacje i historia zmian będą dostępne w przyszłych wersjach.
      </div>
    </div>
  );
};

export default BomItemDetail;