/**
 * Testy wydajnościowe dla operacji na strukturach BOM
 * 
 * Ten plik zawiera testy mierzące wydajność krytycznych operacji na dużych strukturach BOM.
 * Pozwala to identyfikować wąskie gardła i weryfikować skuteczność optymalizacji.
 */

import BomValidationService from '../BomValidationService';

/**
 * Funkcja pomocnicza do generowania dużej struktury BOM do testów
 * @param size Liczba elementów do wygenerowania
 * @param depth Maksymalna głębokość struktury
 * @returns Wygenerowana struktura BOM
 */
function generateLargeBomStructure(size: number, depth: number = 5) {
  const items: any[] = [];
  
  // Generuje identyfikator elementu
  const generateId = (prefix: string, index: number) => `${prefix}_${index}`;
  
  // Generuje element BOM
  const generateItem = (index: number, level: number, parentId: string | null) => {
    const id = generateId('item', index);
    const type = level === 0 ? 'assembly' : 
                 level === 1 ? 'subassembly' : 
                 level === depth - 1 ? 'material' : 'part';
    
    return {
      id,
      name: `Element ${index}`,
      type,
      parentId,
      children: []
    };
  };
  
  // Rekurencyjnie generuje strukturę drzewa
  const generateTree = (parentItem: any, level: number, itemsLeft: number, maxChildrenPerNode: number): number => {
    if (level >= depth || itemsLeft <= 0) return 0;
    
    const childrenCount = Math.min(
      Math.max(1, Math.floor(Math.random() * maxChildrenPerNode)), 
      itemsLeft
    );
    let generatedItems = 0;
    
    for (let i = 0; i < childrenCount && generatedItems < itemsLeft; i++) {
      const itemIndex = size - itemsLeft + generatedItems;
      const item = generateItem(itemIndex, level, parentItem ? parentItem.id : null);
      
      if (parentItem) {
        parentItem.children.push(item);
      } else {
        items.push(item);
      }
      
      generatedItems++;
      
      // Rekurencyjnie generuje dzieci dla tego elementu
      const childrenGenerated = generateTree(
        item, 
        level + 1, 
        itemsLeft - generatedItems,
        maxChildrenPerNode / 2
      );
      
      generatedItems += childrenGenerated;
    }
    
    return generatedItems;
  };
  
  // Generuje strukturę
  let remaining = size;
  const rootCount = Math.min(Math.floor(size / 10) + 1, 10);
  
  for (let i = 0; i < rootCount && remaining > 0; i++) {
    const rootItem = generateItem(i, 0, null);
    items.push(rootItem);
    remaining--;
    
    const maxChildrenPerNode = Math.floor((remaining) / (depth - 1) / rootCount) + 1;
    const generated = generateTree(rootItem, 1, remaining, maxChildrenPerNode);
    remaining -= generated;
  }
  
  return items;
}

