// Typ dla operacji magazynowych
export interface InventoryOperation {
  id: number;
  itemId: number;
  type: 'receipt' | 'issue' | 'transfer' | 'adjustment';
  quantity: number;
  date: string;
  documentNumber: string;
  user: string;
  description?: string;
  sourceLocation?: string;
  targetLocation?: string;
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
    targetLocation: 'A1-01'
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
    sourceLocation: 'A1-01'
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
    targetLocation: 'A1-03'
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
    targetLocation: 'A1-01'
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
    targetLocation: 'B2-03'
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
    sourceLocation: 'B2-03'
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
    targetLocation: 'C1-02'
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
    sourceLocation: 'C1-02'
  }
];

// Przykładowe produkty, w których używane są elementy magazynowe
export interface Product {
  id: number;
  name: string;
  modelNumber: string;
  category: string;
  usedItems: {
    itemId: number;
    quantity: number;
  }[];
}

export const mockProducts: Product[] = [
  {
    id: 101,
    name: 'Łódź Classic 180',
    modelNumber: 'CL-180',
    category: 'Motorowe',
    usedItems: [
      { itemId: 1, quantity: 1 },  // Silnik podwieszany 40KM
      { itemId: 2, quantity: 1 },  // Kadłub 18ft Classic
      { itemId: 3, quantity: 1 },  // Konsola sterowa Standard
      { itemId: 4, quantity: 1 },  // Zbiornik paliwa 100L
      { itemId: 6, quantity: 1 },  // Akumulator 120Ah
      { itemId: 7, quantity: 1 }   // Oświetlenie LED nawigacyjne
    ]
  },
  {
    id: 102,
    name: 'Łódź Sport 210',
    modelNumber: 'SP-210',
    category: 'Motorowe',
    usedItems: [
      { itemId: 10, quantity: 1 }, // Silnik podwieszany 60KM
      { itemId: 11, quantity: 1 }, // Kadłub 21ft Sport
      { itemId: 3, quantity: 1 },  // Konsola sterowa Standard
      { itemId: 4, quantity: 1 },  // Zbiornik paliwa 100L
      { itemId: 6, quantity: 1 },  // Akumulator 120Ah
      { itemId: 7, quantity: 1 },  // Oświetlenie LED nawigacyjne
      { itemId: 8, quantity: 1 }   // Nawigacja GPS morska
    ]
  },
  {
    id: 103,
    name: 'Łódź Luxury 250',
    modelNumber: 'LX-250',
    category: 'Motorowe',
    usedItems: [
      { itemId: 10, quantity: 1 }, // Silnik podwieszany 60KM
      { itemId: 11, quantity: 1 }, // Kadłub 21ft Sport
      { itemId: 3, quantity: 1 },  // Konsola sterowa Standard
      { itemId: 4, quantity: 2 },  // Zbiornik paliwa 100L (2 szt.)
      { itemId: 5, quantity: 1 },  // Zestaw tapicerski Premium
      { itemId: 6, quantity: 1 },  // Akumulator 120Ah
      { itemId: 7, quantity: 1 },  // Oświetlenie LED nawigacyjne
      { itemId: 8, quantity: 1 },  // Nawigacja GPS morska
      { itemId: 12, quantity: 1 }  // Układ sterowania hydrauliczny
    ]
  }
];

// Przykładowe dokumenty powiązane z elementami magazynowymi
export interface Document {
  id: number;
  itemId: number;
  name: string;
  type: 'manual' | 'certificate' | 'invoice' | 'specification' | 'drawing';
  fileUrl: string;
  uploadDate: string;
  uploadedBy: string;
}

export const mockDocuments: Document[] = [
  {
    id: 1,
    itemId: 1,
    name: 'Instrukcja obsługi silnika 40KM.pdf',
    type: 'manual',
    fileUrl: '/documents/manual_engine_40km.pdf',
    uploadDate: '2025-01-15',
    uploadedBy: 'Jan Nowak'
  },
  {
    id: 2,
    itemId: 1,
    name: 'Certyfikat CE silnika.pdf',
    type: 'certificate',
    fileUrl: '/documents/certificate_engine_40km.pdf',
    uploadDate: '2025-01-15',
    uploadedBy: 'Jan Nowak'
  },
  {
    id: 3,
    itemId: 1,
    name: 'Faktura zakupu FV/2025/01/022.pdf',
    type: 'invoice',
    fileUrl: '/documents/invoice_engine_40km.pdf',
    uploadDate: '2025-01-15',
    uploadedBy: 'Anna Kowalska'
  },
  {
    id: 4,
    itemId: 2,
    name: 'Specyfikacja kadłuba 18ft.pdf',
    type: 'specification',
    fileUrl: '/documents/spec_hull_18ft.pdf',
    uploadDate: '2025-01-20',
    uploadedBy: 'Jan Nowak'
  },
  {
    id: 5,
    itemId: 2,
    name: 'Rysunek techniczny kadłuba.dwg',
    type: 'drawing',
    fileUrl: '/documents/drawing_hull_18ft.dwg',
    uploadDate: '2025-01-20',
    uploadedBy: 'Tomasz Wiśniewski'
  }
];

// Funkcja pomocnicza do pobierania historii operacji dla danego elementu
export const getItemOperations = (itemId: number): InventoryOperation[] => {
  return mockOperations.filter(op => op.itemId === itemId);
};

// Funkcja pomocnicza do pobierania produktów, w których używany jest dany element
export const getItemProducts = (itemId: number): Product[] => {
  return mockProducts.filter(product => 
    product.usedItems.some(item => item.itemId === itemId)
  );
};

// Funkcja pomocnicza do pobierania dokumentów powiązanych z danym elementem
export const getItemDocuments = (itemId: number): Document[] => {
  return mockDocuments.filter(doc => doc.itemId === itemId);
};
