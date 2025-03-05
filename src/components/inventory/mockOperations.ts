// Dane testowe dla operacji magazynowych

import { mockInventoryItems } from './mockData';

// Typy operacji magazynowych
export type OperationType = 'PZ' | 'WZ' | 'PW' | 'RW' | 'MM' | 'IN';

// Definicje typów operacji
export const operationTypes = [
  { id: 'PZ', name: 'Przyjęcie zewnętrzne', description: 'Przyjęcie towaru od dostawcy zewnętrznego' },
  { id: 'WZ', name: 'Wydanie zewnętrzne', description: 'Wydanie towaru do odbiorcy zewnętrznego' },
  { id: 'PW', name: 'Przyjęcie wewnętrzne', description: 'Przyjęcie z produkcji własnej' },
  { id: 'RW', name: 'Wydanie wewnętrzne', description: 'Rozchód wewnętrzny na produkcję' },
  { id: 'MM', name: 'Przesunięcie międzymagazynowe', description: 'Przesunięcie między lokalizacjami' },
  { id: 'IN', name: 'Inwentaryzacja', description: 'Korekta ilościowa po inwentaryzacji' }
];

// Interfejs pozycji operacji
export interface OperationItem {
  id: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  locationFrom?: string;
  locationTo?: string;
}

// Interfejs operacji magazynowej
export interface Operation {
  id: number;
  number: string;
  type: OperationType;
  date: string;
  status: 'draft' | 'confirmed' | 'canceled';
  externalDocument?: string;
  executor: string;
  description?: string;
  items: OperationItem[];
  attachments?: string[];
  createdAt: string;
  updatedAt?: string;
}

// Generowanie pozycji operacji
const generateOperationItems = (operationId: number, type: OperationType): OperationItem[] => {
  const itemsCount = Math.floor(Math.random() * 3) + 1; // 1-3 pozycje
  const items: OperationItem[] = [];
  
  for (let i = 0; i < itemsCount; i++) {
    const randomItemIndex = Math.floor(Math.random() * mockInventoryItems.length);
    const item = mockInventoryItems[randomItemIndex];
    
    items.push({
      id: operationId * 100 + i,
      itemId: item.id,
      itemCode: item.code,
      itemName: item.name,
      quantity: Math.floor(Math.random() * 10) + 1,
      unitPrice: item.value,
      unit: item.unit,
      locationFrom: type === 'MM' ? item.location : undefined,
      locationTo: type === 'MM' ? 'Magazyn B-' + Math.floor(Math.random() * 5 + 1) : undefined
    });
  }
  
  return items;
};

// Tworzenie przykładowych operacji magazynowych
export const mockOperations: Operation[] = [
  {
    id: 1,
    number: 'PZ/2025/03/001',
    type: 'PZ',
    date: '2025-03-01',
    status: 'confirmed',
    externalDocument: 'FV/2025/03/123',
    executor: 'Jan Kowalski',
    description: 'Dostawa od Boatex sp. z o.o.',
    items: generateOperationItems(1, 'PZ'),
    attachments: ['faktura.pdf'],
    createdAt: '2025-03-01T10:15:00Z',
    updatedAt: '2025-03-01T10:30:00Z'
  },
  {
    id: 2,
    number: 'WZ/2025/03/001',
    type: 'WZ',
    date: '2025-03-02',
    status: 'confirmed',
    externalDocument: 'ZAM/2025/03/45',
    executor: 'Anna Nowak',
    description: 'Realizacja zamówienia klienta',
    items: generateOperationItems(2, 'WZ'),
    createdAt: '2025-03-02T09:20:00Z',
    updatedAt: '2025-03-02T09:45:00Z'
  },
  {
    id: 3,
    number: 'PW/2025/03/001',
    type: 'PW',
    date: '2025-03-03',
    status: 'confirmed',
    executor: 'Marcin Zieliński',
    description: 'Przyjęcie z produkcji',
    items: generateOperationItems(3, 'PW'),
    createdAt: '2025-03-03T14:10:00Z',
    updatedAt: '2025-03-03T14:25:00Z'
  },
  {
    id: 4,
    number: 'RW/2025/03/001',
    type: 'RW',
    date: '2025-03-04',
    status: 'confirmed',
    executor: 'Katarzyna Wiśniewska',
    description: 'Wydanie materiałów na produkcję',
    items: generateOperationItems(4, 'RW'),
    createdAt: '2025-03-04T08:30:00Z',
    updatedAt: '2025-03-04T08:45:00Z'
  },
  {
    id: 5,
    number: 'MM/2025/03/001',
    type: 'MM',
    date: '2025-03-04',
    status: 'confirmed',
    executor: 'Piotr Dąbrowski',
    description: 'Przesunięcie do magazynu B',
    items: generateOperationItems(5, 'MM'),
    createdAt: '2025-03-04T11:15:00Z',
    updatedAt: '2025-03-04T11:30:00Z'
  },
  {
    id: 6,
    number: 'IN/2025/03/001',
    type: 'IN',
    date: '2025-03-05',
    status: 'draft',
    executor: 'Magdalena Lewandowska',
    description: 'Inwentaryzacja kwartalna',
    items: generateOperationItems(6, 'IN'),
    createdAt: '2025-03-05T09:00:00Z'
  },
  {
    id: 7,
    number: 'PZ/2025/03/002',
    type: 'PZ',
    date: '2025-03-05',
    status: 'draft',
    externalDocument: 'FV/2025/03/156',
    executor: 'Jan Kowalski',
    description: 'Dostawa od Marina Supply Inc.',
    items: generateOperationItems(7, 'PZ'),
    createdAt: '2025-03-05T13:45:00Z'
  }
];

// Funkcje pomocnicze do generowania danych dla innych komponentów
export const getItemOperations = (itemId: number): Operation[] => {
  return mockOperations.filter(op => 
    op.items.some(item => item.itemId === itemId)
  );
};

export const getItemDocuments = (itemId: number): any[] => {
  // Przykładowe dokumenty związane z elementem
  return [
    { id: 1, name: 'Instrukcja montażu.pdf', date: '2025-01-15', type: 'pdf', size: '2.4 MB' },
    { id: 2, name: 'Karta gwarancyjna.pdf', date: '2025-01-15', type: 'pdf', size: '0.8 MB' },
    { id: 3, name: 'Specyfikacja techniczna.docx', date: '2025-01-10', type: 'docx', size: '1.2 MB' }
  ];
};

export const getItemProducts = (itemId: number): any[] => {
  // Przykładowe produkty, w których używany jest element
  return [
    { id: 101, name: 'Łódź Model Alpha', quantity: 2, unit: 'szt' },
    { id: 102, name: 'Łódź Model Gamma', quantity: 4, unit: 'szt' },
    { id: 103, name: 'Zestaw naprawczy', quantity: 1, unit: 'szt' }
  ];
};

// Funkcje generujące statusy i daty
export const getOperationStatus = (status: string) => {
  switch (status) {
    case 'draft':
      return { label: 'Szkic', color: 'bg-gray-100 text-gray-800' };
    case 'confirmed':
      return { label: 'Zatwierdzony', color: 'bg-green-100 text-green-800' };
    case 'canceled':
      return { label: 'Anulowany', color: 'bg-red-100 text-red-800' };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-800' };
  }
};

// Formatowanie daty
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

// Formatowanie ceny
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};