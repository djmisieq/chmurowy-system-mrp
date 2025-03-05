import { OperationType } from './operationTypes';
import { InventoryItem } from '../mockData';

// Model dla pozycji dokumentu operacji
export interface OperationItem {
  id: number;
  operationId: number;
  itemId: number;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
  item?: InventoryItem; // Referencja do pełnych danych elementu
}

// Model dokumentu operacji
export interface Operation {
  id: number;
  type: OperationType;
  documentNumber: string;
  date: string;
  sourceLocation?: string;
  targetLocation?: string;
  externalDocument?: string;
  user: string;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  items: OperationItem[];
  totalValue?: number;
}

// Prosty model dla załącznika dokumentu
export interface OperationAttachment {
  id: number;
  operationId: number;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

// Status dokumentu
export const OPERATION_STATUSES = {
  draft: { id: 'draft', name: 'Projekt', color: 'gray' },
  pending: { id: 'pending', name: 'Oczekujący', color: 'blue' },
  completed: { id: 'completed', name: 'Zatwierdzony', color: 'green' },
  cancelled: { id: 'cancelled', name: 'Anulowany', color: 'red' }
};

// Przykładowe dane operacji
export const MOCK_OPERATIONS: Operation[] = [
  {
    id: 1,
    type: 'receipt_external',
    documentNumber: 'PZ/2025/03/001',
    date: '2025-03-01',
    targetLocation: 'A1-01',
    externalDocument: 'FV/2025/03/123',
    user: 'Jan Nowak',
    status: 'completed',
    createdAt: '2025-03-01T10:00:00',
    updatedAt: '2025-03-01T10:30:00',
    notes: 'Przyjęcie silników od dostawcy Marine Motors',
    items: [
      {
        id: 1,
        operationId: 1,
        itemId: 1, // Silnik podwieszany 40KM
        quantity: 5,
        unitPrice: 12000,
        totalPrice: 60000
      }
    ],
    totalValue: 60000
  },
  {
    id: 2,
    type: 'issue_internal',
    documentNumber: 'RW/2025/03/001',
    date: '2025-03-02',
    sourceLocation: 'A1-01',
    user: 'Anna Kowalska',
    status: 'completed',
    createdAt: '2025-03-02T09:15:00',
    updatedAt: '2025-03-02T09:45:00',
    notes: 'Wydanie do produkcji łodzi Classic 180',
    items: [
      {
        id: 2,
        operationId: 2,
        itemId: 1, // Silnik podwieszany 40KM
        quantity: 2,
        unitPrice: 12000,
        totalPrice: 24000
      },
      {
        id: 3,
        operationId: 2,
        itemId: 3, // Konsola sterowa Standard
        quantity: 2,
        unitPrice: 5500,
        totalPrice: 11000
      }
    ],
    totalValue: 35000
  },
  {
    id: 3,
    type: 'transfer',
    documentNumber: 'MM/2025/03/001',
    date: '2025-03-03',
    sourceLocation: 'A1-01',
    targetLocation: 'A2-01',
    user: 'Tomasz Wiśniewski',
    status: 'completed',
    createdAt: '2025-03-03T14:30:00',
    updatedAt: '2025-03-03T15:00:00',
    notes: 'Przesunięcie silników do innej lokalizacji',
    items: [
      {
        id: 4,
        operationId: 3,
        itemId: 1, // Silnik podwieszany 40KM
        quantity: 1
      }
    ]
  },
  {
    id: 4,
    type: 'receipt_external',
    documentNumber: 'PZ/2025/03/002',
    date: '2025-03-04',
    targetLocation: 'B2-03',
    externalDocument: 'FV/2025/03/145',
    user: 'Jan Nowak',
    status: 'completed',
    createdAt: '2025-03-04T11:20:00',
    updatedAt: '2025-03-04T11:45:00',
    notes: 'Przyjęcie kadłubów od dostawcy Yacht Parts',
    items: [
      {
        id: 5,
        operationId: 4,
        itemId: 2, // Kadłub 18ft Classic
        quantity: 3,
        unitPrice: 25000,
        totalPrice: 75000
      }
    ],
    totalValue: 75000
  },
  {
    id: 5,
    type: 'inventory',
    documentNumber: 'IN/2025/03/001',
    date: '2025-03-05',
    targetLocation: 'C1-02',
    user: 'Marta Nowicka',
    status: 'completed',
    createdAt: '2025-03-05T09:00:00',
    updatedAt: '2025-03-05T10:30:00',
    notes: 'Korekta stanów po inwentaryzacji',
    items: [
      {
        id: 6,
        operationId: 5,
        itemId: 3, // Konsola sterowa Standard
        quantity: 1 // Dodatnia wartość oznacza zwiększenie stanu
      },
      {
        id: 7,
        operationId: 5,
        itemId: 4, // Zbiornik paliwa 100L
        quantity: -1 // Ujemna wartość oznacza zmniejszenie stanu
      }
    ]
  },
  {
    id: 6,
    type: 'issue_external',
    documentNumber: 'WZ/2025/03/001',
    date: '2025-03-05',
    sourceLocation: 'A2-01',
    externalDocument: 'ZAM/2025/03/022',
    user: 'Anna Kowalska',
    status: 'pending',
    createdAt: '2025-03-05T13:15:00',
    updatedAt: '2025-03-05T13:15:00',
    notes: 'Wydanie silnika do serwisu zewnętrznego',
    items: [
      {
        id: 8,
        operationId: 6,
        itemId: 1, // Silnik podwieszany 40KM
        quantity: 1,
        unitPrice: 12000,
        totalPrice: 12000
      }
    ],
    totalValue: 12000
  }
];

// Funkcja do pobrania przykładowych operacji
export const getMockOperations = (): Operation[] => {
  return MOCK_OPERATIONS;
};

// Funkcja do pobrania operacji po ID
export const getMockOperationById = (id: number): Operation | undefined => {
  return MOCK_OPERATIONS.find(op => op.id === id);
};

// Funkcja do pobrania operacji po elementach
export const getMockOperationsByItemId = (itemId: number): Operation[] => {
  return MOCK_OPERATIONS.filter(op => 
    op.items.some(item => item.itemId === itemId)
  );
};
