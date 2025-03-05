import { InventoryItem } from './mockInventory';

/**
 * Interfejs dla pozycji z rozbieżnością inwentaryzacyjną
 */
export interface DiscrepancyItem extends InventoryItem {
  bookQuantity: number;
  actualQuantity: number;
  difference: number;
  differencePercent: number;
  differenceValue: number;
  correctionApproved?: boolean;
}

/**
 * Funkcja do generowania przykładowych danych rozbieżności dla inwentaryzacji
 * @param inventoryId Identyfikator inwentaryzacji
 * @returns Tablica obiektów z rozbieżnościami
 */
export const generateMockDiscrepancies = (inventoryId: number): DiscrepancyItem[] => {
  // Lista produktów na magazynie
  const products: Partial<DiscrepancyItem>[] = [
    { 
      id: 1, 
      code: 'SIL-001', 
      name: 'Silnik zaburtowy 40HP', 
      category: 'Napęd', 
      unit: 'szt', 
      price: 12500, 
      bookQuantity: 12
    },
    { 
      id: 2, 
      code: 'KAD-001', 
      name: 'Kadłub 5.5m', 
      category: 'Kadłuby', 
      unit: 'szt', 
      price: 28000, 
      bookQuantity: 4
    },
    { 
      id: 3, 
      code: 'STE-002', 
      name: 'Koło sterowe standard', 
      category: 'Sterowanie', 
      unit: 'szt', 
      price: 450, 
      bookQuantity: 25
    },
    { 
      id: 4, 
      code: 'SIE-001', 
      name: 'Siedzisko kapitańskie', 
      category: 'Wyposażenie', 
      unit: 'szt', 
      price: 750, 
      bookQuantity: 15
    },
    { 
      id: 5, 
      code: 'PAL-001', 
      name: 'Paliwo do testów', 
      category: 'Materiały', 
      unit: 'l', 
      price: 7.5, 
      bookQuantity: 120
    },
    { 
      id: 6, 
      code: 'FRB-001', 
      name: 'Farba biała podkładowa', 
      category: 'Materiały', 
      unit: 'l', 
      price: 65, 
      bookQuantity: 75
    },
    { 
      id: 7, 
      code: 'LAM-001', 
      name: 'Laminat - mata 450g', 
      category: 'Materiały', 
      unit: 'm2', 
      price: 35, 
      bookQuantity: 350
    },
    { 
      id: 8, 
      code: 'ZYW-001', 
      name: 'Żywica epoksydowa', 
      category: 'Materiały', 
      unit: 'kg', 
      price: 85, 
      bookQuantity: 180
    },
    { 
      id: 9, 
      code: 'LIN-001', 
      name: 'Linka cumownicza 10mm', 
      category: 'Wyposażenie', 
      unit: 'm', 
      price: 8.5, 
      bookQuantity: 250
    },
    { 
      id: 10, 
      code: 'POL-001', 
      name: 'Półka na elektronikę', 
      category: 'Wyposażenie', 
      unit: 'szt', 
      price: 120, 
      bookQuantity: 20
    },
    { 
      id: 11, 
      code: 'POM-001', 
      name: 'Pompa zęzowa automatyczna', 
      category: 'Napęd', 
      unit: 'szt', 
      price: 320, 
      bookQuantity: 18
    },
    { 
      id: 12, 
      code: 'NAR-001', 
      name: 'Narzędzia montażowe - zestaw', 
      category: 'Narzędzia', 
      unit: 'kpl', 
      price: 1200, 
      bookQuantity: 5
    }
  ];

  // Generowanie losowych rozbieżności
  return products.map(product => {
    // Definiowanie wzorca rozbieżności (dla danych demonstracyjnych)
    // W praktyce, te dane pochodziłyby z rzeczywistej inwentaryzacji
    let variation: number;
    
    if (product.id === 1) {
      variation = -1; // Silnik - brakuje 1 sztuki
    } else if (product.id === 3) {
      variation = 2;  // Koła sterowe - nadwyżka 2 sztuk
    } else if (product.id === 5) {
      variation = -15; // Paliwo - ubytki 15 litrów
    } else if (product.id === 7) {
      variation = -45; // Laminat - brakuje 45 m2
    } else if (product.id === 10) {
      variation = 3;  // Półki - nadwyżka 3 sztuk
    } else if (product.id === 12) {
      variation = -1; // Narzędzia - brakuje 1 kompletu
    } else {
      variation = 0;  // Reszta bez rozbieżności
    }

    const actualQuantity = product.bookQuantity! + variation;
    const difference = variation;
    const differencePercent = product.bookQuantity! !== 0 
      ? (difference / product.bookQuantity!) * 100 
      : 0;
    const differenceValue = difference * product.price!;
    
    return {
      ...product,
      quantity: product.bookQuantity,
      minQuantity: Math.floor(product.bookQuantity! * 0.3),
      maxQuantity: Math.floor(product.bookQuantity! * 1.7),
      location: generateLocation(product.category as string),
      actualQuantity,
      difference,
      differencePercent,
      differenceValue,
      correctionApproved: false
    } as DiscrepancyItem;
  });
};

/**
 * Pomocnicza funkcja do generowania lokalizacji dla produktu
 */
function generateLocation(category: string): string {
  const locations: Record<string, string[]> = {
    'Napęd': ['A12', 'A13', 'A14'],
    'Kadłuby': ['B01', 'B02'],
    'Sterowanie': ['A04', 'A05'],
    'Wyposażenie': ['C07', 'C08', 'C09'],
    'Materiały': ['D01', 'D02', 'D03', 'D04'],
    'Narzędzia': ['E01', 'E02']
  };

  const defaultLocations = ['X01', 'X02'];
  const locationsForCategory = locations[category] || defaultLocations;
  const randomIndex = Math.floor(Math.random() * locationsForCategory.length);
  
  return locationsForCategory[randomIndex];
}