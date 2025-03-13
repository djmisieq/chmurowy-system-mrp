// BomValidationService.ts
// Serwis odpowiedzialny za walidację operacji na strukturze BOM

interface BomItem {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  children?: BomItem[];
  [key: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Interfejs mapy elementów BOM dla szybkiego dostępu po ID
interface BomItemMap {
  [id: string]: {
    item: BomItem;
    depth: number;
    path: string[];
  }
}

export class BomValidationService {
  // Bufor mapujący elementy po ID dla ostatnio walidowanej struktury BOM
  private static lastBomStructureHash: string = '';
  private static itemCache: BomItemMap = {};
  
  /**
   * Generuje prosty skrót z tablicy elementów BOM
   * do sprawdzenia, czy struktura się zmieniła i trzeba zbudować nowy bufor
   */
  private static generateBomHash(bomItems: BomItem[]): string {
    return bomItems.map(item => item.id).join('|');
  }
  
  /**
   * Przygotowuje bufor elementów BOM do szybkiego wyszukiwania
   * @param bomItems Struktura BOM
   * @returns Mapa elementów indeksowana po ID
   */
  private static prepareBomItemMap(bomItems: BomItem[]): BomItemMap {
    const itemMap: BomItemMap = {};
    
    // Rekurencyjnie buduje mapę z informacją o głębokości i ścieżce
    const buildMap = (
      items: BomItem[], 
      depth: number = 0, 
      path: string[] = []
    ) => {
      for (const item of items) {
        const itemPath = [...path, item.id];
        itemMap[item.id] = {
          item,
          depth,
          path: itemPath
        };
        
        if (item.children && item.children.length > 0) {
          buildMap(item.children, depth + 1, itemPath);
        }
      }
    };
    
    buildMap(bomItems);
    return itemMap;
  }
  
  /**
   * Aktualizuje bufor elementów, jeśli struktura BOM się zmieniła
   * @param bomItems Struktura BOM
   */
  private static updateItemCacheIfNeeded(bomItems: BomItem[]): void {
    const bomHash = this.generateBomHash(bomItems);
    if (bomHash !== this.lastBomStructureHash) {
      this.itemCache = this.prepareBomItemMap(bomItems);
      this.lastBomStructureHash = bomHash;
    }
  }
  
  /**
   * Szybkie znajdowanie elementu po ID przy użyciu buforowanej mapy
   * @param id ID elementu do znalezienia
   * @param bomItems Struktura BOM (używana do aktualizacji bufora, jeśli potrzeba)
   * @returns Znaleziony element lub null
   */
  private static findItemById(id: string, bomItems: BomItem[]): BomItem | null {
    this.updateItemCacheIfNeeded(bomItems);
    
    const cached = this.itemCache[id];
    return cached ? cached.item : null;
  }
  
  /**
   * Sprawdza czy można przenieść element do innego elementu w strukturze BOM
   * @param sourceId ID elementu który przenosimy
   * @param targetId ID elementu docelowego
   * @param bomItems Pełna struktura BOM
   * @returns Wynik walidacji
   */
  static validateMove(sourceId: string, targetId: string, bomItems: BomItem[]): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };
    
    // Aktualizacja bufora dla szybkiego dostępu
    this.updateItemCacheIfNeeded(bomItems);
    
    // Nie można przenieść elementu do samego siebie
    if (sourceId === targetId) {
      result.isValid = false;
      result.errors.push('Nie można przenieść elementu do samego siebie');
      return result;
    }
    
    // Szybkie sprawdzenie czy elementy istnieją
    const sourceCached = this.itemCache[sourceId];
    const targetCached = this.itemCache[targetId];
    
    if (!sourceCached) {
      result.isValid = false;
      result.errors.push('Element źródłowy nie został znaleziony');
      return result;
    }
    
    if (!targetCached) {
      result.isValid = false;
      result.errors.push('Element docelowy nie został znaleziony');
      return result;
    }
    
    const source = sourceCached.item;
    const target = targetCached.item;
    
    // Sprawdzenie czy operacja nie tworzy cyklu - używając buforowanych ścieżek
    // Element nie może być przeniesiony do swojego potomka
    if (targetCached.path.includes(sourceId)) {
      result.isValid = false;
      result.errors.push('Ta operacja spowodowałaby cykl w strukturze BOM');
      return result;
    }
    
    // Walidacja typów elementów (reguły biznesowe)
    if (!this.validateTypes(source, target)) {
      result.isValid = false;
      result.errors.push(`Element typu '${source.type}' nie może być częścią elementu typu '${target.type}'`);
      return result;
    }
    
    // Sprawdzenie maksymalnej głębokości
    const targetDepth = targetCached.depth;
    if (targetDepth >= 5) { // Przykładowy limit głębokości
      result.warnings.push('Ten element będzie znajdować się na dużej głębokości struktury, co może utrudnić zarządzanie');
    }
    
    return result;
  }
  
