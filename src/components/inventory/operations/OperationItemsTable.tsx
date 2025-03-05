"use client";

import React, { useState } from 'react';
import { Trash2, Plus, Search } from 'lucide-react';
import { InventoryItem } from '../mockData';

export interface OperationItem {
  id: string;
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice?: number;
  unitMeasure: string;
  locationFrom?: string;
  locationTo?: string;
}

interface OperationItemsTableProps {
  items: OperationItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: string, value: any) => void;
  onDeleteItem: (id: string) => void;
  showPrices?: boolean;
  showLocations?: boolean;
  inventoryItems: InventoryItem[];
  readOnly?: boolean;
}

const OperationItemsTable: React.FC<OperationItemsTableProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  showPrices = false,
  showLocations = false,
  inventoryItems = [],
  readOnly = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Filtrowanie elementów magazynowych według wyszukiwanej frazy
  const filteredItems = inventoryItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.code.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });
  
  // Obliczenie sumy wartości
  const total = items.reduce((sum, item) => {
    const itemPrice = item.unitPrice || 0;
    return sum + (item.quantity * itemPrice);
  }, 0);
  
  // Formatowanie wartości waluty
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Obsługa wyboru elementu z pickera
  const handleSelectItem = (inventoryItem: InventoryItem) => {
    if (!selectedItemId) return;
    
    onUpdateItem(
      selectedItemId,
      'item',
      {
        itemId: inventoryItem.id,
        itemCode: inventoryItem.code,
        itemName: inventoryItem.name,
        unitMeasure: inventoryItem.unit,
        unitPrice: inventoryItem.value
      }
    );
    
    setShowItemPicker(false);
    setSelectedItemId(null);
    setSearchQuery('');
  };
  
  // Pokazywanie pickera elementów dla konkretnego wiersza
  const showPickerForItem = (id: string) => {
    setSelectedItemId(id);
    setShowItemPicker(true);
  };
  
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kod</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nazwa elementu</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ilość</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">J.m.</th>
                {showPrices && (
                  <>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cena jedn.</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Wartość</th>
                  </>
                )}
                {showLocations && (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Z lokalizacji</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Do lokalizacji</th>
                  </>
                )}
                {!readOnly && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Akcje
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {readOnly ? (
                      item.itemCode
                    ) : (
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => showPickerForItem(item.id)}
                      >
                        {item.itemCode || 'Wybierz element'}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.itemName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    {readOnly ? (
                      item.quantity
                    ) : (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        className="w-20 text-right px-2 py-1 border rounded"
                        value={item.quantity}
                        onChange={(e) => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.unitMeasure}
                  </td>
                  {showPrices && (
                    <>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {readOnly ? (
                          formatCurrency(item.unitPrice || 0)
                        ) : (
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-24 text-right px-2 py-1 border rounded"
                            value={item.unitPrice || 0}
                            onChange={(e) => onUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                        {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))}
                      </td>
                    </>
                  )}
                  {showLocations && (
                    <>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {readOnly ? (
                          item.locationFrom
                        ) : (
                          <select
                            className="w-24 px-2 py-1 border rounded"
                            value={item.locationFrom || ''}
                            onChange={(e) => onUpdateItem(item.id, 'locationFrom', e.target.value)}
                          >
                            <option value="">Wybierz</option>
                            {/* Tu powinny być opcje lokalizacji */}
                            <option value="A1-01">A1-01</option>
                            <option value="A1-02">A1-02</option>
                            <option value="B1-01">B1-01</option>
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {readOnly ? (
                          item.locationTo
                        ) : (
                          <select
                            className="w-24 px-2 py-1 border rounded"
                            value={item.locationTo || ''}
                            onChange={(e) => onUpdateItem(item.id, 'locationTo', e.target.value)}
                          >
                            <option value="">Wybierz</option>
                            {/* Tu powinny być opcje lokalizacji */}
                            <option value="A1-01">A1-01</option>
                            <option value="A1-02">A1-02</option>
                            <option value="B1-01">B1-01</option>
                          </select>
                        )}
                      </td>
                    </>
                  )}
                  {!readOnly && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => onDeleteItem(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={showPrices ? 6 : 4} className="px-4 py-8 text-center text-gray-500">
                    Brak pozycji. {!readOnly && 'Kliknij "Dodaj pozycję" aby dodać element.'}
                  </td>
                </tr>
              )}
            </tbody>
            {showPrices && items.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-3 text-right font-medium">Suma:</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(total)}</td>
                  {!readOnly && <td></td>}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
      
      {!readOnly && (
        <div className="flex justify-start mb-6">
          <button
            onClick={onAddItem}
            className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Dodaj pozycję
          </button>
        </div>
      )}
      
      {/* Picker elementów */}
      {showItemPicker && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Wybierz element</h2>
            </div>
            
            <div className="p-6 border-b">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Szukaj elementów..." 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={20} 
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-grow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kod
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nazwa
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategoria
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dostępny
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      J.m.
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cena
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleSelectItem(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.stock > item.minStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.stock} {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(item.value)}
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nie znaleziono elementów pasujących do zapytania
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setShowItemPicker(false);
                  setSelectedItemId(null);
                  setSearchQuery('');
                }}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OperationItemsTable;
