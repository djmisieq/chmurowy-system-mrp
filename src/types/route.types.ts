// Types for manufacturing routes (process flows)

export interface RouteOperation {
  id: string;
  name: string;
  description: string;
  workCenter: string;
  workCenterName?: string;
  setupTime: number; // minutes
  processingTime: number; // minutes per unit
  waitTime?: number; // minutes
  moveTime?: number; // minutes
  laborSkill?: string;
  laborCount?: number;
  instructions?: string;
  tools?: OperationTool[];
  predecessors?: string[]; // IDs of operations that must be completed before this
  subOperations?: RouteOperation[]; // For hierarchical operations
  status?: 'pending' | 'in-progress' | 'completed';
  level?: number; // For flattened view
  resourceRequirements?: ResourceRequirement[];
  documents?: OperationDocument[];
  qualityChecks?: QualityCheck[];
}

export interface ResourceRequirement {
  resourceId: string;
  resourceName: string;
  resourceType: 'machine' | 'tool' | 'labor' | 'space';
  quantity: number;
  unitOfMeasure: string;
  required: boolean; // Is this resource absolutely required?
  alternatives?: string[]; // IDs of alternative resources
}

export interface OperationTool {
  toolId: string;
  toolName: string;
  quantity: number;
  setupTime?: number; // minutes
  notes?: string;
}

export interface OperationDocument {
  id: string;
  name: string;
  documentType: 'instruction' | 'drawing' | 'checklist' | 'standard';
  url: string;
  version?: string;
}

export interface QualityCheck {
  id: string;
  name: string;
  description: string;
  checkType: 'visual' | 'measurement' | 'test';
  targetValue?: number;
  tolerance?: number;
  unitOfMeasure?: string;
  required: boolean;
}

// Complete production route definition
export interface ProductionRoute {
  id: string;
  name: string;
  description: string;
  productId: string;
  productName?: string;
  version: string;
  status: 'draft' | 'approved' | 'active' | 'obsolete';
  effectiveDate: Date;
  obsoleteDate?: Date;
  operations: RouteOperation[];
  totalSetupTime?: number; // minutes (calculated)
  totalProcessingTime?: number; // minutes per unit (calculated)
  createdBy: string;
  createdAt: Date;
  modifiedBy?: string;
  modifiedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
}

// For flattened view of routes
export interface FlatRouteOperation extends Omit<RouteOperation, 'subOperations'> {
  parentId?: string;
  indent: number;
  sequenceNumber: number;
}

// Operation-BOM relationships
export interface OperationBomRelationship {
  operationId: string;
  bomItemId: string;
  relationshipType: 'consumes' | 'produces' | 'transforms';
  quantity: number;
  unitOfMeasure: string;
  scrapPercentage?: number;
}
