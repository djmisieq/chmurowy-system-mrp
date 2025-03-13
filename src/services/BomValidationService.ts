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

export class BomValidationService {
  
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
    
    // Nie można przenieść elementu do samego siebie
    if (sourceId === targetId) {
      result.isValid = false;
      result.errors.push('Nie można przenieść elementu do samego siebie');
      return result;
    }
    
    // Znajdź elementy źródłowy i docelowy
    const source = this.findItemById(sourceId, bomItems);
    const target = this.findItemById(targetId, bomItems);
    
    if (!source) {
      result.isValid = false;
      result.errors.push('Element źródłowy nie został znaleziony');
      return result;
    }
    
    if (!target) {
      result.isValid = false;
      result.errors.push('Element docelowy nie został znaleziony');
      return result;
    }
    
    // Sprawdzenie czy operacja nie tworzy cyklu (element nie może być częścią samego siebie)
    if (this.isDescendant(source, targetId, bomItems)) {
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
    
    // Sprawdzenie maksymalnej głębokości (opcjonalne)
    const targetDepth = this.calculateDepth(target, bomItems);
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
   * Sprawdza czy element jest potomkiem innego elementu
   * @param item Element do sprawdzenia
   * @param potentialParentId ID potencjalnego rodzica
   * @param bomItems Pełna struktura BOM
   * @returns Czy element jest potomkiem
   */
  private static isDescendant(item: BomItem, potentialParentId: string, bomItems: BomItem[]): boolean {
    if (!potentialParentId) return false;
    
    // Znajdź ścieżkę do potencjalnego rodzica
    const path = this.findPathToItem(potentialParentId, bomItems);
    
    // Jeśli element źródłowy znajduje się na ścieżce, operacja spowodowałaby cykl
    return path.includes(item.id);
  }
  
  /**
   * Znajduje ścieżkę do elementu w strukturze BOM
   * @param itemId ID elementu do znalezienia
   * @param bomItems Struktura BOM do przeszukania
   * @param currentPath Aktualna ścieżka (używane rekurencyjnie)
   * @returns Tablica ID elementów tworzących ścieżkę
   */
  private static findPathToItem(
    itemId: string,
    bomItems: BomItem[],
    currentPath: string[] = []
  ): string[] {
    for (const item of bomItems) {
      const newPath = [...currentPath, item.id];
      
      if (item.id === itemId) {
        return newPath;
      }
      
      if (item.children && item.children.length) {
        const found = this.findPathToItem(itemId, item.children, newPath);
        if (found.length > 0) {
          return found;
        }
      }
    }
    
    return [];
  }
  
  /**
   * Oblicza głębokość elementu w strukturze BOM
   * @param item Element do sprawdzenia
   * @param bomItems Pełna struktura BOM
   * @returns Głębokość elementu (0 dla elementów najwyższego poziomu)
   */
  private static calculateDepth(item: BomItem, bomItems: BomItem[]): number {
    const path = this.findPathToItem(item.id, bomItems);
    return path.length - 1;
  }
  
  /**
   * Znajduje element po ID w strukturze BOM
   * @param id ID elementu do znalezienia
   * @param bomItems Struktura BOM do przeszukania
   * @returns Znaleziony element lub null
   */
  private static findItemById(id: string, bomItems: BomItem[]): BomItem | null {
    for (const item of bomItems) {
      if (item.id === id) {
        return item;
      }
      
      if (item.children && item.children.length) {
        const found = this.findItemById(id, item.children);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
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
    
    // Zbiór unikalnych ID
    const seenIds = new Set<string>();
    
    // Walidacja rekurencyjna
    const validateItem = (item: BomItem, depth: number, parentType: string | null) => {
      // Sprawdź unikalność ID
      if (seenIds.has(item.id)) {
        result.isValid = false;
        result.errors.push(`Duplikat ID: ${item.id} (${item.name})`);
      } else {
        seenIds.add(item.id);
      }
      
      // Sprawdź czy typ elementu jest dozwolony jako dziecko typu rodzica
      if (parentType && !this.isValidParentChildTypePair(parentType, item.type)) {
        result.isValid = false;
        result.errors.push(`Niedozwolona relacja: element typu '${item.type}' nie może być częścią elementu typu '${parentType}'`);
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
        
        for (const child of item.children) {
          validateItem(child, depth + 1, item.type);
        }
      }
    };
    
    // Rozpocznij walidację
    for (const item of bomItems) {
      validateItem(item, 0, null);
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
}

export default BomValidationService;
