/**
 * Testy dla hooka useBomDragValidation
 * 
 * Testują funkcjonalność hooka do walidacji operacji drag-and-drop w strukturze BOM.
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { useBomDragValidation } from '../useBomDragValidation';

// Mock dla BomValidationService używany w hooku
jest.mock('@/services/BomValidationService', () => ({
  validateMove: jest.fn((sourceId, targetId) => {
    // Prosta implementacja zwracająca różne wyniki w zależności od parametrów
    if (sourceId === targetId) {
      return { isValid: false, errors: ['Nie można przenieść do samego siebie'], warnings: [] };
    }
    
    if (sourceId === 'invalidSource' || targetId === 'invalidTarget') {
      return { isValid: false, errors: ['Niedozwolona operacja'], warnings: [] };
    }
    
    if (sourceId === 'warningSource' || targetId === 'warningTarget') {
      return { isValid: true, errors: [], warnings: ['Operacja może powodować problemy'] };
    }
    
    return { isValid: true, errors: [], warnings: [] };
  })
}));

describe('useBomDragValidation', () => {
  // Mock struktury BOM do testów
  const mockBomItems = [
    {
      id: 'item1',
      name: 'Item 1',
      type: 'assembly',
      parentId: null,
      children: [
        {
          id: 'item2',
          name: 'Item 2',
          type: 'subassembly',
          parentId: 'item1'
        }
      ]
    },
    {
      id: 'item3',
      name: 'Item 3',
      type: 'assembly',
      parentId: null
    },
    {
      id: 'invalidSource',
      name: 'Invalid Source',
      type: 'assembly',
      parentId: null
    },
    {
      id: 'invalidTarget',
      name: 'Invalid Target',
      type: 'assembly',
      parentId: null
    },
    {
      id: 'warningSource',
      name: 'Warning Source',
      type: 'assembly',
      parentId: null
    },
    {
      id: 'warningTarget',
      name: 'Warning Target',
      type: 'assembly',
      parentId: null
    }
  ];

  // Test 1: Początkowy stan hooka
  test('powinien mieć prawidłowy stan początkowy', () => {
    const { result } = renderHook(() => useBomDragValidation(mockBomItems));
    
    expect(result.current.draggedItem).toBeNull();
    expect(result.current.validDropTargets.size).toBe(0);
    expect(result.current.invalidDropTargets.size).toBe(0);
    expect(result.current.validationResult).toBeNull();
  });

  // Test 2: Obsługa rozpoczęcia drag
  test('powinien aktualizować stan po rozpoczęciu przeciągania', () => {
    const { result } = renderHook(() => useBomDragValidation(mockBomItems));
    
    const dragItem = {
      id: 'item2',
      type: 'subassembly',
      parentId: 'item1',
      index: 0,
      depth: 1
    };
    
    act(() => {
      result.current.handleDragStart(dragItem);
    });
    
    expect(result.current.draggedItem).toEqual(dragItem);
    expect(result.current.validDropTargets.size).toBeGreaterThan(0);
    expect(result.current.invalidDropTargets.has('item2')).toBe(true); // nie można przenieść do samego siebie
  });

  // Test 3: Walidacja poprawnego celu
  test('powinien zwracać true dla prawidłowego celu przeniesienia', () => {
    const { result } = renderHook(() => useBomDragValidation(mockBomItems));
    
    act(() => {
      result.current.handleDragStart({
        id: 'item2',
        type: 'subassembly',
        parentId: 'item1',
        index: 0,
        depth: 1
      });
    });
    
    expect(result.current.isValidDropTarget('item3')).toBe(true);
  });

  // Test 4: Walidacja niepoprawnego celu
  test('powinien zwracać false dla nieprawidłowego celu przeniesienia', () => {
    const { result } = renderHook(() => useBomDragValidation(mockBomItems));
    
    act(() => {
      result.current.handleDragStart({
        id: 'item2',
        type: 'subassembly',
        parentId: 'item1',
        index: 0,
        depth: 1
      });
    });
    
    expect(result.current.isValidDropTarget('invalidTarget')).toBe(false);
  });

  // Test 5: Pełna walidacja operacji
  test('powinien przeprowadzać pełną walidację operacji', () => {
    const { result } = renderHook(() => useBomDragValidation(mockBomItems));
    
    const validationResult = result.current.validateDrop('item2', 'item3');
    
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors.length).toBe(0);
    expect(validationResult.warnings.length).toBe(0);
  });

  // Test 6: Pełna walidacja niepoprawnej operacji
  test('powinien wykrywać niepoprawne operacje podczas pełnej walidacji', () => {
    const { result } = renderHook(() => useBomDragValidation(mockBomItems));
    
    const validationResult = result.current.validateDrop('invalidSource', 'item3');
    
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors.length).toBeGreaterThan(0);
  });

  // Test 7: Wykrywanie ostrzeżeń
  test('powinien wykrywać ostrzeżenia podczas walidacji', () => {
    const { result } = renderHook(() => useBomDragValidation(mockBomItems));
    
    const validationResult = result.current.validateDrop('warningSource', 'item3');
    
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.warnings.length).toBeGreaterThan(0);
  });

  // Test 8: Zakończenie operacji drag
  test('powinien resetować stan po zakończeniu przeciągania', () => {
    const { result } = renderHook(() => useBomDragValidation(mockBomItems));
    
    act(() => {
      result.current.handleDragStart({
        id: 'item2',
        type: 'subassembly',
        parentId: 'item1',
        index: 0,
        depth: 1
      });
    });
    
    expect(result.current.draggedItem).not.toBeNull();
    
    act(() => {
      result.current.handleDragEnd();
    });
    
    expect(result.current.draggedItem).toBeNull();
    expect(result.current.validDropTargets.size).toBe(0);
    expect(result.current.invalidDropTargets.size).toBe(0);
  });
});