  /**
   * Waliduje czy elementy są kompatybilne typami
   * @param source Element źródłowy
   * @param target Element docelowy
   * @returns Czy operacja jest dozwolona
   */
  private static validateTypes(source: BomItem, target: BomItem): boolean {
    // Przykładowe reguły biznesowe
    switch (target.type) {
      case 'assembly':
        // Do zestawu można dodać wszystko
        return true;
      
      case 'subassembly':
        // Do podzespołu można dodać tylko części i materiały
        return ['part', 'material'].includes(source.type);
      
      case 'part':
        // Do części można dodać tylko materiały
        return source.type === 'material';
      
      case 'material':
        // Materiał nie może mieć dzieci
        return false;
      
      default:
        return true;
    }
  }
  
  /**
   * Waliduje pełną strukturę BOM w poszukiwaniu błędów
   * @param bomItems Struktura BOM do walidacji
   * @returns Wynik walidacji
   */
  static validateFullBom(bomItems: BomItem[]): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };
    
    // Aktualizacja buforowanej mapy
    this.updateItemCacheIfNeeded(bomItems);
    
    // Zbiór unikalnych ID
    const seenIds = new Set<string>();
    
    // Walidacja wszystkich elementów w buforze (już posiadamy informacje o głębokości)
    for (const id in this.itemCache) {
      const { item, depth } = this.itemCache[id];
      
      // Sprawdź unikalność ID
      if (seenIds.has(item.id)) {
        result.isValid = false;
        result.errors.push(`Duplikat ID: ${item.id} (${item.name})`);
      } else {
        seenIds.add(item.id);
      }
      
      // Sprawdź czy typ elementu jest dozwolony jako dziecko typu rodzica
      if (item.parentId) {
        const parent = this.itemCache[item.parentId]?.item;
        if (parent && !this.isValidParentChildTypePair(parent.type, item.type)) {
          result.isValid = false;
          result.errors.push(`Niedozwolona relacja: element typu '${item.type}' nie może być częścią elementu typu '${parent.type}'`);
        }
      }
      
      // Sprawdź maksymalną głębokość
      if (depth > 5) {
        result.warnings.push(`Element ${item.name} (${item.id}) jest na dużej głębokości struktury (${depth})`);
      }
      
      // Walidacja dzieci
      if (item.children && item.children.length) {
        if (item.type === 'material') {
          result.isValid = false;
          result.errors.push(`Materiał nie może mieć dzieci: ${item.name} (${item.id})`);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Sprawdza czy typ rodzica i dziecka tworzą dozwoloną relację
   * @param parentType Typ elementu rodzica
   * @param childType Typ elementu dziecka
   * @returns Czy relacja jest dozwolona
   */
  private static isValidParentChildTypePair(parentType: string, childType: string): boolean {
    // Implementacja reguł biznesowych analogiczna do validateTypes
    switch (parentType) {
      case 'assembly':
        return true;
      case 'subassembly':
        return ['part', 'material'].includes(childType);
      case 'part':
        return childType === 'material';
      case 'material':
        return false;
      default:
        return true;
    }
  }
  
  /**
   * Czyszczenie bufora (użyteczne np. przy testach)
   */
  static clearCache(): void {
    this.lastBomStructureHash = '';
    this.itemCache = {};
  }
}

export default BomValidationService;
