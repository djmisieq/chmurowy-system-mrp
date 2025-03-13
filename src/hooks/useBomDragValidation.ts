// useBomDragValidation.ts
// Hook do obsługi walidacji operacji drag-and-drop w strukturze BOM

import { useState, useCallback } from 'react';
import BomValidationService, { ValidationResult } from '@/services/BomValidationService';

interface BomItem {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  children?: BomItem[];
  [key: string]: any;
}

interface DragItem {
  id: string;
  type: string;
  parentId: string | null;
  index: number;
  depth: number;
}

interface UseBomDragValidationResult {
  draggedItem: DragItem | null;
  validDropTargets: Set<string>;
  invalidDropTargets: Set<string>;
  validationResult: ValidationResult | null;
  handleDragStart: (item: DragItem) => void;
  handleDragEnd: () => void;
  isValidDropTarget: (targetId: string) => boolean;
  validateDrop: (sourceId: string, targetId: string) => ValidationResult;
  prevalidateTarget: (targetId: string) => boolean;
}

/**
 * Hook do zarządzania walidacją operacji drag-and-drop w strukturze BOM
 * @param bomItems Aktualna struktura BOM
 * @returns Metody i stan do obsługi walidacji drag-and-drop
 */
export const useBomDragValidation = (bomItems: BomItem[]): UseBomDragValidationResult => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [validDropTargets, setValidDropTargets] = useState<Set<string>>(new Set());
  const [invalidDropTargets, setInvalidDropTargets] = useState<Set<string>>(new Set());
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  /**
   * Rozpoczęcie operacji przeciągania
   * @param item Element, który jest przeciągany
   */
  const handleDragStart = useCallback((item: DragItem) => {
    setDraggedItem(item);
    
    // Prewalidacja wszystkich potencjalnych celów upuszczenia
    const validTargets = new Set<string>();
    const invalidTargets = new Set<string>();
    
    // Funkcja do rekurencyjnego przeszukiwania drzewa i walidacji celów
    const validateTargets = (items: BomItem[]) => {
      for (const targetItem of items) {
        const result = BomValidationService.validateMove(item.id, targetItem.id, bomItems);
        
        if (result.isValid) {
          validTargets.add(targetItem.id);
        } else {
          invalidTargets.add(targetItem.id);
        }
        
        // Rekurencyjne sprawdzenie dzieci
        if (targetItem.children && targetItem.children.length) {
          validateTargets(targetItem.children);
        }
      }
    };
    
    validateTargets(bomItems);
    
    setValidDropTargets(validTargets);
    setInvalidDropTargets(invalidTargets);
  }, [bomItems]);
  
  /**
   * Zakończenie operacji przeciągania
   */
  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setValidDropTargets(new Set());
    setInvalidDropTargets(new Set());
    setValidationResult(null);
  }, []);
  
  /**
   * Sprawdza czy dany element jest prawidłowym celem upuszczenia
   * @param targetId ID elementu do sprawdzenia
   * @returns Czy element jest prawidłowym celem
   */
  const isValidDropTarget = useCallback((targetId: string): boolean => {
    return validDropTargets.has(targetId);
  }, [validDropTargets]);
  
  /**
   * Przeprowadza pełną walidację operacji przeciągnięcia
   * @param sourceId ID elementu źródłowego
   * @param targetId ID elementu docelowego
   * @returns Wynik walidacji
   */
  const validateDrop = useCallback((sourceId: string, targetId: string): ValidationResult => {
    const result = BomValidationService.validateMove(sourceId, targetId, bomItems);
    setValidationResult(result);
    return result;
  }, [bomItems]);
  
  /**
   * Szybka prewalidacja celu upuszczenia (bez pełnej analizy)
   * @param targetId ID elementu docelowego
   * @returns Czy element jest potencjalnie prawidłowym celem
   */
  const prevalidateTarget = useCallback((targetId: string): boolean => {
    if (!draggedItem) return false;
    
    // Nie można upuścić na samego siebie
    if (draggedItem.id === targetId) return false;
    
    // Szybkie sprawdzenie z wcześniej obliczonych zbiorów
    return validDropTargets.has(targetId);
  }, [draggedItem, validDropTargets]);
  
  return {
    draggedItem,
    validDropTargets,
    invalidDropTargets,
    validationResult,
    handleDragStart,
    handleDragEnd,
    isValidDropTarget,
    validateDrop,
    prevalidateTarget
  };
};

export default useBomDragValidation;
