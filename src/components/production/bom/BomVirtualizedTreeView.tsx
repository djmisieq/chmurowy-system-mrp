"use client";

import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Grip } from 'lucide-react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { cn } from '@/lib/utils';

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

// Struktura elementu spłaszczonego drzewa używanego do wirtualizacji
interface FlattenedItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  parentId: string | null;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isVisible: boolean;
  originalIndex: number; // Indeks w oryginalnej strukturze (dla zarządzania dragdrop)
}

interface BomVirtualizedTreeViewProps {
  items: BomItemType[];
  onItemSelected: (item: BomItemType | null) => void;
  onItemsReordered: (newItems: BomItemType[]) => void;
  isValidDropTarget?: (sourceId: string, targetId: string) => boolean;
  height?: number;
}

/**
 * Komponent renderujący wirtualizowane drzewo BOM
 * Obsługuje bardzo duże struktury BOM bez utraty wydajności
 */
const BomVirtualizedTreeView: React.FC<BomVirtualizedTreeViewProps> = ({
  items,
  onItemSelected,
  onItemsReordered,
  isValidDropTarget = () => true,
  height = 600
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  
  // Referencje do listy wirtualizowanej
  const listRef = useRef<FixedSizeList>(null);
  
  /**
   * Spłaszcza hierarchiczną strukturę elementów BOM do jednowymiarowej tablicy
   * używanej przez komponent wirtualizacji
   */
  const flattenedItems = useMemo(() => {
    const result: FlattenedItem[] = [];
    
    const flatten = (items: BomItemType[], depth: number = 0, isParentVisible: boolean = true) => {
      items.forEach((item, index) => {
        const isExpanded = expandedItems.has(item.id);
        const isVisible = isParentVisible;
        
        if (isVisible) {
          result.push({
            id: item.id,
            name: item.name,
            type: item.type,
            quantity: item.quantity,
            unit: item.unit,
            parentId: item.parentId,
            depth,
            hasChildren: Boolean(item.children && item.children.length > 0),
            isExpanded,
            isVisible,
            originalIndex: index
          });
        }
        
        if (item.children && item.children.length > 0 && isExpanded) {
          flatten(item.children, depth + 1, isVisible);
        }
      });
    };
    
    flatten(items);
    return result;
  }, [items, expandedItems]);
  
  // Tylko widoczne elementy są renderowane
  const visibleItems = useMemo(() => {
    return flattenedItems.filter(item => item.isVisible);
  }, [flattenedItems]);
  
  /**
   * Przełącza stan rozwinięcia/zwinięcia elementu
   */
  const handleToggle = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    
    // Przewiń do elementu, jeśli staje się widoczny
    setTimeout(() => {
      listRef.current?.scrollToItem(
        visibleItems.findIndex(item => item.id === id),
        "smart"
      );
    }, 0);
  }, [visibleItems]);
  
  /**
   * Obsługa wyboru elementu
   */
  const handleSelect = useCallback((id: string) => {
    setSelectedItem(id);
    
    // Znajdź oryginalny element, aby przekazać go do callbacka
    const findOriginalItem = (items: BomItemType[], id: string): BomItemType | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findOriginalItem(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const originalItem = findOriginalItem(items, id);
    if (originalItem) {
      onItemSelected(originalItem);
    }
  }, [items, onItemSelected]);
  
  /**
   * Obsługa rozpoczęcia drag and drop
   */
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    
    // Ustawienie danych dla operacji drag
    e.dataTransfer.setData('application/json', JSON.stringify({ id }));
    e.dataTransfer.effectAllowed = 'move';
    
    // Wskazanie elementu przeciąganego
    setDraggedItemId(id);
  }, []);
  
  /**
   * Obsługa przeciągania nad potencjalnym miejscem upuszczenia
   */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Nie pozwalaj na upuszczenie na samego siebie
    if (draggedItemId === id) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    // Sprawdź, czy cel upuszczenia jest prawidłowy
    if (draggedItemId && isValidDropTarget(draggedItemId, id)) {
      e.dataTransfer.dropEffect = 'move';
      setDragOverItemId(id);
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  }, [draggedItemId, isValidDropTarget]);
  
  /**
   * Obsługa opuszczenia obszaru potencjalnego upuszczenia
   */
  const handleDragLeave = useCallback(() => {
    setDragOverItemId(null);
  }, []);
  
  /**
   * Obsługa upuszczenia elementu
   */
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverItemId(null);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const sourceId = data.id;
      
      if (sourceId === targetId) return;
      
      if (isValidDropTarget(sourceId, targetId)) {
        // Funkcja do znajdowania i modyfikacji elementu w strukturze
        const moveItemInTree = (
          items: BomItemType[],
          sourceId: string,
          targetId: string
        ): [BomItemType[], BomItemType | null] => {
          let sourceItem: BomItemType | null = null;
          
          // Funkcja do usuwania elementu z jego obecnej lokalizacji
          const removeSourceItem = (items: BomItemType[], itemId: string): [BomItemType[], BomItemType | null] => {
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === itemId) {
                // Znaleźliśmy element do usunięcia
                sourceItem = JSON.parse(JSON.stringify(items[i]));
                items.splice(i, 1);
                return [items, sourceItem];
              }
              
              // Rekurencyjne szukanie w dzieciach
              if (items[i].children && items[i].children.length > 0) {
                const [newChildren, found] = removeSourceItem(items[i].children, itemId);
                if (found) {
                  items[i].children = newChildren;
                  return [items, found];
                }
              }
            }
            return [items, null];
          };
          
          // Funkcja do dodawania elementu do nowej lokalizacji
          const addSourceItem = (items: BomItemType[], targetId: string, itemToAdd: BomItemType): boolean => {
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === targetId) {
                // Znaleźliśmy cel, dodajemy element jako dziecko
                if (!items[i].children) {
                  items[i].children = [];
                }
                // Aktualizujemy parentId
                itemToAdd.parentId = targetId;
                items[i].children.push(itemToAdd);
                return true;
              }
              
              // Rekurencyjne szukanie w dzieciach
              if (items[i].children && items[i].children.length > 0) {
                if (addSourceItem(items[i].children, targetId, itemToAdd)) {
                  return true;
                }
              }
            }
            return false;
          };
          
          // Kopia struktury BOM
          const newItems = JSON.parse(JSON.stringify(items));
          
          // Usuń element źródłowy
          const [itemsWithoutSource, removedItem] = removeSourceItem(newItems, sourceId);
          
          if (removedItem) {
            // Dodaj element źródłowy do celu
            addSourceItem(itemsWithoutSource, targetId, removedItem);
            
            // Automatycznie rozwiń element docelowy
            setExpandedItems(prev => {
              const newSet = new Set(prev);
              newSet.add(targetId);
              return newSet;
            });
          }
          
          return [itemsWithoutSource, removedItem];
        };
        
        // Wykonaj operację przeniesienia
        const [newItems, _] = moveItemInTree(items, sourceId, targetId);
        if (newItems) {
          onItemsReordered(newItems);
        }
      }
    } catch (error) {
      console.error('Błąd podczas operacji drag & drop:', error);
    } finally {
      setDraggedItemId(null);
    }
  }, [draggedItemId, isValidDropTarget, items, onItemsReordered]);
  
  /**
   * Obsługa końca operacji drag
   */
  const handleDragEnd = useCallback(() => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  }, []);
  
  /**
   * Renderowanie pojedynczego elementu listy
   */
  const Row = useCallback(({ index, style }: ListChildComponentProps) => {
    const item = visibleItems[index];
    if (!item) return null;
    
    const isSelected = item.id === selectedItem;
    const isDragged = item.id === draggedItemId;
    const isDragOver = item.id === dragOverItemId;
    
    const rowStyle = cn(
      'flex items-center py-1 px-2 cursor-pointer rounded-md transition-colors',
      {
        'bg-primary-50': isSelected,
        'opacity-50': isDragged,
        'border-primary-500 border-2': isDragOver && isValidDropTarget(draggedItemId!, item.id),
        'border-red-300 border-2': isDragOver && !isValidDropTarget(draggedItemId!, item.id),
        'hover:bg-gray-100': !isDragged
      }
    );
    
    return (
      <div style={style} className="px-1">
        <div
          className={rowStyle}
          style={{ paddingLeft: `${item.depth * 16 + 8}px` }}
          onClick={() => handleSelect(item.id)}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="mr-1">
            <Grip className="h-4 w-4 text-gray-400 cursor-grab" />
          </div>
          
          <div 
            className="mr-1" 
            onClick={(e) => {
              e.stopPropagation();
              if (item.hasChildren) {
                handleToggle(item.id);
              }
            }}
          >
            {item.hasChildren ? (
              item.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <div className="w-4" />
            )}
          </div>
          
          <div className="flex items-center">
            <span className="font-medium">{item.name}</span>
            <span className="ml-2 text-gray-500 text-sm">
              {item.quantity} {item.unit}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              ({item.type})
            </span>
          </div>
        </div>
      </div>
    );
  }, [visibleItems, selectedItem, draggedItemId, dragOverItemId, handleDragEnd, handleDragLeave, handleDragOver, handleDragStart, handleDrop, handleSelect, handleToggle, isValidDropTarget]);
  
  return (
    <div className="p-2 border rounded-lg bg-white" style={{ height }}>
      <div className="font-medium mb-2">Struktura BOM (wirtualizowana)</div>
      <div style={{ height: height - 50 }}>
        <AutoSizer>
          {({ width, height }) => (
            <FixedSizeList
              ref={listRef}
              width={width}
              height={height}
              itemCount={visibleItems.length}
              itemSize={40}
              overscanCount={10}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default React.memo(BomVirtualizedTreeView);
