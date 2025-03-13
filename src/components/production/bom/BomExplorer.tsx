"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Plus, Save, FileDown, FileUp, AlertTriangle, 
  Undo, Redo, RefreshCw, ChevronsRight, Clipboard
} from 'lucide-react';

import BomTreeViewDraggable from './BomTreeViewDraggable';
import BomItemDetail from './BomItemDetail';
import BomItemAddModal from './BomItemAddModal';
import BomItemEditModal from './BomItemEditModal';
import BomMetadataForm from './BomMetadataForm';
import BomErrorModal from './BomErrorModal';

import { useBomDragValidation } from '@/hooks/useBomDragValidation';
import { ValidationResult } from '@/services/BomValidationService';

// Import typów i styli
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface BomItemType {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  parentId: string | null;
  children?: BomItemType[];
  [key: string]: any;
}

interface BomType {
  id: string;
  name: string;
  description: string;
  status: string;
  version: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: BomItemType[];
  [key: string]: any;
}

interface BomExplorerProps {
  bomId?: string;
  initialData?: BomType;
  isNew?: boolean;
}

/**
 * Główny komponent eksploratora BOM - pozwala na przeglądanie i edycję struktury BOM
 */
const BomExplorer: React.FC<BomExplorerProps> = ({ 
  bomId, 
  initialData, 
  isNew = false 
}) => {
  const router = useRouter();
  const [bomData, setBomData] = useState<BomType | null>(initialData || null);
  const [selectedItem, setSelectedItem] = useState<BomItemType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [parentIdForAdd, setParentIdForAdd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('structure');
  const [isSaving, setIsSaving] = useState(false);
  
  // Historia zmian dla undo/redo
  const [history, setHistory] = useState<BomType[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Stan walidacji
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [pendingDragOperation, setPendingDragOperation] = useState<{
    sourceId: string;
    targetId: string;
    sourceItem?: BomItemType;
    targetItem?: BomItemType;
  } | null>(null);
  
  // Użycie hooka do walidacji drag-and-drop
  const {
    validateDrop,
    handleDragStart,
    handleDragEnd,
    isValidDropTarget
  } = useBomDragValidation(bomData?.items || []);
  
  // Efekt inicjalizacji
  useEffect(() => {
    if (initialData) {
      setBomData(initialData);
      // Inicjalizacja historii
      setHistory([initialData]);
      setHistoryIndex(0);
    } else if (bomId && !isNew) {
      fetchBomData();
    } else if (isNew) {
      // Utworzenie pustego szablonu dla nowego BOM
      const newBom: BomType = {
        id: 'temp_' + Date.now(),
        name: 'Nowy BOM',
        description: '',
        status: 'draft',
        version: '1.0.0',
        createdBy: 'current_user', // W rzeczywistości powinno być pobrane z kontekstu auth
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: []
      };
      setBomData(newBom);
      setHistory([newBom]);
      setHistoryIndex(0);
    }
  }, [initialData, bomId, isNew]);
  
  /**
   * Pobieranie danych BOM z API
   */
  const fetchBomData = async () => {
    try {
      // Tutaj będzie prawdziwe API w przyszłości
      const response = await axios.get(`/api/boms/${bomId}`);
      setBomData(response.data);
      // Inicjalizacja historii
      setHistory([response.data]);
      setHistoryIndex(0);
    } catch (error) {
      console.error('Error fetching BOM data:', error);
      toast.error('Nie udało się pobrać danych BOM');
    }
  };
  
  /**
   * Dodanie aktualnego stanu do historii
   */
  const addToHistory = useCallback((data: BomType) => {
    // Usunięcie przyszłej historii jeśli cofnęliśmy się
    const newHistory = history.slice(0, historyIndex + 1);
    // Dodanie nowego stanu
    newHistory.push(JSON.parse(JSON.stringify(data)));
    // Aktualizacja historii z limitowaniem do 20 stanów
    setHistory(newHistory.slice(-20));
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);
  
  /**
   * Cofnięcie ostatniej zmiany
   */
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBomData(JSON.parse(JSON.stringify(history[newIndex])));
    }
  }, [history, historyIndex]);
  
  /**
   * Ponowienie cofniętej zmiany
   */
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBomData(JSON.parse(JSON.stringify(history[newIndex])));
    }
  }, [history, historyIndex]);
  
  /**
   * Obsługa zaznaczenia elementu
   */
  const handleItemSelected = (item: BomItemType | null) => {
    setSelectedItem(item);
  };
  
  /**
   * Otwarcie modalnego okna dodawania nowego elementu
   */
  const handleAddItem = (parentId: string | null = null) => {
    setParentIdForAdd(parentId);
    setIsAddModalOpen(true);
  };
  
  /**
   * Obsługa zapisania nowego elementu
   */
  const handleItemAdded = (newItem: BomItemType) => {
    if (!bomData) return;
    
    // Głęboka kopia aktualnych danych
    const newBomData = JSON.parse(JSON.stringify(bomData));
    
    if (parentIdForAdd === null) {
      // Dodanie na najwyższym poziomie
      newBomData.items.push(newItem);
    } else {
      // Dodanie jako dziecko wybranego elementu
      const addChildToParent = (items: BomItemType[], parentId: string): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === parentId) {
            // Dodaj dziecko do znalezionego rodzica
            if (!items[i].children) {
              items[i].children = [];
            }
            items[i].children.push(newItem);
            return true;
          }
          
          // Rekurencyjne przeszukiwanie dzieci
          if (items[i].children && items[i].children.length > 0) {
            if (addChildToParent(items[i].children, parentId)) {
              return true;
            }
          }
        }
        return false;
      };
      
      addChildToParent(newBomData.items, parentIdForAdd);
    }
    
    setBomData(newBomData);
    addToHistory(newBomData);
    setIsAddModalOpen(false);
    toast.success('Element dodany pomyślnie');
  };
  
  /**
   * Otwarcie modalnego okna edycji elementu
   */
  const handleEditItem = () => {
    if (selectedItem) {
      setIsEditModalOpen(true);
    }
  };
  
  /**
   * Obsługa aktualizacji elementu
   */
  const handleItemUpdated = (updatedItem: BomItemType) => {
    if (!bomData || !selectedItem) return;
    
    // Głęboka kopia aktualnych danych
    const newBomData = JSON.parse(JSON.stringify(bomData));
    
    // Funkcja do aktualizacji elementu w drzewie
    const updateItemInTree = (items: BomItemType[], itemId: string): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === itemId) {
          // Zachowaj dzieci
          const children = items[i].children;
          // Aktualizuj element
          items[i] = { ...updatedItem };
          // Przywróć dzieci
          if (children) {
            items[i].children = children;
          }
          return true;
        }
        
        // Rekurencyjne przeszukiwanie dzieci
        if (items[i].children && items[i].children.length > 0) {
          if (updateItemInTree(items[i].children, itemId)) {
            return true;
          }
        }
      }
      return false;
    };
    
    updateItemInTree(newBomData.items, selectedItem.id);
    setBomData(newBomData);
    setSelectedItem(updatedItem); // Aktualizuj również zaznaczony element
    addToHistory(newBomData);
    setIsEditModalOpen(false);
    toast.success('Element zaktualizowany pomyślnie');
  };
  
  /**
   * Obsługa usunięcia elementu
   */
  const handleItemDeleted = (itemId: string) => {
    if (!bomData) return;
    
    // Głęboka kopia aktualnych danych
    const newBomData = JSON.parse(JSON.stringify(bomData));
    
    // Funkcja do usuwania elementu z drzewa
    const removeItemFromTree = (items: BomItemType[], itemId: string): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === itemId) {
          // Usuń element
          items.splice(i, 1);
          return true;
        }
        
        // Rekurencyjne przeszukiwanie dzieci
        if (items[i].children && items[i].children.length > 0) {
          if (removeItemFromTree(items[i].children, itemId)) {
            return true;
          }
        }
      }
      return false;
    };
    
    removeItemFromTree(newBomData.items, itemId);
    setBomData(newBomData);
    setSelectedItem(null); // Wyczyść zaznaczenie
    addToHistory(newBomData);
    setIsEditModalOpen(false);
    toast.success('Element usunięty pomyślnie');
  };
  
  /**
   * Obsługa zmian w metadanych BOM
   */
  const handleMetadataChange = (updatedMetadata: Partial<BomType>) => {
    if (!bomData) return;
    
    const newBomData = {
      ...bomData,
      ...updatedMetadata,
      updatedAt: new Date().toISOString()
    };
    
    setBomData(newBomData);
    addToHistory(newBomData);
    toast.success('Metadane zaktualizowane pomyślnie');
  };
  
  /**
   * Obsługa zapisywania BOM
   */
  const handleSave = async () => {
    if (!bomData) return;
    
    setIsSaving(true);
    try {
      // W przyszłości to będzie prawdziwe API
      if (isNew) {
        // Tworzenie nowego BOM
        await axios.post('/api/boms', bomData);
        toast.success('BOM został utworzony pomyślnie');
        // Przekierowanie do widoku BOM
        router.push(`/production/bom/${bomData.id}`);
      } else {
        // Aktualizacja istniejącego BOM
        await axios.put(`/api/boms/${bomId}`, bomData);
        toast.success('BOM został zapisany pomyślnie');
      }
    } catch (error) {
      console.error('Error saving BOM:', error);
      toast.error('Nie udało się zapisać BOM');
    } finally {
      setIsSaving(false);
    }
  };
  
  /**
   * Obsługa przeorganizowania struktury BOM przez drag-and-drop
   */
  const handleItemsReordered = (newItems: BomItemType[]) => {
    if (!bomData) return;
    
    const newBomData = {
      ...bomData,
      items: newItems,
      updatedAt: new Date().toISOString()
    };
    
    setBomData(newBomData);
    addToHistory(newBomData);
    toast.success('Struktura BOM zaktualizowana pomyślnie');
  };
  
  /**
   * Funkcja do obsługi walidacji drag-and-drop z wyświetlaniem modalu
   */
  const handleValidatedDrop = (sourceId: string, targetId: string) => {
    // Znajdź elementy źródłowy i docelowy dla lepszych komunikatów błędów
    const findItem = (id: string, items: BomItemType[]): BomItemType | undefined => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children?.length) {
          const found = findItem(id, item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    const sourceItem = bomData?.items ? findItem(sourceId, bomData.items) : undefined;
    const targetItem = bomData?.items ? findItem(targetId, bomData.items) : undefined;
    
    // Przeprowadź pełną walidację
    const result = validateDrop(sourceId, targetId);
    
    if (!result.isValid || result.warnings.length > 0) {
      // Zapisz informacje o oczekującej operacji
      setPendingDragOperation({
        sourceId,
        targetId,
        sourceItem,
        targetItem
      });
      
      setValidationResult(result);
      setValidationModalOpen(true);
      return false;
    }
    
    return true;
  };
  
  /**
   * Wykonanie oczekującej operacji drag-and-drop po zatwierdzeniu ostrzeżeń
   */
  const executePendingDragOperation = () => {
    if (!pendingDragOperation || !bomData) return;
    
    // Implementacja przeniesienia elementu
    const { sourceId, targetId } = pendingDragOperation;
    
    // Funkcja do przenoszenia elementu w drzewie
    const moveItemInTree = (items: BomItemType[]): [BomItemType[], BomItemType | null] => {
      let sourceItem: BomItemType | null = null;
      
      // Funkcja do usuwania elementu z jego obecnej lokalizacji
      const removeItem = (items: BomItemType[], itemId: string): [BomItemType[], BomItemType | null] => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === itemId) {
            sourceItem = JSON.parse(JSON.stringify(items[i]));
            items.splice(i, 1);
            return [items, sourceItem];
          }
          
          if (items[i].children && items[i].children.length > 0) {
            const [newChildren, found] = removeItem(items[i].children, itemId);
            if (found) {
              items[i].children = newChildren;
              return [items, found];
            }
          }
        }
        return [items, null];
      };
      
      // Funkcja do dodawania elementu do nowej lokalizacji
      const addItem = (items: BomItemType[], targetId: string, item: BomItemType): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === targetId) {
            if (!items[i].children) {
              items[i].children = [];
            }
            
            // Aktualizuj parentId
            item.parentId = targetId;
            items[i].children.push(item);
            return true;
          }
          
          if (items[i].children && items[i].children.length > 0) {
            if (addItem(items[i].children, targetId, item)) {
              return true;
            }
          }
        }
        return false;
      };
      
      // Usuń element źródłowy
      const [itemsWithoutSource, removedItem] = removeItem(JSON.parse(JSON.stringify(items)), sourceId);
      
      // Jeśli znaleziono element źródłowy, dodaj go do celu
      if (removedItem) {
        addItem(itemsWithoutSource, targetId, removedItem);
      }
      
      return [itemsWithoutSource, removedItem];
    };
    
    const [newItems, _] = moveItemInTree(bomData.items);
    
    const newBomData = {
      ...bomData,
      items: newItems,
      updatedAt: new Date().toISOString()
    };
    
    setBomData(newBomData);
    addToHistory(newBomData);
    setValidationModalOpen(false);
    setPendingDragOperation(null);
    toast.success('Struktura BOM zaktualizowana pomyślnie');
  };
  
  // Renderowanie komponentu
  return (
    <div className="h-full flex flex-col">
      {/* Pasek narzędzi */}
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleUndo} 
            disabled={historyIndex <= 0}
            title="Cofnij"
          >
            <Undo className="h-4 w-4 mr-1" />
            <span className="sr-only">Cofnij</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRedo} 
            disabled={historyIndex >= history.length - 1}
            title="Ponów"
          >
            <Redo className="h-4 w-4 mr-1" />
            <span className="sr-only">Ponów</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleAddItem(null)}
            title="Dodaj element główny"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Dodaj</span>
          </Button>
          {selectedItem && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEditItem}
                title="Edytuj wybrany element"
              >
                <ChevronsRight className="h-4 w-4 mr-1" />
                <span>Edytuj</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleAddItem(selectedItem.id)}
                title="Dodaj element podrzędny"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Dodaj podrzędny</span>
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {/* Eksport do pliku */}}
            title="Eksportuj BOM"
          >
            <FileDown className="h-4 w-4 mr-1" />
            <span>Eksportuj</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {/* Import z pliku */}}
            title="Importuj BOM"
          >
            <FileUp className="h-4 w-4 mr-1" />
            <span>Importuj</span>
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
            title="Zapisz BOM"
          >
            <Save className="h-4 w-4 mr-1" />
            <span>{isSaving ? 'Zapisywanie...' : 'Zapisz'}</span>
          </Button>
        </div>
      </div>
      
      {/* Główny obszar roboczy */}
      <div className="flex-grow overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="px-4 py-2 border-b">
            <TabsTrigger value="structure">Struktura</TabsTrigger>
            <TabsTrigger value="metadata">Metadane</TabsTrigger>
          </TabsList>
          <TabsContent value="structure" className="h-full">
            <div className="h-full flex flex-col md:flex-row overflow-hidden">
              {/* Drzewo BOM z drag-and-drop */}
              <div className="w-full md:w-1/2 p-4 overflow-auto border-r">
                {bomData && (
                  <BomTreeViewDraggable 
                    items={bomData.items}
                    onItemSelected={handleItemSelected}
                    onItemsReordered={handleItemsReordered}
                  />
                )}
              </div>
              
              {/* Panel szczegółów */}
              <div className="w-full md:w-1/2 p-4 overflow-auto">
                {selectedItem ? (
                  <BomItemDetail 
                    item={selectedItem}
                    onEdit={handleEditItem}
                    onAddChild={() => handleAddItem(selectedItem.id)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Clipboard className="h-12 w-12 mb-2" />
                    <p>Wybierz element z drzewa BOM, aby zobaczyć szczegóły</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="metadata" className="p-4">
            {bomData && (
              <BomMetadataForm 
                metadata={bomData}
                onChange={handleMetadataChange}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modalne okna */}
      {isAddModalOpen && (
        <BomItemAddModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          parentId={parentIdForAdd}
          onItemAdded={handleItemAdded}
        />
      )}
      
      {isEditModalOpen && selectedItem && (
        <BomItemEditModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          item={selectedItem}
          onItemUpdated={handleItemUpdated}
          onItemDeleted={handleItemDeleted}
        />
      )}
      
      {/* Modal błędów walidacji */}
      <BomErrorModal 
        isOpen={validationModalOpen}
        onClose={() => {
          setValidationModalOpen(false);
          setPendingDragOperation(null);
        }}
        validationResult={validationResult}
        sourceItem={pendingDragOperation?.sourceItem}
        targetItem={pendingDragOperation?.targetItem}
      />
    </div>
  );
};

export default BomExplorer;
