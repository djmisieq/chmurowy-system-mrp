// Dane testowe dla kategorii i lokalizacji magazynowych

export interface CategoryAttribute {
  id: number;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  required: boolean;
  options?: string[]; // Dla typu 'select'
  defaultValue?: any;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  description?: string;
  attributes: CategoryAttribute[];
  itemsCount: number;
  createdAt: string;
  updatedAt?: string;
}

// Definicja struktury lokalizacji magazynowej
export interface Location {
  id: number;
  code: string;
  name: string;
  type: 'warehouse' | 'zone' | 'rack' | 'shelf' | 'bin';
  parentId: number | null;
  description?: string;
  capacity?: number;
  capacityUnit?: string;
  itemsCount: number;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Kategorie produktów
export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Materiały konstrukcyjne',
    code: 'MAT-KONST',
    parentId: null,
    description: 'Wszystkie materiały używane do konstrukcji łodzi',
    attributes: [
      {
        id: 1,
        name: 'Materiał',
        type: 'select',
        required: true,
        options: ['Stal', 'Aluminium', 'Drewno', 'Kompozyt', 'Włókno szklane', 'Inne']
      },
      {
        id: 2,
        name: 'Grubość (mm)',
        type: 'number',
        required: true
      }
    ],
    itemsCount: 45,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-03-01T14:30:00Z'
  },
  {
    id: 2,
    name: 'Stal',
    code: 'MAT-STAL',
    parentId: 1,
    description: 'Materiały stalowe',
    attributes: [
      {
        id: 3,
        name: 'Gatunek stali',
        type: 'text',
        required: true
      },
      {
        id: 4,
        name: 'Odporność na korozję',
        type: 'boolean',
        required: false,
        defaultValue: false
      }
    ],
    itemsCount: 18,
    createdAt: '2025-01-12T09:30:00Z'
  },
  {
    id: 3,
    name: 'Aluminium',
    code: 'MAT-ALUM',
    parentId: 1,
    description: 'Materiały aluminiowe',
    attributes: [
      {
        id: 5,
        name: 'Stop',
        type: 'text',
        required: true
      }
    ],
    itemsCount: 12,
    createdAt: '2025-01-12T09:45:00Z'
  },
  {
    id: 4,
    name: 'Drewno',
    code: 'MAT-DREW',
    parentId: 1,
    description: 'Materiały drewniane',
    attributes: [
      {
        id: 6,
        name: 'Rodzaj drewna',
        type: 'select',
        required: true,
        options: ['Dąb', 'Mahoń', 'Teak', 'Sosna', 'Inne']
      },
      {
        id: 7,
        name: 'Impregnacja',
        type: 'boolean',
        required: true,
        defaultValue: true
      }
    ],
    itemsCount: 15,
    createdAt: '2025-01-12T10:15:00Z'
  },
  {
    id: 5,
    name: 'Komponenty elektroniczne',
    code: 'ELEKTRO',
    parentId: null,
    description: 'Komponenty elektroniczne i elektryczne',
    attributes: [
      {
        id: 8,
        name: 'Napięcie (V)',
        type: 'number',
        required: true
      },
      {
        id: 9,
        name: 'Wodoodporność',
        type: 'boolean',
        required: true,
        defaultValue: true
      }
    ],
    itemsCount: 32,
    createdAt: '2025-01-15T08:20:00Z',
    updatedAt: '2025-02-20T11:45:00Z'
  },
  {
    id: 6,
    name: 'Silniki i napędy',
    code: 'SILNIKI',
    parentId: null,
    description: 'Silniki, napędy i powiązane komponenty',
    attributes: [
      {
        id: 10,
        name: 'Moc (KM)',
        type: 'number',
        required: true
      },
      {
        id: 11,
        name: 'Typ silnika',
        type: 'select',
        required: true,
        options: ['Zaburtowy', 'Wewnętrzny', 'Elektryczny', 'Hybrydowy']
      }
    ],
    itemsCount: 23,
    createdAt: '2025-01-20T13:10:00Z'
  },
  {
    id: 7,
    name: 'Wyposażenie pokładowe',
    code: 'WYPOSAŻ',
    parentId: null,
    description: 'Wyposażenie łodzi i akcesoria pokładowe',
    attributes: [
      {
        id: 12,
        name: 'Montaż stały',
        type: 'boolean',
        required: false,
        defaultValue: false
      }
    ],
    itemsCount: 41,
    createdAt: '2025-01-25T09:00:00Z',
    updatedAt: '2025-03-02T15:30:00Z'
  },
  {
    id: 8,
    name: 'Części zamienne',
    code: 'CZ-ZAM',
    parentId: null,
    description: 'Części zamienne do wszystkich kategorii',
    attributes: [
      {
        id: 13,
        name: 'Kompatybilność',
        type: 'text',
        required: true
      }
    ],
    itemsCount: 67,
    createdAt: '2025-02-01T10:45:00Z'
  }
];

