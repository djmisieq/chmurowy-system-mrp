"use client";

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { OperationItem } from '../models/operationModels';
import { InventoryItem } from '../mockData';

interface OperationItemTableProps {
  items: OperationItem[];
  availableItems: InventoryItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (index: number, item: OperationItem) => void;
  readOnly?: boolean;
  showPrices?: boolean;
}

const OperationItemTable: React.FC<OperationItemTableProps> = ({ 
  items, 
  availableItems,
  onAddItem,
  onRemoveItem,
  onItemChange,
  readOnly = false,
  showPrices = false,
}) => {
  // Formatowanie wartości
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '';
    
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Znalezienie elementu po ID
  const findItemById = (id: number): InventoryItem | undefined => {
    return availableItems.find(item => item.id === id);
  };
  
  // Obsługa zmiany elementu
  const handleItemSelect = (index: number, itemId: number) => {
    const inventoryItem = findItemById(itemId);
    if (!inventoryItem) return;
    
    const updatedItem = {
      ...items[index],
      itemId,
      unitPrice: inventoryItem.value,
      totalPrice: inventoryItem.value * (items[index].quantity || 0)
    };
    
    onItemChange(index, updatedItem);
  };
  
  // Obsługa zmiany ilości
  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedItem = {
      ...items[index],
      quantity,
      totalPrice: (items[index].unitPrice || 0) * quantity
    };
    
    onItemChange(index, updatedItem);
  };
  
  // Obsługa zmiany ceny jednostkowej
  const handleUnitPriceChange = (index: number, unitPrice: number) => {
    const updatedItem = {
      ...items[index],
      unitPrice,
      totalPrice: unitPrice * (items[index].quantity || 0)
    };
    
    onItemChange(index, updatedItem);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Pozycje dokumentu</h3>
        {!readOnly && (
          <button
            type="button"
            onClick={onAddItem}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-1" />
            Dodaj pozycję
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Element
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ilość
              </th>
              {showPrices && (
                <>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cena jedn.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wartość
                  </th>
                </>
              )}
              {!readOnly && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={showPrices ? 5 : 3} className="px-6 py-4 text-center text-sm text-gray-500">
                  Brak pozycji. {!readOnly && 'Kliknij "Dodaj pozycję" aby dodać elementy do dokumentu.'}
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const inventoryItem = findItemById(item.itemId);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {readOnly ? (
                        <div className="text-sm text-gray-900">
                          {inventoryItem?.name || `Element ID: ${item.itemId}`}
                          <div className="text-xs text-gray-500">{inventoryItem?.code || ''}</div>
                        </div>
                      ) : (
                        <select
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={item.itemId || ''}
                          onChange={(e) => handleItemSelect(index, Number(e.target.value))}
                        >
                          <option value="">Wybierz element...</option>
                          {availableItems.map((invItem) => (
                            <option key={invItem.id} value={invItem.id}>
                              {invItem.name} ({invItem.code})
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {readOnly ? (
                        <div className="text-sm text-gray-900">
                          {item.quantity} {inventoryItem?.unit || 'szt.'}
                        </div>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className="block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={item.quantity || ''}
                          onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                        />
                      )}
                    </td>
                    {showPrices && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {readOnly ? (
                            <div className="text-sm text-gray-900">
                              {formatCurrency(item.unitPrice)}
                            </div>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              value={item.unitPrice || ''}
                              onChange={(e) => handleUnitPriceChange(index, Number(e.target.value))}
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </>
                    )}
                    {!readOnly && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="text-red-600 hover:text-red-900"
                          title="Usuń"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperationItemTable;
