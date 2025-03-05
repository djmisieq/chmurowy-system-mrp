// Typy dla operacji magazynowych
export interface InventoryOperation {
  id: number;
  itemId: number;
  type: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'internal_receipt' | 'internal_issue' | 'inventory';
  quantity: number;
  date: string;
  documentNumber: string;
  user: string;
  description?: string;
  sourceLocation?: string;
  targetLocation?: string;
  supplier?: string;
  buyer?: string;
  status: 'completed' | 'pending' | 'cancelled';
  items?: OperationItem[];
  externalDocument?: string;
  totalValue?: number;
}

export interface OperationItem {
  id: number;
  itemId: number;
  operationId: number;
  quantity: number;
  unitPrice?: number;
  location?: string;
  description?: string;
}

// Przykładowe operacje magazynowe
export const mockOperations: InventoryOperation[] = [
  {
    id: 1001,
    itemId: 1,
    type: 'receipt',
    quantity: 5,
    date: '2025-03-01',
    documentNumber: 'PZ/2025/03/001',
    user: 'Jan Nowak',
    description: 'Dostawa od Marine Motors Sp. z o.o.',
    targetLocation: 'A1-01',
    supplier: 'Marine Motors Sp. z o.o.',
    status: 'completed',
    externalDocument: 'FV/2025/03/123',
    totalValue: 60000
  },
  {
    id: 1002,
    itemId: 1,
    type: 'issue',
    quantity: 2,
    date: '2025-03-02',
    documentNumber: 'WZ/2025/03/005',
    user: 'Anna Kowalska',
    description: 'Wydanie do produkcji łodzi Classic 180',
    sourceLocation: 'A1-01',
    status: 'completed',
    totalValue: 24000
  },
  {
    id: 1003,
    itemId: 1,
    type: 'transfer',
    quantity: 1,
    date: '2025-03-03',
    documentNumber: 'MM/2025/03/002',
    user: 'Tomasz Wiśniewski',
    description: 'Przesunięcie między magazynami',
    sourceLocation: 'A1-01',
    targetLocation: 'A1-03',
    status: 'completed'
  },
  {
    id: 1004,
    itemId: 1,
    type: 'adjustment',
    quantity: 1,
    date: '2025-03-04',
    documentNumber: 'ADJ/2025/03/001',
    user: 'Marta Nowicka',
    description: 'Korekta po inwentaryzacji',
    targetLocation: 'A1-01',
    status: 'completed'
  },
  {
    id: 1005,
    itemId: 2,
    type: 'receipt',
    quantity: 2,
    date: '2025-02-28',
    documentNumber: 'PZ/2025/02/018',
    user: 'Jan Nowak',
    description: 'Dostawa od Yacht Parts S.A.',
    targetLocation: 'B2-03',
    supplier: 'Yacht Parts S.A.',
    status: 'completed',
    externalDocument: 'FV/2025/02/045',
    totalValue: 50000
  },
  {
    id: 1006,
    itemId: 2,
    type: 'issue',
    quantity: 1,
    date: '2025-03-01',
    documentNumber: 'WZ/2025/03/001',
    user: 'Anna Kowalska',
    description: 'Wydanie do produkcji łodzi Luxury 250',
    sourceLocation: 'B2-03',
    status: 'completed',
    totalValue: 25000
  },
  {
    id: 1007,
    itemId: 3,
    type: 'receipt',
    quantity: 10,
    date: '2025-02-25',
    documentNumber: 'PZ/2025/02/015',
    user: 'Jan Nowak',
    description: 'Dostawa od Yacht Parts S.A.',
    targetLocation: 'C1-02',
    supplier: 'Yacht Parts S.A.',
    status: 'completed',
    externalDocument: 'FV/2025/02/040',
    totalValue: 55000
  },
  {
    id: 1008,
    itemId: 3,
    type: 'issue',
    quantity: 2,
    date: '2025-03-02',
    documentNumber: 'WZ/2025/03/006',
    user: 'Anna Kowalska',
    description: 'Wydanie do produkcji łodzi Sport 210',
    sourceLocation: 'C1-02',
    status: 'completed',
    totalValue: 11000
  },
  {
    id: 1009,
    itemId: 5,
    type: 'internal_receipt',
    quantity: 5,
    date: '2025-03-01',
    documentNumber: 'PW/2025/03/001',
    user: 'Tomasz Wiśniewski',
    description: 'Przyjęcie z produkcji własnej',
    targetLocation: 'E2-01',
    status: 'completed',
    totalValue: 22500
  },
  {
    id: 1010,
    itemId: 4,
    type: 'internal_issue',
    quantity: 4,
    date: '2025-02-28',
    documentNumber: 'RW/2025/02/010',
    user: 'Marta Nowicka',
    description: 'Wydanie do produkcji wewnętrznej',
    sourceLocation: 'D3-04',
    status: 'completed',
    totalValue: 4800
  },
  {
    id: 1011,
    itemId: 8,
    type: 'inventory',
    quantity: -2,
    date: '2025-03-05',
    documentNumber: 'IN/2025/03/001',
    user: 'Jan Nowak',
    description: 'Korekta stanu po inwentaryzacji',
    targetLocation: 'F1-01',
    status: 'completed',
    totalValue: -6400
  },
  {
    id: 1012,
    itemId: 10,
    type: 'receipt',
    quantity: 3,
    date: '2025-03-06',
    documentNumber: 'PZ/2025/03/005',
    user: 'Tomasz Wiśniewski',
    description: 'Dostawa od Marine Motors Sp. z o.o.',
    targetLocation: 'A1-02',
    supplier: 'Marine Motors Sp. z o.o.',
    status: 'pending',
    externalDocument: 'ZAM/2025/03/022',
    totalValue: 54000
  }
];

// Przykładowe dostawcy
export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  address?: string;
  nip?: string;
}

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Marine Motors Sp. z o.o.',
    contact: '+48 123 456 789',
    email: 'kontakt@marinemotors.pl',
    address: 'ul. Portowa 15, 80-001 Gdańsk',
    nip: '1234567890'
  },
  {
    id: 2,
    name: 'Yacht Parts S.A.',
    contact: '+48 987 654 321',
    email: 'info@yachtparts.com',
    address: 'ul. Stoczniowa 7, 70-001 Szczecin',
    nip: '0987654321'
  },
  {
    id: 3,
    name: 'ElectroNautic',
    contact: '+48 111 222 333',
    email: 'sales@electronautic.eu',
    address: 'ul. Elektroniczna 9, 81-001 Gdynia',
    nip: '5556667770'
  },
  {
    id: 4,
    name: 'BoatSupplies',
    contact: '+48 444 555 666',
    email: 'office@boatsupplies.pl',
    address: 'ul. Dostawcza 3, 72-001 Koszalin',
    nip: '1112223330'
  },
];

// Odbiorcy
export interface Buyer {
  id: number;
  name: string;
  contact: string;
  email: string;
  address?: string;
  nip?: string;
}

export const mockBuyers: Buyer[] = [
  {
    id: 1,
    name: 'Super Yachts Sp. z o.o.',
    contact: '+48 222 333 444',
    email: 'biuro@superyachts.pl',
    address: 'ul. Żeglarska 12, 80-001 Gdańsk',
    nip: '9998887770'
  },
  {
    id: 2,
    name: 'Water Sports Center',
    contact: '+48 333 444 555',
    email: 'kontakt@watersports.com',
    address: 'ul. Sportowa 8, 70-001 Kołobrzeg',
    nip: '8887776660'
  },
  {
    id: 3,
    name: 'Marina Nautical',
    contact: '+48 555 666 777',
    email: 'info@marinanautical.pl',
    address: 'ul. Portowa 22, 80-001 Gdynia',
    nip: '7776665550'
  }
];

// Magazyny
export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address?: string;
  isActive: boolean;
}

export const mockWarehouses: Warehouse[] = [
  {
    id: 1,
    code: 'MAG-01',
    name: 'Magazyn główny',
    address: 'ul. Produkcyjna 1, 80-001 Gdańsk',
    isActive: true
  },
  {
    id: 2,
    code: 'MAG-02',
    name: 'Magazyn produkcyjny',
    address: 'ul. Produkcyjna 1, 80-001 Gdańsk',
    isActive: true
  },
  {
    id: 3,
    code: 'MAG-03',
    name: 'Magazyn wysyłkowy',
    address: 'ul. Produkcyjna 1, 80-001 Gdańsk',
    isActive: true
  },
  {
    id: 4,
    code: 'MAG-04',
    name: 'Magazyn zewnętrzny',
    address: 'ul. Spedycyjna 5, 81-001 Gdynia',
    isActive: true
  }
];

// Pobieranie operacji dla elementu
export const getItemOperations = (itemId: number): InventoryOperation[] => {
  return mockOperations.filter(op => op.itemId === itemId);
};

// Pobieranie wszystkich operacji
export const getAllOperations = (): InventoryOperation[] => {
  return mockOperations;
};

// Pobieranie operacji wg ID
export const getOperationById = (id: number): InventoryOperation | undefined => {
  return mockOperations.find(op => op.id === id);
};

// Pobieranie dostawcy wg nazwy
export const getSupplierByName = (name: string): Supplier | undefined => {
  return mockSuppliers.find(s => s.name === name);
};

// Pobieranie odbiorcy wg nazwy
export const getBuyerByName = (name: string): Buyer | undefined => {
  return mockBuyers.find(b => b.name === name);
};

// Generowanie numeru dokumentu
export const generateDocumentNumber = (type: string): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  let prefix = '';
  switch (type) {
    case 'receipt':
      prefix = 'PZ';
      break;
    case 'issue':
      prefix = 'WZ';
      break;
    case 'internal_receipt':
      prefix = 'PW';
      break;
    case 'internal_issue':
      prefix = 'RW';
      break;
    case 'transfer':
      prefix = 'MM';
      break;
    case 'inventory':
      prefix = 'IN';
      break;
    default:
      prefix = 'DOK';
  }
  
  // Get last document number for this type and increment
  const lastDoc = mockOperations
    .filter(op => op.type === type)
    .map(op => op.documentNumber)
    .sort()
    .pop();
  
  let counter = 1;
  if (lastDoc) {
    const parts = lastDoc.split('/');
    if (parts.length === 4) {
      counter = parseInt(parts[3]) + 1;
    }
  }
  
  return `${prefix}/${year}/${month}/${String(counter).padStart(3, '0')}`;
};