describe('BomValidationService Performance', () => {
  // Różne rozmiary struktur BOM do testów
  const smallStructure = generateLargeBomStructure(100);
  const mediumStructure = generateLargeBomStructure(500);
  const largeStructure = generateLargeBomStructure(1000);
  
  // Test wydajności walidacji przeniesienia elementu
  test('walidacja przeniesienia pojedynczego elementu', () => {
    // Definiujemy element źródłowy i docelowy
    const sourceId = smallStructure[0].children[0].id;
    const targetId = smallStructure[1].id;
    
    // Mierzymy czas wykonania funkcji walidacji
    const startTime = performance.now();
    const result = BomValidationService.validateMove(sourceId, targetId, smallStructure);
    const endTime = performance.now();
    
    // Wypisujemy czas wykonania dla analizy
    console.log(`Czas walidacji przeniesienia dla małej struktury: ${endTime - startTime} ms`);
    
    // Sprawdzamy, czy wynik jest poprawny
    expect(result).toBeDefined();
    expect(typeof result.isValid).toBe('boolean');
  });
  
  // Test wydajności na średniej strukturze
  test('walidacja przeniesienia na średniej strukturze BOM', () => {
    const sourceId = mediumStructure[0].children[0].id;
    const targetId = mediumStructure[1].id;
    
    const startTime = performance.now();
    const result = BomValidationService.validateMove(sourceId, targetId, mediumStructure);
    const endTime = performance.now();
    
    console.log(`Czas walidacji przeniesienia dla średniej struktury: ${endTime - startTime} ms`);
    expect(result).toBeDefined();
  });
  
  // Test wydajności na dużej strukturze
  test('walidacja przeniesienia na dużej strukturze BOM', () => {
    const sourceId = largeStructure[0].children[0].id;
    const targetId = largeStructure[1].id;
    
    const startTime = performance.now();
    const result = BomValidationService.validateMove(sourceId, targetId, largeStructure);
    const endTime = performance.now();
    
    console.log(`Czas walidacji przeniesienia dla dużej struktury: ${endTime - startTime} ms`);
    expect(result).toBeDefined();
    
    // Dla dużych struktur czas nie powinien przekraczać rozsądnych granic
    // (wartość może wymagać dostosowania w zależności od środowiska)
    expect(endTime - startTime).toBeLessThan(500); // maksymalny akceptowalny czas w ms
  });
  
  // Test wydajności pełnej walidacji struktury
  test('pełna walidacja struktury BOM', () => {
    // Wykonujemy pełną walidację dla różnych rozmiarów struktur
    
    const startSmall = performance.now();
    const resultSmall = BomValidationService.validateFullBom(smallStructure);
    const endSmall = performance.now();
    
    console.log(`Czas pełnej walidacji małej struktury: ${endSmall - startSmall} ms`);
    expect(resultSmall).toBeDefined();
    
    const startMedium = performance.now();
    const resultMedium = BomValidationService.validateFullBom(mediumStructure);
    const endMedium = performance.now();
    
    console.log(`Czas pełnej walidacji średniej struktury: ${endMedium - startMedium} ms`);
    expect(resultMedium).toBeDefined();
    
    const startLarge = performance.now();
    const resultLarge = BomValidationService.validateFullBom(largeStructure);
    const endLarge = performance.now();
    
    console.log(`Czas pełnej walidacji dużej struktury: ${endLarge - startLarge} ms`);
    expect(resultLarge).toBeDefined();
    
    // Sprawdzamy, czy czas rośnie liniowo z rozmiarem struktury
    // (może wymagać dostosowania w zależności od algorytmu i specyfiki struktury)
    const smallTime = endSmall - startSmall;
    const mediumTime = endMedium - startMedium;
    const largeTime = endLarge - startLarge;
    
    // Dla referencji - sprawdzamy, czy wzrost czasu jest mniejszy niż wykładniczy
    // (skalowanie powinno być bliżej liniowego O(n) niż kwadratowego O(n²))
    const mediumRatio = mediumTime / smallTime;
    const largeRatio = largeTime / mediumTime;
    const sizeRatio = largeStructure.length / mediumStructure.length;
    
    console.log(`Stosunek czasu medium/small: ${mediumRatio}`);
    console.log(`Stosunek czasu large/medium: ${largeRatio}`);
    console.log(`Stosunek rozmiaru large/medium: ${sizeRatio}`);
    
    // Jeśli algorytm jest liniowy, stosunek czasu powinien być zbliżony do stosunku rozmiaru
    expect(largeRatio).toBeLessThan(sizeRatio * 2); // Dajemy pewien margines
  });
  
  // Test sprawdzający czas znajdowania elementu po ID
  test('wydajność znajdowania elementu po ID', () => {
    // Tutaj wywołujemy prywatną metodę, więc będziemy mierzyć pośrednio przez validateMove
    
    // Losowe ID z różnych poziomów struktury
    const randomDeepId = largeStructure[0].children[0].children[0].id;
    
    const startTime = performance.now();
    
    // Wykorzystujemy funkcję validateMove, która wewnętrznie wywołuje findItemById
    const result = BomValidationService.validateMove(randomDeepId, largeStructure[1].id, largeStructure);
    
    const endTime = performance.now();
    
    console.log(`Czas znajdowania elementu po ID w dużej strukturze: ${endTime - startTime} ms`);
    expect(result).toBeDefined();
  });
});
