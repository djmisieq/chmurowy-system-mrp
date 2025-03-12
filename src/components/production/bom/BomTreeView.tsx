"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Package, Layers, Box, HardDrive } from 'lucide-react';
import { BomItem } from '@/types/bom.types';

interface BomTreeViewProps {
  item: BomItem;
  level?: number;
  expandedByDefault?: boolean;
}

const BomTreeView: React.FC<BomTreeViewProps> = ({ 
  item, 
  level = 0,
  expandedByDefault = false
}) => {
  const [expanded, setExpanded] = useState(expandedByDefault || level === 0);
  
  const hasChildren = item.children && item.children.length > 0;
  
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
  
  return (
    <div className="mb-1">
      <div 
        className={`flex items-center py-1 px-2 rounded hover:bg-gray-100 ${level > 0 ? 'ml-6' : ''}`}
        style={{ paddingLeft: `${level * 8 + 8}px` }}
      >
        <div className="mr-1 w-5">
          {hasChildren && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="hover:bg-gray-200 rounded p-1"
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>
        
        <div className="mr-2">
          {getItemIcon(item.itemType)}
        </div>
        
        <div className="flex-grow">
          <span className={getItemClass(item.itemType)}>
            {item.itemName}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            ({item.quantity} {item.unit})
          </span>
          {item.description && (
            <span className="text-sm text-gray-400 ml-2">
              {item.description}
            </span>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          ID: {item.itemId}
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="border-l border-gray-200 ml-3">
          {item.children!.map((child, index) => (
            <BomTreeView 
              key={child.id || index}
              item={child}
              level={level + 1}
              expandedByDefault={level === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BomTreeView;