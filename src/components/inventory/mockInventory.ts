// Dane testowe dla modułu inwentaryzacji
import { mockInventoryItems } from './mockData';
import { mockCategories, Category } from './mockCategories';
import { mockLocations, Location } from './mockCategories';

// Statusy inwentaryzacji
export type InventoryStatus = 'planned' | 'in_progress' | 'completed' | 'approved' | 'canceled';

// Typy inwentaryzacji
export type InventoryType = 'full' | 'partial' | 'random';

// Struktura inwentaryzacji
export interface Inventory {
  id: number;
  name: string;
  type: InventoryType;
  status: InventoryStatus;
  planDate: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  categories?: number[]; // IDs kategorii jeśli częściowa inwentaryzacja
  locations?: number[]; // IDs lokalizacji jeśli częściowa inwentaryzacja
  assignedUsers: string[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  items: InventoryItem[];
}

// Struktura pozycji inwentaryzacji
export interface InventoryItem {
  id: number;
  inventoryId: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  category: string;
  location: string;
  expectedQuantity: number;
  countedQuantity?: number;
  unit: string;
  difference?: number;
  differenceValue?: number;
  notes?: string;
  status: 'pending' | 'counted' | 'approved' | 'adjusted';
  countedBy?: string;
  countedAt?: string;
  approved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

// Przykładowe dane inwentaryzacji
export const mockInventories: Inventory[] = [
  {
    id: 1,
    name: 'Inwentaryzacja roczna 2025',
    type: 'full',
    status: 'completed',
    planDate: '2025-01-15',
    startDate: '2025-01-15',
    endDate: '2025-01-18',
    description: 'Pełna inwentaryzacja roczna wszystkich magazynów',
    assignedUsers: ['Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski'],
    createdBy: 'Admin',
    createdAt: '2025-01-10T10:30:00Z',
    updatedAt: '2025-01-18T16:45:00Z',
    items: []  // Będzie wypełnione poniżej
  },
  {
    id: 2,
    name: 'Inwentaryzacja częściowa - Materiały konstrukcyjne',
    type: 'partial',
    status: 'in_progress',
    planDate: '2025-03-05',
    startDate: '2025-03-05',
    categories: [1, 2, 3, 4],  // IDs kategorii materiałów konstrukcyjnych
    description: 'Inwentaryzacja częściowa kategorii materiałów konstrukcyjnych',
    assignedUsers: ['Jan Kowalski', 'Anna Nowak'],
    createdBy: 'Admin',
    createdAt: '2025-03-01T14:20:00Z',
    updatedAt: '2025-03-05T09:15:00Z',
    items: []  // Będzie wypełnione poniżej
  },
  {
    id: 3,
    name: 'Inwentaryzacja wyrywkowa - Magazyn Główny',
    type: 'random',
    status: 'planned',
    planDate: '2025-03-15',
    locations: [1, 2, 3],  // IDs lokalizacji w Magazynie Głównym
    description: 'Wyrywkowa kontrola stanów magazynowych w Magazynie Głównym',
    assignedUsers: ['Piotr Wiśniewski'],
    createdBy: 'Admin',
    createdAt: '2025-03-04T11:30:00Z',
    items: []  // Będzie wypełnione poniżej
  }
];

// Wypełnienie pozycji inwentaryzacji
// Inwentaryzacja #1 (pełna) - wszystkie elementy
const inventory1Items: InventoryItem[] = mockInventoryItems.map((item, index) => {
  // Dla symulacji, 10% elementów ma różnicę w stanie
  const hasDifference = Math.random() < 0.1;
  const differenceAmount = hasDifference ? (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3 + 1) : 0;
  const countedQuantity = item.stock + differenceAmount;
  
  return {
    id: index + 1,
    inventoryId: 1,
    itemId: item.id,
    itemCode: item.code,
    itemName: item.name,
    category: item.category,
    location: item.location,
    expectedQuantity: item.stock,
    countedQuantity: countedQuantity,
    unit: item.unit,
    difference: differenceAmount,
    differenceValue: differenceAmount * item.value,
    status: hasDifference ? 'adjusted' : 'approved',
    countedBy: mockInventories[0].assignedUsers[Math.floor(Math.random() * mockInventories[0].assignedUsers.length)],
    countedAt: '2025-01-' + (15 + Math.floor(Math.random() * 3)).toString().padStart(2, '0') + 'T' + Math.floor(Math.random() * 10 + 8).toString().padStart(2, '0') + ':' + Math.floor(Math.random() * 60).toString().padStart(2, '0') + ':00Z',
    approved: true,
    approvedBy: 'Admin',
    approvedAt: '2025-01-18T15:30:00Z'
  };
});
mockInventories[0].items = inventory1Items;

// Inwentaryzacja #2 (częściowa) - tylko wybrane kategorie
const categoryIds = mockInventories[1].categories || [];
const categoryItems = mockInventoryItems.filter(item => {
  const category = mockCategories.find(c => c.name === item.category);
  return category && categoryIds.includes(category.id);
});

const inventory2Items: InventoryItem[] = categoryItems.map((item, index) => {
  // W trakcie inwentaryzacji, część elementów policzona, część czeka
  const isCounted = Math.random() < 0.7;
  const hasDifference = isCounted && Math.random() < 0.15;
  const differenceAmount = hasDifference ? (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3 + 1) : 0;
  const countedQuantity = isCounted ? item.stock + differenceAmount : undefined;
  
  return {
    id: 1000 + index + 1,
    inventoryId: 2,
    itemId: item.id,
    itemCode: item.code,
    itemName: item.name,
    category: item.category,
    location: item.location,
    expectedQuantity: item.stock,
    countedQuantity: countedQuantity,
    unit: item.unit,
    difference: isCounted ? differenceAmount : undefined,
    differenceValue: isCounted ? differenceAmount * item.value : undefined,
    status: isCounted ? (hasDifference ? 'counted' : 'approved') : 'pending',
    countedBy: isCounted ? mockInventories[1].assignedUsers[Math.floor(Math.random() * mockInventories[1].assignedUsers.length)] : undefined,
    countedAt: isCounted ? '2025-03-' + (5 + Math.floor(Math.random() * 2)).toString().padStart(2, '0') + 'T' + Math.floor(Math.random() * 10 + 8).toString().padStart(2, '0') + ':' + Math.floor(Math.random() * 60).toString().padStart(2, '0') + ':00Z' : undefined,
    approved: !hasDifference && isCounted,
    approvedBy: !hasDifference && isCounted ? 'Admin' : undefined,
    approvedAt: !hasDifference && isCounted ? '2025-03-06T11:15:00Z' : undefined
  };
});
mockInventories[1].items = inventory2Items;

// Inwentaryzacja #3 (losowa) - losowo wybrane elementy
// Wybierz 10% losowych elementów z magazynu
const randomItems = [...mockInventoryItems].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(mockInventoryItems.length * 0.1));

const inventory3Items: InventoryItem[] = randomItems.map((item, index) => {
  return {
    id: 2000 + index + 1,
    inventoryId: 3,
    itemId: item.id,
    itemCode: item.code,
    itemName: item.name,
    category: item.category,
    location: item.location,
    expectedQuantity: item.stock,
    unit: item.unit,
    status: 'pending'
  };
});
mockInventories[2].items = inventory3Items;

// Funkcje pomocnicze

// Pobierz inwentaryzację według ID
export const getInventoryById = (id: number): Inventory | undefined => {
  return mockInventories.find(inv => inv.id === id);
};

// Pobierz wszystkie inwentaryzacje według statusu
export const getInventoriesByStatus = (status: InventoryStatus | InventoryStatus[]): Inventory[] => {
  if (Array.isArray(status)) {
    return mockInventories.filter(inv => status.includes(inv.status));
  }
  return mockInventories.filter(inv => inv.status === status);
};

// Konwersja statusu na przyjazną nazwę
export const getStatusLabel = (status: InventoryStatus): string => {
  switch (status) {
    case 'planned': return 'Zaplanowana';
    case 'in_progress': return 'W trakcie';
    case 'completed': return 'Zakończona';
    case 'approved': return 'Zatwierdzona';
    case 'canceled': return 'Anulowana';
    default: return status;
  }
};

// Konwersja typu na przyjazną nazwę
export const getTypeLabel = (type: InventoryType): string => {
  switch (type) {
    case 'full': return 'Pełna';
    case 'partial': return 'Częściowa';
    case 'random': return 'Wyrywkowa';
    default: return type;
  }
};

// Pobierz nazwę kategorii na podstawie ID
export const getCategoryName = (id: number): string => {
  const category = mockCategories.find(cat => cat.id === id);
  return category ? category.name : '';
};

// Pobierz nazwę lokalizacji na podstawie ID
export const getLocationName = (id: number): string => {
  const location = mockLocations.find(loc => loc.id === id);
  return location ? location.name : '';
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

// Formatowanie daty i czasu
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Formatowanie waluty
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};