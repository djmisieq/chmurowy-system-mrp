// Types for Production Routes (marszruty technologiczne)

export interface RouteOperation {
  id: string;
  name: string;
  description?: string;
  workCenterId: string;
  workCenterName: string;
  setupTime: number; // Setup time in minutes
  operationTime: number; // Operation time in minutes per unit
  waitTime?: number; // Wait time in minutes
  moveTime?: number; // Move time to next operation in minutes
  requiredSkills?: string[]; // Required skills for the operation
  qualityCheckpoints?: QualityCheckpoint[];
  predecessorOperations?: string[]; // IDs of operations that must be completed before this one
  status?: 'active' | 'draft' | 'obsolete';
  resources?: OperationResource[]; // Resources needed for this operation
  documents?: OperationDocument[]; // Technical documentation
  subOperations?: RouteOperation[]; // Sub-operations if any
  materialInputs?: MaterialInput[]; // Materials consumed during this operation
}

export interface QualityCheckpoint {
  id: string;
  name: string;
  description?: string;
  measurementUnit?: string;
  minValue?: number;
  maxValue?: number;
  targetValue?: number;
  checkType: 'visual' | 'measurement' | 'test' | 'other';
}

export interface OperationResource {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'machine' | 'tool' | 'personnel' | 'fixture' | 'other';
  quantity: number;
  unit: string;
  requiredTime?: number; // Time in minutes this resource is needed
}

export interface OperationDocument {
  id: string;
  name: string;
  documentType: 'drawing' | 'instruction' | 'safety' | 'quality' | 'other';
  url?: string;
  version?: string;
}

export interface MaterialInput {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  consumptionType: 'per-unit' | 'per-batch' | 'fixed';
  scrapFactor?: number; // Expected scrap as a percentage
}

// The main production route
export interface ProductionRoute {
  id: string;
  name: string;
  description?: string;
  productId: string;
  productName: string;
  version: string;
  status: 'draft' | 'approved' | 'active' | 'obsolete';
  effectiveDate: Date;
  obsoleteDate?: Date;
  operations: RouteOperation[];
  batchSize?: number; // Default batch size
  notes?: string;
  createdBy: string;
  createdAt: Date;
  modifiedBy?: string;
  modifiedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

// For comparing routes between versions
export interface RouteRevisionChange {
  changeType: 'add' | 'remove' | 'modify';
  operation: RouteOperation;
  previousValue?: any;
  newValue?: any;
}
