// Typy danych dla elementów magazynowych
export interface InventoryItem {
  id: number;
  code: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
}

// Przykładowe elementy magazynowe
export const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    code: 'SIL-40KM',
    name: 'Silnik podwieszany 40KM',
    category: 'Napęd',
    stock: 12,
    minStock: 5,
    maxStock: 20,
    unit: 'szt.',
    location: 'A1-01',
    value: 12000,
    status: 'good',
    lastUpdated: '2025-03-01',
  },
  {
    id: 2,
    code: 'KAD-18CL',
    name: 'Kadłub 18ft Classic',
    category: 'Kadłuby',
    stock: 3,
    minStock: 5,
    maxStock: 10,
    unit: 'szt.',
    location: 'B2-03',
    value: 25000,
    status: 'warning',
    lastUpdated: '2025-02-28',
  },
  {
    id: 3,
    code: 'KON-STD',
    name: 'Konsola sterowa Standard',
    category: 'Sterowanie',
    stock: 8,
    minStock: 10,
    maxStock: 20,
    unit: 'szt.',
    location: 'C1-02',
    value: 5500,
    status: 'warning',
    lastUpdated: '2025-03-02',
  },
  {
    id: 4,
    code: 'ZB-100L',
    name: 'Zbiornik paliwa 100L',
    category: 'Paliwo',
    stock: 2,
    minStock: 8,
    maxStock: 15,
    unit: 'szt.',
    location: 'D3-04',
    value: 1200,
    status: 'critical',
    lastUpdated: '2025-02-25',
  },
  {
    id: 5,
    code: 'TAP-PR',
    name: 'Zestaw tapicerski Premium',
    category: 'Tapicerka',
    stock: 15,
    minStock: 5,
    maxStock: 15,
    unit: 'zestaw',
    location: 'E2-01',
    value: 4500,
    status: 'warning',
    lastUpdated: '2025-03-04',
  },
  {
    id: 6,
    code: 'AKU-120',
    name: 'Akumulator 120Ah',
    category: 'Elektryka',
    stock: 7,
    minStock: 5,
    maxStock: 15,
    unit: 'szt.',
    location: 'F1-05',
    value: 900,
    status: 'good',
    lastUpdated: '2025-03-03',
  },
];

// Statystyki magazynowe
export const inventoryStats = {
  totalItems: 356,
  lowStockItems: 23,
  totalValue: 2450000, // wartość w PLN
  dailyOperations: 18,
};

// Elementy wymagające uwagi (niski stan, przekroczony maksymalny stan, etc.)
export const attentionItems = mockInventoryItems.filter(
  item => item.status === 'warning' || item.status === 'critical'
);