// Lokalizacje magazynowe
export const mockLocations: Location[] = [
  {
    id: 1,
    code: 'MAG-GLOWNY',
    name: 'Magazyn Główny',
    type: 'warehouse',
    parentId: null,
    description: 'Główny magazyn produkcyjny',
    itemsCount: 185,
    active: true,
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-03-01T15:00:00Z'
  },
  {
    id: 2,
    code: 'STREFA-A',
    name: 'Strefa A - Materiały',
    type: 'zone',
    parentId: 1,
    description: 'Strefa magazynowa dla materiałów',
    itemsCount: 75,
    active: true,
    createdAt: '2025-01-01T09:15:00Z'
  },
  {
    id: 3,
    code: 'A-REG-01',
    name: 'Regał A01',
    type: 'rack',
    parentId: 2,
    description: 'Regał w strefie A',
    itemsCount: 25,
    active: true,
    createdAt: '2025-01-01T09:30:00Z'
  },
  {
    id: 4,
    code: 'A-REG-01-P01',
    name: 'Półka A01-P01',
    type: 'shelf',
    parentId: 3,
    description: 'Pierwsza półka regału A01',
    capacity: 500,
    capacityUnit: 'kg',
    itemsCount: 8,
    active: true,
    createdAt: '2025-01-01T09:45:00Z'
  },
  {
    id: 5,
    code: 'A-REG-01-P01-B01',
    name: 'Pojemnik A01-P01-B01',
    type: 'bin',
    parentId: 4,
    capacity: 50,
    capacityUnit: 'kg',
    itemsCount: 3,
    active: true,
    createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 6,
    code: 'A-REG-01-P01-B02',
    name: 'Pojemnik A01-P01-B02',
    type: 'bin',
    parentId: 4,
    capacity: 50,
    capacityUnit: 'kg',
    itemsCount: 5,
    active: true,
    createdAt: '2025-01-01T10:15:00Z'
  },
  {
    id: 7,
    code: 'A-REG-01-P02',
    name: 'Półka A01-P02',
    type: 'shelf',
    parentId: 3,
    description: 'Druga półka regału A01',
    capacity: 500,
    capacityUnit: 'kg',
    itemsCount: 12,
    active: true,
    createdAt: '2025-01-01T10:30:00Z'
  },
  {
    id: 8,
    code: 'A-REG-02',
    name: 'Regał A02',
    type: 'rack',
    parentId: 2,
    description: 'Regał w strefie A',
    itemsCount: 30,
    active: true,
    createdAt: '2025-01-01T11:00:00Z'
  },
  {
    id: 9,
    code: 'STREFA-B',
    name: 'Strefa B - Elektronika',
    type: 'zone',
    parentId: 1,
    description: 'Strefa magazynowa dla elektroniki',
    itemsCount: 32,
    active: true,
    createdAt: '2025-01-02T09:00:00Z',
    updatedAt: '2025-02-15T14:30:00Z'
  },
  {
    id: 10,
    code: 'B-REG-01',
    name: 'Regał B01',
    type: 'rack',
    parentId: 9,
    description: 'Regał w strefie B',
    itemsCount: 20,
    active: true,
    createdAt: '2025-01-02T09:15:00Z'
  },
  {
    id: 11,
    code: 'STREFA-C',
    name: 'Strefa C - Silniki',
    type: 'zone',
    parentId: 1,
    description: 'Strefa magazynowa dla silników i napędów',
    itemsCount: 23,
    active: true,
    createdAt: '2025-01-03T09:00:00Z'
  },
  {
    id: 12,
    code: 'MAG-ZEWN',
    name: 'Magazyn Zewnętrzny',
    type: 'warehouse',
    parentId: null,
    description: 'Magazyn zewnętrzny dla dużych elementów',
    itemsCount: 15,
    active: true,
    createdAt: '2025-01-10T09:00:00Z'
  }
];

// Funkcje pomocnicze
export const getCategoryById = (id: number): Category | undefined => {
  return mockCategories.find(category => category.id === id);
};

export const getSubcategories = (parentId: number | null): Category[] => {
  return mockCategories.filter(category => category.parentId === parentId);
};

export const getCategoryPath = (id: number): Category[] => {
  const result: Category[] = [];
  let currentCategory = getCategoryById(id);
  
  while (currentCategory) {
    result.unshift(currentCategory);
    if (currentCategory.parentId === null) {
      break;
    }
    currentCategory = getCategoryById(currentCategory.parentId);
  }
  
  return result;
};

export const getLocationById = (id: number): Location | undefined => {
  return mockLocations.find(location => location.id === id);
};

export const getSublocations = (parentId: number | null): Location[] => {
  return mockLocations.filter(location => location.parentId === parentId);
};

export const getLocationPath = (id: number): Location[] => {
  const result: Location[] = [];
  let currentLocation = getLocationById(id);
  
  while (currentLocation) {
    result.unshift(currentLocation);
    if (currentLocation.parentId === null) {
      break;
    }
    currentLocation = getLocationById(currentLocation.parentId);
  }
  
  return result;
};

export const getLocationTypeLabel = (type: string): string => {
  switch (type) {
    case 'warehouse': return 'Magazyn';
    case 'zone': return 'Strefa';
    case 'rack': return 'Regał';
    case 'shelf': return 'Półka';
    case 'bin': return 'Pojemnik';
    default: return type;
  }
};