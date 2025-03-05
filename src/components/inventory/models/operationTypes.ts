// Typy operacji magazynowych
export type OperationType = 'receipt_external' | 'issue_external' | 'receipt_internal' | 'issue_internal' | 'transfer' | 'inventory';

export interface OperationTypeInfo {
  id: OperationType;
  code: string;
  name: string;
  description: string;
  requiresSource: boolean;
  requiresTarget: boolean;
  requiresExternalDocument: boolean;
  affectsInventory: boolean;
  color: string;
}

// Informacje o typach operacji
export const OPERATION_TYPES: Record<OperationType, OperationTypeInfo> = {
  receipt_external: {
    id: 'receipt_external',
    code: 'PZ',
    name: 'Przyjęcie zewnętrzne',
    description: 'Przyjęcie materiałów od dostawcy zewnętrznego',
    requiresSource: false,
    requiresTarget: true,
    requiresExternalDocument: true,
    affectsInventory: true,
    color: 'green'
  },
  issue_external: {
    id: 'issue_external',
    code: 'WZ',
    name: 'Wydanie zewnętrzne',
    description: 'Wydanie materiałów na zewnątrz',
    requiresSource: true,
    requiresTarget: false,
    requiresExternalDocument: true,
    affectsInventory: true,
    color: 'red'
  },
  receipt_internal: {
    id: 'receipt_internal',
    code: 'PW',
    name: 'Przyjęcie wewnętrzne',
    description: 'Przyjęcie materiałów z produkcji wewnętrznej',
    requiresSource: false,
    requiresTarget: true,
    requiresExternalDocument: false,
    affectsInventory: true,
    color: 'teal'
  },
  issue_internal: {
    id: 'issue_internal',
    code: 'RW',
    name: 'Wydanie wewnętrzne',
    description: 'Wydanie materiałów do produkcji wewnętrznej',
    requiresSource: true,
    requiresTarget: false,
    requiresExternalDocument: false,
    affectsInventory: true,
    color: 'orange'
  },
  transfer: {
    id: 'transfer',
    code: 'MM',
    name: 'Przesunięcie międzymagazynowe',
    description: 'Przesunięcie materiałów między lokalizacjami magazynowymi',
    requiresSource: true,
    requiresTarget: true,
    requiresExternalDocument: false,
    affectsInventory: false,
    color: 'blue'
  },
  inventory: {
    id: 'inventory',
    code: 'IN',
    name: 'Inwentaryzacja',
    description: 'Korekta stanów magazynowych po inwentaryzacji',
    requiresSource: false,
    requiresTarget: true,
    requiresExternalDocument: false,
    affectsInventory: true,
    color: 'purple'
  }
};

// Lista typów operacji do wyświetlania w UI
export const OPERATION_TYPE_LIST = Object.values(OPERATION_TYPES);

// Funkcja pomocnicza do pobrania informacji o typie operacji
export const getOperationTypeInfo = (type: OperationType): OperationTypeInfo => {
  return OPERATION_TYPES[type] || OPERATION_TYPES.receipt_external;
};

// Funkcja pomocnicza do pobrania kodu operacji
export const getOperationTypeCode = (type: OperationType): string => {
  return getOperationTypeInfo(type).code;
};

// Funkcja pomocnicza do pobrania nazwy operacji
export const getOperationTypeName = (type: OperationType): string => {
  return getOperationTypeInfo(type).name;
};

// Funkcja pomocnicza do pobrania koloru operacji
export const getOperationTypeColor = (type: OperationType): string => {
  return getOperationTypeInfo(type).color;
};

// Funkcja pomocnicza do generowania numeru dokumentu
export const generateDocumentNumber = (type: OperationType, date: Date = new Date()): string => {
  const code = getOperationTypeCode(type);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${code}/${year}/${month}/${randomPart}`;
};
