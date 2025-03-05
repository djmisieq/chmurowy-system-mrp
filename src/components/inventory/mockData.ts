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
  supplier?: string;
  description?: string;
}

// Interfejs dla dostawców
export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
}

// Przykładowi dostawcy
export const mockSuppliers: Supplier[] = [
  { id: 1, name: 'Marine Motors Sp. z o.o.', contact: '+48 123 456 789', email: 'kontakt@marinemotors.pl' },
  { id: 2, name: 'Yacht Parts S.A.', contact: '+48 987 654 321', email: 'info@yachtparts.com' },
  { id: 3, name: 'ElectroNautic', contact: '+48 111 222 333', email: 'sales@electronautic.eu' },
  { id: 4, name: 'BoatSupplies', contact: '+48 444 555 666', email: 'office@boatsupplies.pl' },
];

// Przykładowe kategorie
export const mockCategories = [
  'Napęd',
  'Kadłuby',
  'Sterowanie',
  'Paliwo',
  'Tapicerka',
  'Elektryka',
  'Oświetlenie',
  'Elektronika',
  'Elementy montażowe',
  'Akcesoria'
];

// Przykładowe lokalizacje
export const mockLocations = [
  'A1-01', 'A1-02', 'A1-03', 'A2-01', 'A2-02', 'A3-01',
  'B1-01', 'B1-02', 'B2-01', 'B2-02', 'B2-03', 'B3-01',
  'C1-01', 'C1-02', 'C2-01', 'C2-02', 'C3-01', 'C3-02',
  'D1-01', 'D2-01', 'D3-01', 'D3-02', 'D3-03', 'D3-04',
  'E1-01', 'E2-01', 'E3-01',
  'F1-01', 'F1-02', 'F1-03', 'F1-04', 'F1-05'
];

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
    supplier: 'Marine Motors Sp. z o.o.',
    description: 'Silnik zaburtowy 40KM, czterosuwowy, z elektrycznym rozrusznikiem'
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
    supplier: 'Yacht Parts S.A.',
    description: 'Kadłub łodzi motorowej 18 stóp, seria Classic, wykonany z laminatu poliestrowo-szklanego'
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
    supplier: 'Yacht Parts S.A.',
    description: 'Standardowa konsola sterowa do łodzi typu Classic i Sport'
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
    supplier: 'BoatSupplies',
    description: 'Zbiornik paliwa o pojemności 100 litrów, wykonany ze stali nierdzewnej'
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
    status: 'good',
    lastUpdated: '2025-03-04',
    supplier: 'Yacht Parts S.A.',
    description: 'Komplet tapicerki Premium do łodzi typu Luxury, odporna na wodę morską i promieniowanie UV'
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
    supplier: 'ElectroNautic',
    description: 'Akumulator żelowy 120Ah, bezobsługowy, przeznaczony do zastosowań morskich'
  },
  {
    id: 7,
    code: 'OSW-LED',
    name: 'Oświetlenie LED nawigacyjne',
    category: 'Oświetlenie',
    stock: 18,
    minStock: 10,
    maxStock: 30,
    unit: 'zestaw',
    location: 'F1-02',
    value: 450,
    status: 'good',
    lastUpdated: '2025-03-01',
    supplier: 'ElectroNautic',
    description: 'Komplet oświetlenia nawigacyjnego LED zgodnego z przepisami'
  },
  {
    id: 8,
    code: 'GPS-MAR',
    name: 'Nawigacja GPS morska',
    category: 'Elektronika',
    stock: 4,
    minStock: 3,
    maxStock: 8,
    unit: 'szt.',
    location: 'F1-01',
    value: 3200,
    status: 'good',
    lastUpdated: '2025-03-02',
    supplier: 'ElectroNautic',
    description: 'Wodoodporna nawigacja GPS z mapami morskimi i portowymi'
  },
  {
    id: 9,
    code: 'SR-INOX',
    name: 'Śruby nierdzewne M8',
    category: 'Elementy montażowe',
    stock: 500,
    minStock: 200,
    maxStock: 1000,
    unit: 'szt.',
    location: 'D1-01',
    value: 2.5,
    status: 'good',
    lastUpdated: '2025-02-20',
    supplier: 'BoatSupplies',
    description: 'Śruby M8 wykonane ze stali nierdzewnej, odporne na wodę morską'
  },
  {
    id: 10,
    code: 'SIL-60KM',
    name: 'Silnik podwieszany 60KM',
    category: 'Napęd',
    stock: 5,
    minStock: 3,
    maxStock: 10,
    unit: 'szt.',
    location: 'A1-02',
    value: 18000,
    status: 'good',
    lastUpdated: '2025-03-03',
    supplier: 'Marine Motors Sp. z o.o.',
    description: 'Silnik zaburtowy 60KM, czterosuwowy, z elektrycznym rozrusznikiem i trymem'
  },
  {
    id: 11,
    code: 'KAD-21SP',
    name: 'Kadłub 21ft Sport',
    category: 'Kadłuby',
    stock: 2,
    minStock: 2,
    maxStock: 6,
    unit: 'szt.',
    location: 'B2-01',
    value: 30000,
    status: 'warning',
    lastUpdated: '2025-02-25',
    supplier: 'Yacht Parts S.A.',
    description: 'Kadłub łodzi motorowej 21 stóp, seria Sport, wykonany z laminatu poliestrowo-szklanego'
  },
  {
    id: 12,
    code: 'SRU-HYD',
    name: 'Układ sterowania hydrauliczny',
    category: 'Sterowanie',
    stock: 6,
    minStock: 4,
    maxStock: 10,
    unit: 'zestaw',
    location: 'C2-01',
    value: 7800,
    status: 'good',
    lastUpdated: '2025-03-01',
    supplier: 'Marine Motors Sp. z o.o.',
    description: 'Kompletny hydrauliczny układ sterowania z pompą, siłownikiem i przewodami'
  }
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
