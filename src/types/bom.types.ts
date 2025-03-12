// Types for Bill of Materials (BOM) structures

export interface BomItem {
  id: string;
  itemId: string;
  itemName: string;
  itemType: 'product' | 'assembly' | 'component' | 'material';
  quantity: number;
  unit: string;
  description?: string;
  version?: string;
  effectiveDate?: Date;
  obsoleteDate?: Date;
  children?: BomItem[];
  level?: number; // For flattened view
  path?: string; // For tracking hierarchy
  alternativeItems?: AlternativeItem[];
  attributes?: Record<string, any>; // Custom attributes (color, size, etc.)
  files?: ProductFile[]; // Technical drawings, specs, etc.
}

// Defines a complete product structure
export interface ProductBom {
  id: string;
  name: string;
  description: string;
  productId: string;
  version: string;
  status: 'draft' | 'approved' | 'active' | 'obsolete';
  effectiveDate: Date;
  obsoleteDate?: Date;
  rootItem: BomItem;
  createdBy: string;
  createdAt: Date;
  modifiedBy?: string;
  modifiedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

// Alternative items that can be used instead of the specified item
export interface AlternativeItem {
  itemId: string;
  itemName: string;
  replacementRatio: number; // e.g. 1:1 or 2:1
  priority: number; // Lower number = higher priority
  conditions?: string; // Conditions when this alternative can be used
}

// Files associated with products/components
export interface ProductFile {
  id: string;
  name: string;
  fileType: 'drawing' | 'specification' | 'manual' | 'photo' | 'other';
  url: string;
  version?: string;
  uploadedBy?: string;
  uploadedAt?: Date;
}

// For BOM comparisons / revisions
export interface BomRevisionChange {
  changeType: 'add' | 'remove' | 'modify' | 'move';
  item: BomItem;
  previousValue?: any;
  newValue?: any;
  path?: string; // Identifies the component's location in the BOM tree
}

// For flattened view of BOM
export export interface FlatBomItem extends Omit<BomItem, 'children'> {
  parentId?: string;
  indent: number;
  totalQuantity: number; // Computed with parent multipliers
}
