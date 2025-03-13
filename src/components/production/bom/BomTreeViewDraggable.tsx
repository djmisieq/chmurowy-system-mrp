"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Package, Layers, Box, HardDrive, GripVertical, AlertCircle } from 'lucide-react';
import { BomItem } from '@/types/bom.types';

interface BomTreeViewDraggableProps {
  item: BomItem;
  level?: number;
  expandedByDefault?: boolean;
  onItemSelect?: (item: BomItem) => void;
  selectedItemId?: string;
  onDrop?: (draggedItemId: string, targetItemId: string, position: 'inside' | 'before' | 'after') => void;
}

interface DragInfo {
  itemId: string;
  level: number;
  itemType: string;
}

const BomTreeViewDraggable: React.FC<BomTreeViewDraggableProps> = ({ 
  item, 
  level = 0,
  expandedByDefault = false,
  onItemSelect,
  selectedItemId,
  onDrop
}) => {
  const [expanded, setExpanded] = useState(expandedByDefault || level === 0);
  const [dropTarget, setDropTarget] = useState<'none' | 'inside' | 'before' | 'after'>('none');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedItemId === item.id;
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Auto-expand when children are present and item is selected
  useEffect(() => {
    if (isSelected && hasChildren && !expanded) {
      setExpanded(true);
    }
  }, [isSelected, hasChildren, expanded]);
  
  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    
    const dragInfo: DragInfo = {
      itemId: item.id,
      level,
      itemType: item.itemType
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragInfo));
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a ghost image
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('bg-white', 'p-2', 'border', 'rounded', 'shadow');
    ghostElement.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">${getItemIconHtml(item.itemType)}</span>
        <span>${item.itemName}</span>
      </div>
    `;
    document.body.appendChild(ghostElement);
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    ghostElement.style.opacity = '0.8';
    
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    
    // Schedule removal of the ghost element
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOver(false);
    setDropTarget('none');
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dragOver) {
      setDragOver(true);
    }
    
    // Get drag info - for security reasons, this won't work during dragover in modern browsers
    // We'll determine valid drop areas using the dragenter event data
    try {
      // Determine drop position based on mouse position
      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        const mouseY = e.clientY;
        
        const topThird = rect.top + rect.height * 0.33;
        const bottomThird = rect.bottom - rect.height * 0.33;
        
        let newDropTarget: 'none' | 'inside' | 'before' | 'after' = 'none';
        
        if (mouseY < topThird) {
          newDropTarget = 'before';
        } else if (mouseY > bottomThird) {
          newDropTarget = 'after';
        } else {
          newDropTarget = 'inside';
        }
        
        if (dropTarget !== newDropTarget) {
          setDropTarget(newDropTarget);
        }
      }
      
      e.dataTransfer.dropEffect = 'move';
    } catch (error) {
      console.error('Error handling drag over:', error);
      setDropTarget('none');
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // During dragenter, dataTransfer is accessible
    try {
      const dragInfoStr = e.dataTransfer.getData('application/json');
      
      // If we can't get drag info, we're likely getting a dragenter from a child element
      // In this case, show the default drop target
      if (!dragInfoStr) {
        setDragOver(true);
        return;
      }
      
      const dragInfo: DragInfo = JSON.parse(dragInfoStr);
      
      // Don't allow dragging onto self
      if (dragInfo.itemId === item.id) {
        setDropTarget('none');
        setDragOver(false);
        return;
      }
      
      setDragOver(true);
    } catch (error) {
      // If error, just show default drag effect
      setDragOver(true);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're actually leaving or just entering a child element
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      
      // If the mouse is still within the node's boundaries, don't clear the drag state
      // This prevents flickering when dragging over child elements
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return;
      }
    }
    
    setDragOver(false);
    setDropTarget('none');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragOver(false);
    setDropTarget('none');
    
    try {
      const dragInfoStr = e.dataTransfer.getData('application/json');
      if (!dragInfoStr) return; // No valid data
      
      const dragInfo: DragInfo = JSON.parse(dragInfoStr);
      
      // Don't allow dragging onto self
      if (dragInfo.itemId === item.id) {
        return;
      }
      
      // Auto expand when dropping inside
      if (dropTarget === 'inside' && !expanded && hasChildren) {
        setExpanded(true);
      }
      
      // Call the onDrop handler if provided
      if (onDrop && dropTarget !== 'none') {
        onDrop(dragInfo.itemId, item.id, dropTarget as 'inside' | 'before' | 'after');
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'product':
        return <Layers className="text-blue-600" size={18} />;
      case 'assembly':
        return <Box className="text-green-600" size={18} />;
      case 'component':
        return <Package className="text-amber-600" size={18} />;
      case 'material':
        return <HardDrive className="text-gray-600" size={18} />;
      default:
        return <Package className="text-gray-600" size={18} />;
    }
  };
  
  const getItemIconHtml = (itemType: string) => {
    switch (itemType) {
      case 'product':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="9" width="10" height="6"></rect><rect x="7" y="4" width="10" height="6"></rect><rect x="7" y="14" width="10" height="6"></rect></svg>';
      case 'assembly':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>';
      case 'component':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="8" x2="8" y2="8"></line><line x1="16" y1="16" x2="8" y2="16"></line><line x1="12" y1="12" x2="12" y2="12"></line></svg>';
      case 'material':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>';
      default:
        return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="8" x2="8" y2="8"></line><line x1="16" y1="16" x2="8" y2="16"></line><line x1="12" y1="12" x2="12" y2="12"></line></svg>';
    }
  };
  
  const getItemClass = (itemType: string) => {
    switch (itemType) {
      case 'product':
        return 'font-bold text-blue-700';
      case 'assembly':
        return 'font-semibold text-green-700';
      case 'component':
        return 'font-medium text-amber-700';
      case 'material':
        return 'text-gray-700';
      default:
        return 'text-gray-700';
    }
  };

  const getDropTargetStyles = () => {
    if (!dragOver) return '';
    
    switch (dropTarget) {
      case 'before':
        return 'border-t-2 border-primary-500';
      case 'after':
        return 'border-b-2 border-primary-500';
      case 'inside':
        return 'bg-primary-50';
      default:
        return '';
    }
  };
  
  const getDragStyles = () => {
    if (isDragging) {
      return 'opacity-50 border border-dashed border-gray-400';
    }
    return '';
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onItemSelect) {
      onItemSelect(item);
    }
  };
  
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  // Animation classes for smooth transitions
  const childrenClasses = `overflow-hidden transition-all duration-200 ${
    expanded ? 'max-h-screen' : 'max-h-0'
  }`;
  
  return (
    <div className="mb-1">
      <div 
        ref={nodeRef}
        className={`flex items-center py-1 px-2 rounded hover:bg-gray-100 transition-all duration-200 ${
          level > 0 ? 'ml-6' : ''
        } ${
          isSelected ? 'bg-blue-50 border border-blue-200' : ''
        } ${getDropTargetStyles()} ${getDragStyles()} cursor-pointer`}
        style={{ paddingLeft: `${level * 8 + 8}px` }}
        onClick={handleItemClick}
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mr-1 w-5">
          {hasChildren && (
            <button
              onClick={handleToggleExpand}
              className="hover:bg-gray-200 rounded p-1 transition-colors duration-200"
              aria-label={expanded ? "Zwiń" : "Rozwiń"}
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>
        
        <div className="mr-2">
          {getItemIcon(item.itemType)}
        </div>
        
        <div className="flex-grow truncate">
          <span className={getItemClass(item.itemType)}>
            {item.itemName}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            ({item.quantity} {item.unit})
          </span>
          {item.description && (
            <span className="text-sm text-gray-400 ml-2 hidden sm:inline">
              {item.description.length > 30
                ? `${item.description.slice(0, 30)}...`
                : item.description}
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          <div className="text-xs text-gray-500 mr-2 hidden sm:block">
            ID: {item.itemId}
          </div>
          
          <div 
            className="p-1 cursor-grab text-gray-400 hover:text-gray-600 touch-manipulation"
            title="Przeciągnij, aby zmienić pozycję"
          >
            <GripVertical size={16} />
          </div>
        </div>
      </div>
      
      <div className={childrenClasses}>
        {expanded && hasChildren && (
          <div className="border-l border-gray-200 ml-3">
            {item.children!.map((child, index) => (
              <BomTreeViewDraggable 
                key={child.id || index}
                item={child}
                level={level + 1}
                expandedByDefault={level === 0}
                onItemSelect={onItemSelect}
                selectedItemId={selectedItemId}
                onDrop={onDrop}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Drop indicator overlay only shown when dragging */}
      {dragOver && dropTarget === 'inside' && (
        <div className="absolute inset-0 bg-primary-100 bg-opacity-20 pointer-events-none" />
      )}
    </div>
  );
};

export default BomTreeViewDraggable;