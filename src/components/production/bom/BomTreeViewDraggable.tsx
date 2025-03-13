"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Grip, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Typy dla drag and drop operacji
interface DragItem {
  id: string;
  type: string;
  parentId: string | null;
  index: number;
  depth: number;
}

interface DropResult {
  dropEffect: string;
  didDrop: boolean;
}

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

interface TreeNodeProps {
  item: BomItemType;
  depth: number;
  index: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  parentId: string | null;
  onDragStart: (item: DragItem) => void;
  onDrop: (targetId: string, item: DragItem) => void;
  isValidDropTarget: (sourceId: string, targetId: string) => boolean;
  draggedItemId: string | null;
}

// Komponent pojedynczego węzła drzewa
const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  depth,
  index,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  parentId,
  onDragStart,
  onDrop,
  isValidDropTarget,
  draggedItemId
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDroppable, setIsDroppable] = useState(false);
  
  // Efekt sprawdzający czy aktualny węzeł jest prawidłowym celem upuszczenia
  useEffect(() => {
    if (draggedItemId && draggedItemId !== item.id) {
      setIsDroppable(isValidDropTarget(draggedItemId, item.id));
    } else {
      setIsDroppable(false);
    }
  }, [draggedItemId, item.id, isValidDropTarget]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    // Ustawienie obrazu przeciąganego elementu (ghost image)
    if (nodeRef.current) {
      const ghostElement = nodeRef.current.cloneNode(true) as HTMLDivElement;
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '-1000px';
      ghostElement.style.opacity = '0.5';
      document.body.appendChild(ghostElement);
      e.dataTransfer.setDragImage(ghostElement, 0, 0);
      setTimeout(() => {
        document.body.removeChild(ghostElement);
      }, 0);
    }
    
    e.dataTransfer.effectAllowed = 'move';
    
    // Zapisanie danych o przeciąganym elemencie
    const dragItem: DragItem = {
      id: item.id,
      type: item.type,
      parentId,
      index,
      depth
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragItem));
    onDragStart(dragItem);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Zmiana wizualna gdy element jest nad potencjalnym celem upuszczenia
    if (isDroppable && !isDragOver) {
      setIsDragOver(true);
      e.dataTransfer.dropEffect = 'move';
    } else if (!isDroppable && isDragOver) {
      setIsDragOver(false);
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json')) as DragItem;
      if (isDroppable) {
        onDrop(item.id, data);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const hasChildren = item.children && item.children.length > 0;
  
  // Określenie stylu w zależności od stanu
  const nodeStyle = cn(
    'flex items-center py-1 px-2 cursor-pointer rounded-md transition-colors',
    {
      'bg-primary-50': isSelected,
      'border-primary-500 border-2': isDragOver && isDroppable,
      'border-red-300 border-2': isDragOver && !isDroppable,
      'opacity-50': draggedItemId === item.id,
      'hover:bg-gray-100': draggedItemId !== item.id
    }
  );

  return (
    <div className="select-none">
      <div
        ref={nodeRef}
        className={nodeStyle}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => onSelect(item.id)}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mr-1">
          <Grip className="h-4 w-4 text-gray-400 cursor-grab" />
        </div>
        
        <div className="mr-1" onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}>
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="w-4" />
          )}
        </div>
        
        <div className="flex items-center">
          {/* Ikona typu komponentu */}
          <span className="font-medium">{item.name}</span>
          <span className="ml-2 text-gray-500 text-sm">
            {item.quantity} {item.unit}
          </span>
          
          {/* Wskaźniki walidacji */}
          {isDragOver && !isDroppable && (
            <AlertCircle className="ml-2 h-4 w-4 text-red-500" title="Nieprawidłowy cel" />
          )}
        </div>
      </div>
      
      {/* Renderowanie dzieci jeśli węzeł jest rozwinięty */}
      {isExpanded && hasChildren && (
        <div className="ml-2">
          {item.children?.map((child, childIndex) => (
            <TreeNode
              key={child.id}
              item={child}
              depth={depth + 1}
              index={childIndex}
              isExpanded={isExpanded}
              isSelected={false}
              onToggle={onToggle}
              onSelect={onSelect}
              parentId={item.id}
              onDragStart={onDragStart}
              onDrop={onDrop}
              isValidDropTarget={isValidDropTarget}
              draggedItemId={draggedItemId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface BomTreeViewDraggableProps {
  items: BomItemType[];
  onItemSelected: (item: BomItemType | null) => void;
  onItemsReordered: (newItems: BomItemType[]) => void;
}

// Główny komponent drzewa BOM z funkcjonalnością drag-and-drop
const BomTreeViewDraggable: React.FC<BomTreeViewDraggableProps> = ({
  items,
  onItemSelected,
  onItemsReordered
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  
  // Pomocnicza funkcja do znajdowania elementu po ID
  const findItemById = (id: string, itemsList: BomItemType[]): BomItemType | null => {
    for (const item of itemsList) {
      if (item.id === id) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const found = findItemById(id, item.children);
        if (found) return found;
      }
    }
    return null;
  };
  
  // Sprawdzenie czy przeciągnięcie jest prawidłowe
  const isValidDrop = (sourceId: string, targetId: string): boolean => {
    // Nie można upuścić elementu na samego siebie
    if (sourceId === targetId) return false;
    
    const source = findItemById(sourceId, items);
    const target = findItemById(targetId, items);
    
    if (!source || !target) return false;
    
    // Sprawdzenie czy target nie jest dzieckiem source (unikamy cykli)
    const isTargetChildOfSource = (parent: BomItemType, childId: string): boolean => {
      if (!parent.children) return false;
      
      for (const child of parent.children) {
        if (child.id === childId) return true;
        if (child.children && isTargetChildOfSource(child, childId)) return true;
      }
      
      return false;
    };
    
    return !isTargetChildOfSource(source, targetId);
  };

  const handleToggle = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelect = (id: string) => {
    setSelectedItem(id);
    const item = findItemById(id, items);
    if (item) {
      onItemSelected(item);
    }
  };

  const handleDragStart = (item: DragItem) => {
    setDraggedItem(item);
  };

  // Rekursywna funkcja do aktualizacji struktury BOM po upuszczeniu
  const moveItem = (
    items: BomItemType[],
    sourceId: string,
    targetId: string
  ): BomItemType[] => {
    // Znajdź element źródłowy i jego indeks
    let sourceItem: BomItemType | null = null;
    let sourcePath: number[] = [];
    
    const findSourcePath = (
      items: BomItemType[],
      id: string,
      path: number[] = []
    ): boolean => {
      for (let i = 0; i < items.length; i++) {
        const currentPath = [...path, i];
        if (items[i].id === id) {
          sourceItem = { ...items[i] };
          sourcePath = currentPath;
          return true;
        }
        if (items[i].children && items[i].children.length > 0) {
          if (findSourcePath(items[i].children, id, currentPath)) {
            return true;
          }
        }
      }
      return false;
    };
    
    findSourcePath(items, sourceId);
    
    if (!sourceItem) return [...items];
    
    // Skopiuj strukturę BOM, aby ją zmodyfikować
    const newItems = JSON.parse(JSON.stringify(items)) as BomItemType[];
    
    // Usuń element źródłowy z jego obecnej lokalizacji
    const removeSourceItem = (
      items: BomItemType[],
      path: number[]
    ): BomItemType[] => {
      if (path.length === 1) {
        return [
          ...items.slice(0, path[0]),
          ...items.slice(path[0] + 1)
        ];
      }
      
      const index = path[0];
      const newChildren = removeSourceItem(
        items[index].children || [],
        path.slice(1)
      );
      
      return [
        ...items.slice(0, index),
        {
          ...items[index],
          children: newChildren
        },
        ...items.slice(index + 1)
      ];
    };
    
    const itemsWithoutSource = removeSourceItem(newItems, sourcePath);
    
    // Dodaj element źródłowy do nowej lokalizacji
    const addToTarget = (
      items: BomItemType[],
      targetId: string,
      sourceItem: BomItemType
    ): BomItemType[] => {
      return items.map(item => {
        if (item.id === targetId) {
          // Dodaj jako dziecko elementu docelowego
          return {
            ...item,
            children: [
              ...(item.children || []),
              {
                ...sourceItem,
                parentId: item.id
              }
            ]
          };
        }
        
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: addToTarget(item.children, targetId, sourceItem)
          };
        }
        
        return item;
      });
    };
    
    const result = addToTarget(itemsWithoutSource, targetId, sourceItem);
    return result;
  };

  const handleDrop = (targetId: string, draggedItem: DragItem) => {
    if (isValidDrop(draggedItem.id, targetId)) {
      const newItems = moveItem(items, draggedItem.id, targetId);
      onItemsReordered(newItems);
      
      // Rozwiń element docelowy, aby pokazać nowo dodane dziecko
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        newSet.add(targetId);
        return newSet;
      });
    }
    
    setDraggedItem(null);
  };

  return (
    <div className="p-2 border rounded-lg bg-white">
      <div className="font-medium mb-2">Struktura BOM</div>
      <div>
        {items.map((item, index) => (
          <TreeNode
            key={item.id}
            item={item}
            depth={0}
            index={index}
            isExpanded={expandedItems.has(item.id)}
            isSelected={selectedItem === item.id}
            onToggle={handleToggle}
            onSelect={handleSelect}
            parentId={null}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            isValidDropTarget={(sourceId, targetId) => isValidDrop(sourceId, targetId)}
            draggedItemId={draggedItem ? draggedItem.id : null}
          />
        ))}
      </div>
    </div>
  );
};

export default BomTreeViewDraggable;
