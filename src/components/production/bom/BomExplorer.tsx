"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchIcon, RefreshCw, Download, Eye, Table, FileText, Edit, Plus, Sidebar, PanelRightClose, PanelRightOpen, FilePlus } from 'lucide-react';
import BomTreeView from './BomTreeView';
import BomItemDetail from './BomItemDetail';
import BomItemAddModal from './BomItemAddModal';
import BomItemEditModal from './BomItemEditModal';
import { ProductBom, BomItem } from '@/types/bom.types';
import { useRouter } from 'next/navigation';

interface BomExplorerProps {
  initialBomId?: string;
}

const BomExplorer: React.FC<BomExplorerProps> = ({ initialBomId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [boms, setBoms] = useState<ProductBom[]>([]);
  const [selectedBomId, setSelectedBomId] = useState<string | undefined>(initialBomId);
  const [selectedBom, setSelectedBom] = useState<ProductBom | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'table' | 'details'>('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<BomItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<BomItem | null>(null);

  useEffect(() => {
    const fetchBoms = async () => {
      try {
        setLoading(true);
        // Pobieranie z mock API
        const response = await axios.get('/product-boms.json');
        const data: ProductBom[] = response.data;
        setBoms(data);
        
        // Wybierz pierwszy BOM jeśli nie ma initialBomId
        if (!initialBomId && data.length > 0) {
          setSelectedBomId(data[0].id);
        }
        
      } catch (error) {
        console.error('Błąd podczas pobierania struktur BOM:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoms();
  }, [initialBomId]);

  useEffect(() => {
    if (selectedBomId && boms.length > 0) {
      const bom = boms.find(b => b.id === selectedBomId);
      setSelectedBom(bom || null);
      setSelectedItem(null); // Reset selected item when changing BOM
    } else {
      setSelectedBom(null);
      setSelectedItem(null);
    }
  }, [selectedBomId, boms]);

  const handleRefresh = () => {
    // Re-fetch data
    const fetchBoms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/product-boms.json');
        setBoms(response.data);
      } catch (error) {
        console.error('Błąd podczas odświeżania struktur BOM:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoms();
  };

  const handleExport = () => {
    if (!selectedBom) return;
    
    const dataStr = JSON.stringify(selectedBom, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bom-${selectedBom.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleCreateNew = () => {
    router.push('/production/bom/new');
  };

  const handleEdit = () => {
    if (selectedBomId) {
      router.push(`/production/bom/edit/${selectedBomId}`);
    }
  };

  const handleItemSelect = (item: BomItem) => {
    setSelectedItem(item);
    
    // Automatically show sidebar when item is selected
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const handleEditItem = (item: BomItem) => {
    setItemToEdit(item);
    setShowEditModal(true);
  };

  const handleSaveNewItem = (newItem: Omit<BomItem, 'id'>) => {
    if (!selectedBom) return;
    
    // In a real application, we would send this to the server
    // For now, we'll just add it to the selectedBom in memory
    
    // Create a new item with a generated ID
    const itemWithId: BomItem = {
      ...newItem,
      id: `item-${Date.now()}`, // Generate a unique ID
    };
    
    // If an item is selected, add as a child to that item
    if (selectedItem) {
      // Deep clone the BOM to avoid directly mutating state
      const updatedBom = JSON.parse(JSON.stringify(selectedBom)) as ProductBom;
      
      // Function to recursively find and update the selected item
      const updateItemChildren = (items: BomItem[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === selectedItem.id) {
            // Found the selected item, add the new item as a child
            if (!items[i].children) {
              items[i].children = [];
            }
            items[i].children.push(itemWithId);
            return true;
          }
          
          // Recursively search in children
          if (items[i].children && updateItemChildren(items[i].children)) {
            return true;
          }
        }
        return false;
      };
      
      // Start the recursive search from the root item
      if (updatedBom.rootItem.id === selectedItem.id) {
        if (!updatedBom.rootItem.children) {
          updatedBom.rootItem.children = [];
        }
        updatedBom.rootItem.children.push(itemWithId);
      } else if (updatedBom.rootItem.children) {
        updateItemChildren(updatedBom.rootItem.children);
      }
      
      // Update the BOM in state
      setSelectedBom(updatedBom);
      
      // Update in the boms array
      setBoms(prevBoms => prevBoms.map(bom => 
        bom.id === updatedBom.id ? updatedBom : bom
      ));
    } else {
      // If no item is selected, add to root item's children
      const updatedBom = JSON.parse(JSON.stringify(selectedBom)) as ProductBom;
      
      if (!updatedBom.rootItem.children) {
        updatedBom.rootItem.children = [];
      }
      updatedBom.rootItem.children.push(itemWithId);
      
      setSelectedBom(updatedBom);
      
      // Update in the boms array
      setBoms(prevBoms => prevBoms.map(bom => 
        bom.id === updatedBom.id ? updatedBom : bom
      ));
    }
  };

  const handleSaveEditedItem = (editedItem: BomItem) => {
    if (!selectedBom || !itemToEdit) return;
    
    // Deep clone the BOM to avoid directly mutating state
    const updatedBom = JSON.parse(JSON.stringify(selectedBom)) as ProductBom;
    
    // Function to recursively find and update the item
    const updateItem = (items: BomItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === editedItem.id) {
          // Found the item, update it (preserve children)
          const children = items[i].children;
          items[i] = { ...editedItem };
          if (children) {
            items[i].children = children;
          }
          return true;
        }
        
        // Recursively search in children
        if (items[i].children && updateItem(items[i].children)) {
          return true;
        }
      }
      return false;
    };
    
    // Check if it's the root item
    if (updatedBom.rootItem.id === editedItem.id) {
      const children = updatedBom.rootItem.children;
      updatedBom.rootItem = { ...editedItem };
      if (children) {
        updatedBom.rootItem.children = children;
      }
    } else if (updatedBom.rootItem.children) {
      updateItem(updatedBom.rootItem.children);
    }
    
    // Update the BOM in state
    setSelectedBom(updatedBom);
    
    // If the edited item is the currently selected item, update it
    if (selectedItem && selectedItem.id === editedItem.id) {
      setSelectedItem(editedItem);
    }
    
    // Update in the boms array
    setBoms(prevBoms => prevBoms.map(bom => 
      bom.id === updatedBom.id ? updatedBom : bom
    ));
    
    // Close the edit modal
    setShowEditModal(false);
    setItemToEdit(null);
  };

  const handleDeleteItem = (itemToDelete: BomItem) => {
    if (!selectedBom) return;
    
    // Deep clone the BOM to avoid directly mutating state
    const updatedBom = JSON.parse(JSON.stringify(selectedBom)) as ProductBom;
    
    // Function to recursively find and remove the item
    const removeItem = (items: BomItem[]): BomItem[] => {
      return items.filter(item => {
        if (item.id === itemToDelete.id) {
          return false; // Remove this item
        }
        
        // If this item has children, recursively filter them
        if (item.children && item.children.length > 0) {
          item.children = removeItem(item.children);
        }
        
        return true;
      });
    };
    
    // Check if it's the root item (can't delete root)
    if (updatedBom.rootItem.id === itemToDelete.id) {
      alert('Nie można usunąć głównego elementu struktury BOM.');
      return;
    }
    
    // Process children of root
    if (updatedBom.rootItem.children) {
      updatedBom.rootItem.children = removeItem(updatedBom.rootItem.children);
    }
    
    // Update the BOM in state
    setSelectedBom(updatedBom);
    
    // If the deleted item is the currently selected item, deselect it
    if (selectedItem && selectedItem.id === itemToDelete.id) {
      setSelectedItem(null);
    }
    
    // Update in the boms array
    setBoms(prevBoms => prevBoms.map(bom => 
      bom.id === updatedBom.id ? updatedBom : bom
    ));
    
    // Close the edit modal
    setShowEditModal(false);
    setItemToEdit(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin h-10 w-10 text-primary-500" />
        </div>
      );
    }
    
    if (!selectedBom) {
      return (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Wybierz strukturę BOM z listy
        </div>
      );
    }
    
    switch (viewMode) {
      case 'tree':
        return (
          <div className="p-4">
            <div className="flex justify-end mb-3">
              <button
                onClick={handleAddItem}
                className="px-3 py-1 flex items-center text-sm bg-primary-50 hover:bg-primary-100 text-primary-700 rounded border border-primary-200"
                disabled={!selectedBom}
                title="Dodaj nowy element do BOM"
              >
                <FilePlus size={16} className="mr-1" />
                Dodaj element
              </button>
            </div>
            <BomTreeView 
              item={selectedBom.rootItem} 
              expandedByDefault={true} 
              onItemSelect={handleItemSelect}
              selectedItemId={selectedItem?.id}
            />
          </div>
        );
      case 'table':
        return (
          <div className="p-4">
            <p className="text-gray-500 italic">Widok tabelaryczny zostanie dodany w przyszłej wersji.</p>
          </div>
        );
      case 'details':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Szczegóły struktury BOM</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p>{selectedBom.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nazwa</p>
                <p>{selectedBom.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Wersja</p>
                <p>{selectedBom.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`${selectedBom.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                  {selectedBom.status === 'active' ? 'Aktywny' : 
                   selectedBom.status === 'draft' ? 'Wersja robocza' : 
                   selectedBom.status === 'obsolete' ? 'Wycofany' : 
                   selectedBom.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data utworzenia</p>
                <p>{new Date(selectedBom.createdAt).toLocaleDateString('pl-PL')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Utworzony przez</p>
                <p>{selectedBom.createdBy}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Opis</p>
                <p>{selectedBom.description}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Struktura produktów (BOM)</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCreateNew}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
            title="Nowa struktura BOM"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedBom}
            title="Edytuj strukturę BOM"
          >
            <Edit size={20} />
          </button>
          <button 
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
            title="Odśwież"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={handleExport}
            disabled={!selectedBom}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eksportuj do JSON"
          >
            <Download size={20} />
          </button>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded ml-2"
            title={showSidebar ? "Ukryj panel szczegółów" : "Pokaż panel szczegółów"}
          >
            {showSidebar ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4">
        {/* Sidebar with BOM list */}
        <div className="col-span-1 border-r min-h-[600px]">
          <div className="p-3 border-b">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Szukaj..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[550px]">
            {boms.filter(bom => 
              bom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              bom.id.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(bom => (
              <div 
                key={bom.id}
                onClick={() => setSelectedBomId(bom.id)}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedBomId === bom.id ? 'bg-primary-50' : ''}`}
              >
                <div className="font-medium">{bom.name}</div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>ID: {bom.id}</span>
                  <span>v{bom.version}</span>
                </div>
              </div>
            ))}
            
            {boms.length === 0 && !loading && (
              <div className="p-4 text-center text-gray-500">
                Brak struktur BOM
              </div>
            )}
          </div>
        </div>
        
        {/* Main content area with optional sidebar */}
        <div className={`${showSidebar ? 'col-span-2' : 'col-span-3'}`}>
          {/* View mode selector */}
          <div className="flex border-b">
            <button 
              onClick={() => setViewMode('tree')}
              className={`flex items-center px-4 py-2 border-r ${viewMode === 'tree' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
            >
              <Eye size={16} className="mr-2" />
              Drzewo
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`flex items-center px-4 py-2 border-r ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
            >
              <Table size={16} className="mr-2" />
              Tabela
            </button>
            <button 
              onClick={() => setViewMode('details')}
              className={`flex items-center px-4 py-2 ${viewMode === 'details' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
            >
              <FileText size={16} className="mr-2" />
              Szczegóły
            </button>
          </div>
          
          {/* Content area */}
          {renderContent()}
        </div>
        
        {/* Details sidebar */}
        {showSidebar && (
          <div className="col-span-1 border-l min-h-[600px] overflow-y-auto">
            <BomItemDetail 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)} 
              onEdit={handleEditItem}
            />
          </div>
        )}
      </div>

      {/* Add item modal */}
      <BomItemAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNewItem}
        parentItem={selectedItem}
      />

      {/* Edit item modal */}
      <BomItemEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setItemToEdit(null);
        }}
        onSave={handleSaveEditedItem}
        onDelete={handleDeleteItem}
        item={itemToEdit}
      />
    </div>
  );
};

export default BomExplorer;