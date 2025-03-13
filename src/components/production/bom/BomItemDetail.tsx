"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Layers, Box, HardDrive, Edit, X, Check, AlertTriangle, XCircle, List, BarChart2 } from 'lucide-react';
import { BomItem } from '@/types/bom.types';
import InventoryStatusForBom from './InventoryStatusForBom';

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  stock: number;
  threshold: number;
}

interface BomItemDetailProps {
  item: BomItem | null;
  onClose?: () => void;
  onEdit?: (item: BomItem) => void;
}

const BomItemDetail: React.FC<BomItemDetailProps> = ({ item, onClose, onEdit }) => {
  const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'inventory'>('details');

  // Fetch inventory data for material items
  useEffect(() => {
    const fetchInventoryData = async () => {
      if (item && item.itemType === 'material') {
        try {
          setLoading(true);
          const response = await axios.get('/materials.json');
          const materials = response.data;
          const found = materials.find((m: InventoryItem) => m.id === item.itemId);
          setInventoryItem(found || null);
        } catch (err) {
          console.error('Błąd podczas pobierania danych magazynowych:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setInventoryItem(null);
      }
    };

    fetchInventoryData();
  }, [item]);

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
  
  const getInventoryStatus = () => {
    if (!inventoryItem) return null;
    
    if (inventoryItem.stock < item.quantity) {
      return (
        <div className="flex items-center mt-2 text-red-600">
          <XCircle size={16} className="mr-1" />
          <span className="text-sm font-medium">Brak wystarczającej ilości materiału</span>
        </div>
      );
    } else if (inventoryItem.stock < inventoryItem.threshold) {
      return (
        <div className="flex items-center mt-2 text-yellow-600">
          <AlertTriangle size={16} className="mr-1" />
          <span className="text-sm font-medium">Niski stan magazynowy</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center mt-2 text-green-600">
          <Check size={16} className="mr-1" />
          <span className="text-sm font-medium">Dostępny na magazynie</span>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Szczegóły elementu</h3>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors duration-200"
                title="Edytuj element"
              >
                <Edit size={20} />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors duration-200"
                title="Zamknij"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <div className="mr-4">
            {getItemIcon(item.itemType)}
          </div>
          <div>
            <h2 className="text-lg font-bold">{item.itemName}</h2>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getItemTypeColor(item.itemType)}`}>
              {getItemTypeLabel(item.itemType)}
            </span>
            {/* Show inventory status for materials */}
            {item.itemType === 'material' && getInventoryStatus()}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b flex">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === 'details'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('details')}
        >
          <div className="flex items-center">
            <List size={16} className="mr-2" />
            Szczegóły
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
            activeTab === 'inventory'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('inventory')}
        >
          <div className="flex items-center">
            <BarChart2 size={16} className="mr-2" />
            Stan magazynowy
          </div>
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-grow overflow-y-auto">
        {activeTab === 'details' ? (
          <div className="p-6">
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
              
              {/* Show inventory amount for materials */}
              {item.itemType === 'material' && inventoryItem && (
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Dostępne na magazynie</h4>
                  <p className={
                    inventoryItem.stock < item.quantity 
                      ? 'text-red-600 font-semibold' 
                      : inventoryItem.stock < inventoryItem.threshold
                      ? 'text-yellow-600 font-semibold'
                      : 'text-green-600 font-semibold'
                  }>
                    {inventoryItem.stock} {inventoryItem.unit}
                  </p>
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
        ) : (
          <div className="p-4">
            <InventoryStatusForBom bomItem={item} showControls={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BomItemDetail;