"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Check, XCircle, Info, Search, ArrowUpDown, RefreshCw } from 'lucide-react';
import { BomItem } from '@/types/bom.types';

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  stock: number;
  threshold: number;
}

interface FlattenedBomMaterial {
  id: string;
  itemId: string;
  itemName: string;
  itemType: string;
  quantity: number;
  unit: string;
  path: string;
  totalQuantity: number;
  inventory?: InventoryItem;
  status?: 'critical' | 'warning' | 'good' | 'unknown';
}

interface InventoryStatusForBomProps {
  bomItem: BomItem;
  quantity?: number;
  showControls?: boolean;
}

const InventoryStatusForBom: React.FC<InventoryStatusForBomProps> = ({ 
  bomItem, 
  quantity = 1,
  showControls = true
}) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [materialsData, setMaterialsData] = useState<FlattenedBomMaterial[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch inventory data
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/materials.json');
        setInventoryItems(response.data);
        setError(false);
      } catch (err) {
        console.error('Błąd podczas pobierania danych magazynowych:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  // Process BOM data when inventory items are loaded
  useEffect(() => {
    if (inventoryItems.length > 0) {
      processBomData();
    }
  }, [inventoryItems, bomItem, quantity]);

  const processBomData = () => {
    // Flatten the BOM structure and extract materials
    const flattenedMaterials: FlattenedBomMaterial[] = [];
    
    const traverseBom = (item: BomItem, parentPath: string = "", parentMultiplier: number = 1) => {
      const currentPath = parentPath ? `${parentPath} > ${item.itemName}` : item.itemName;
      const currentMultiplier = parentMultiplier * item.quantity;
      
      // Only process materials
      if (item.itemType === 'material') {
        // Find corresponding inventory item
        const inventoryItem = inventoryItems.find(inv => inv.id === item.itemId);
        
        // Calculate status
        let status: 'critical' | 'warning' | 'good' | 'unknown' = 'unknown';
        if (inventoryItem) {
          const requiredQuantity = currentMultiplier * quantity;
          if (inventoryItem.stock < requiredQuantity) {
            status = 'critical';
          } else if (inventoryItem.stock < inventoryItem.threshold) {
            status = 'warning';
          } else {
            status = 'good';
          }
        }
        
        flattenedMaterials.push({
          id: item.id,
          itemId: item.itemId,
          itemName: item.itemName,
          itemType: item.itemType,
          quantity: item.quantity,
          unit: item.unit,
          path: currentPath,
          totalQuantity: currentMultiplier * quantity,
          inventory: inventoryItem,
          status
        });
      }
      
      // Process children
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          traverseBom(child, currentPath, currentMultiplier);
        }
      }
    };
    
    traverseBom(bomItem);
    setMaterialsData(flattenedMaterials);
  };
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set to asc
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filtered and sorted data
  const getFilteredAndSortedData = () => {
    let result = [...materialsData];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        item => 
          item.itemName.toLowerCase().includes(lowerSearchTerm) ||
          item.itemId.toLowerCase().includes(lowerSearchTerm) ||
          item.path.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply status filter
    if (filterStatus) {
      result = result.filter(item => item.status === filterStatus);
    }
    
    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let valueA: any;
        let valueB: any;
        
        switch (sortField) {
          case 'name':
            valueA = a.itemName.toLowerCase();
            valueB = b.itemName.toLowerCase();
            break;
          case 'id':
            valueA = a.itemId;
            valueB = b.itemId;
            break;
          case 'required':
            valueA = a.totalQuantity;
            valueB = b.totalQuantity;
            break;
          case 'available':
            valueA = a.inventory?.stock || 0;
            valueB = b.inventory?.stock || 0;
            break;
          case 'status':
            const statusOrder = { 'critical': 0, 'warning': 1, 'good': 2, 'unknown': 3 };
            valueA = statusOrder[a.status || 'unknown'];
            valueB = statusOrder[b.status || 'unknown'];
            break;
          default:
            valueA = a.itemName.toLowerCase();
            valueB = b.itemName.toLowerCase();
        }
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  };
  
  const filteredAndSortedData = getFilteredAndSortedData();
  
  // Calculate summary stats
  const summaryStats = {
    total: materialsData.length,
    critical: materialsData.filter(item => item.status === 'critical').length,
    warning: materialsData.filter(item => item.status === 'warning').length,
    good: materialsData.filter(item => item.status === 'good').length,
    unknown: materialsData.filter(item => item.status === 'unknown').length
  };
  
  // Render status badge
  const renderStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Brak materiału
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle size={12} className="mr-1" />
            Niski stan
          </span>
        );
      case 'good':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check size={12} className="mr-1" />
            Dostępny
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Info size={12} className="mr-1" />
            Nieznany
          </span>
        );
    }
  };
  
  // Get sort indicator arrow
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <span className="text-gray-500 ml-1">↑</span> 
      : <span className="text-gray-500 ml-1">↓</span>;
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow animate-pulse">
        <div className="flex items-center justify-center h-40">
          <RefreshCw className="animate-spin h-8 w-8 text-primary-500" />
          <p className="ml-2 text-gray-500">Ładowanie danych magazynowych...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
          <div className="flex items-center">
            <AlertTriangle className="mr-2" />
            <h3 className="font-medium">Wystąpił błąd podczas ładowania danych magazynowych</h3>
          </div>
          <p className="mt-2 text-sm">Sprawdź połączenie z serwerem i spróbuj ponownie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Stan magazynowy materiałów</h3>
        <p className="text-sm text-gray-500">Porównanie wymagań BOM ze stanem magazynowym</p>
      </div>
      
      {showControls && (
        <div className="p-4 bg-gray-50 border-b grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Szukaj materiału..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          
          {/* Filter by status */}
          <div>
            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="w-full py-2 px-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Wszystkie statusy</option>
              <option value="critical">Brak materiału</option>
              <option value="warning">Niski stan</option>
              <option value="good">Dostępny</option>
              <option value="unknown">Nieznany</option>
            </select>
          </div>
          
          {/* Reset filters and refresh */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus(null);
                setSortField(null);
              }}
              className="px-3 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Resetuj filtry
            </button>
            <button
              onClick={() => processBomData()}
              className="px-3 py-2 border border-primary-300 rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center"
            >
              <RefreshCw size={16} className="mr-1" />
              Odśwież
            </button>
          </div>
        </div>
      )}
      
      {/* Summary bar */}
      <div className="bg-gray-100 p-2 border-b grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-sm">
        <div className="bg-white rounded px-3 py-2 shadow-sm">
          <span className="text-gray-500">Łącznie:</span>
          <span className="ml-1 font-semibold">{summaryStats.total}</span>
        </div>
        <div className="bg-red-50 rounded px-3 py-2 shadow-sm">
          <span className="text-red-700">Brak materiału:</span>
          <span className="ml-1 font-semibold">{summaryStats.critical}</span>
        </div>
        <div className="bg-yellow-50 rounded px-3 py-2 shadow-sm">
          <span className="text-yellow-700">Niski stan:</span>
          <span className="ml-1 font-semibold">{summaryStats.warning}</span>
        </div>
        <div className="bg-green-50 rounded px-3 py-2 shadow-sm">
          <span className="text-green-700">Dostępne:</span>
          <span className="ml-1 font-semibold">{summaryStats.good}</span>
        </div>
        <div className="bg-gray-50 rounded px-3 py-2 shadow-sm">
          <span className="text-gray-500">Nieznane:</span>
          <span className="ml-1 font-semibold">{summaryStats.unknown}</span>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Nazwa materiału {getSortIndicator('name')}
                  {sortField !== 'name' && <ArrowUpDown size={14} className="ml-1 text-gray-400" />}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  ID materiału {getSortIndicator('id')}
                  {sortField !== 'id' && <ArrowUpDown size={14} className="ml-1 text-gray-400" />}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('required')}
              >
                <div className="flex items-center justify-end">
                  Wymagane {getSortIndicator('required')}
                  {sortField !== 'required' && <ArrowUpDown size={14} className="ml-1 text-gray-400" />}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('available')}
              >
                <div className="flex items-center justify-end">
                  Dostępne {getSortIndicator('available')}
                  {sortField !== 'available' && <ArrowUpDown size={14} className="ml-1 text-gray-400" />}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center justify-center">
                  Status {getSortIndicator('status')}
                  {sortField !== 'status' && <ArrowUpDown size={14} className="ml-1 text-gray-400" />}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((item) => (
                <tr 
                  key={item.id}
                  className={
                    item.status === 'critical' ? 'bg-red-50' : 
                    item.status === 'warning' ? 'bg-yellow-50' : 
                    'hover:bg-gray-50'
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.itemName}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {item.path}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.itemId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className="font-medium">{item.totalQuantity}</span> {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span 
                      className={
                        !item.inventory ? 'text-gray-400' :
                        item.inventory.stock < item.totalQuantity ? 'text-red-600 font-medium' :
                        item.inventory.stock < item.inventory.threshold ? 'text-yellow-600 font-medium' : 
                        'text-green-600 font-medium'
                      }
                    >
                      {item.inventory?.stock || 'N/A'} {item.inventory ? item.unit : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {renderStatusBadge(item.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  {searchTerm || filterStatus ? (
                    <>
                      <Search className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <p>Brak wyników dla podanych kryteriów wyszukiwania.</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setFilterStatus(null);
                        }}
                        className="mt-2 text-primary-600 hover:text-primary-800"
                      >
                        Resetuj filtry
                      </button>
                    </>
                  ) : (
                    <>
                      <Info className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <p>Brak materiałów do wyświetlenia w strukturze BOM.</p>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryStatusForBom;