/**
 * Testy dla komponentu BomErrorModal
 * 
 * Testują wyświetlanie modalnego okna błędów walidacji struktury BOM.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BomErrorModal from '../BomErrorModal';
import { ValidationResult } from '@/services/BomValidationService';

describe('BomErrorModal', () => {
  // Mock funkcji onClose
  const mockOnClose = jest.fn();
  
  // Przykładowe dane walidacji
  const errorValidation: ValidationResult = {
    isValid: false,
    errors: ['Nie można przenieść elementu do samego siebie', 'Operacja spowodowałaby cykl w strukturze'],
    warnings: []
  };
  
  const warningValidation: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: ['Element będzie na dużej głębokości struktury', 'Operacja może wpłynąć na harmonogram produkcji']
  };
  
  const mixedValidation: ValidationResult = {
    isValid: false,
    errors: ['Niedozwolona relacja między typami elementów'],
    warnings: ['Element będzie na dużej głębokości struktury']
  };
  
  // Przykładowe elementy
  const sourceItem = {
    id: 'source123',
    name: 'Element źródłowy',
    type: 'subassembly'
  };
  
  const targetItem = {
    id: 'target456',
    name: 'Element docelowy',
    type: 'assembly'
  };
  
  // Resetowanie mocków przed każdym testem
  beforeEach(() => {
    mockOnClose.mockClear();
  });
  
  // Test 1: Komponent nie jest renderowany, gdy isOpen=false
  test('nie powinien być renderowany, gdy isOpen=false', () => {
    render(
      <BomErrorModal
        isOpen={false}
        onClose={mockOnClose}
        validationResult={errorValidation}
      />
    );
    
    // Sprawdzamy, czy modal nie jest renderowany
    const modalElement = screen.queryByText('Błąd walidacji BOM');
    expect(modalElement).not.toBeInTheDocument();
  });
  
  // Test 2: Renderowanie modalnego okna z błędami
  test('powinien renderować okno z błędami, gdy validationResult zawiera błędy', () => {
    render(
      <BomErrorModal
        isOpen={true}
        onClose={mockOnClose}
        validationResult={errorValidation}
      />
    );
    
    // Sprawdzamy tytuł i zawartość
    expect(screen.getByText('Błąd walidacji BOM')).toBeInTheDocument();
    expect(screen.getByText('Nie można przenieść elementu do samego siebie')).toBeInTheDocument();
    expect(screen.getByText('Operacja spowodowałaby cykl w strukturze')).toBeInTheDocument();
  });
  
  // Test 3: Renderowanie okna z ostrzeżeniami
  test('powinien renderować okno z ostrzeżeniami, gdy validationResult zawiera tylko ostrzeżenia', () => {
    render(
      <BomErrorModal
        isOpen={true}
        onClose={mockOnClose}
        validationResult={warningValidation}
      />
    );
    
    // Sprawdzamy tytuł i zawartość
    expect(screen.getByText('Ostrzeżenie walidacji BOM')).toBeInTheDocument();
    expect(screen.getByText('Element będzie na dużej głębokości struktury')).toBeInTheDocument();
    expect(screen.getByText('Operacja może wpłynąć na harmonogram produkcji')).toBeInTheDocument();
    
    // Sprawdzamy obecność przycisku kontynuacji (tylko dla ostrzeżeń)
    expect(screen.getByText('Kontynuuj pomimo ostrzeżeń')).toBeInTheDocument();
  });
  
  // Test 4: Renderowanie okna z błędami i ostrzeżeniami
  test('powinien renderować okno z błędami i ostrzeżeniami, gdy validationResult zawiera oba', () => {
    render(
      <BomErrorModal
        isOpen={true}
        onClose={mockOnClose}
        validationResult={mixedValidation}
      />
    );
    
    // Sprawdzamy tytuł i zawartość
    expect(screen.getByText('Błąd walidacji BOM')).toBeInTheDocument(); // Priorytet mają błędy
    expect(screen.getByText('Niedozwolona relacja między typami elementów')).toBeInTheDocument();
    expect(screen.getByText('Element będzie na dużej głębokości struktury')).toBeInTheDocument();
    
    // Sprawdzamy brak przycisku kontynuacji (przy błędach nie powinno być możliwości kontynuacji)
    expect(screen.queryByText('Kontynuuj pomimo ostrzeżeń')).not.toBeInTheDocument();
  });
  
  // Test 5: Wyświetlanie szczegółów operacji
  test('powinien wyświetlać szczegóły operacji, gdy sourceItem i targetItem są przekazane', () => {
    render(
      <BomErrorModal
        isOpen={true}
        onClose={mockOnClose}
        validationResult={errorValidation}
        sourceItem={sourceItem}
        targetItem={targetItem}
      />
    );
    
    // Sprawdzamy, czy szczegóły operacji są wyświetlane
    expect(screen.getByText('Szczegóły operacji')).toBeInTheDocument();
    expect(screen.getByText('Element źródłowy')).toBeInTheDocument();
    expect(screen.getByText('Element docelowy')).toBeInTheDocument();
    
    // Sprawdzamy informacje o typach
    expect(screen.getByText('(subassembly)')).toBeInTheDocument();
    expect(screen.getByText('(assembly)')).toBeInTheDocument();
  });
  
  // Test 6: Wywołanie funkcji onClose po kliknięciu przycisku "Zamknij"
  test('powinien wywołać onClose po kliknięciu przycisku "Zamknij"', () => {
    render(
      <BomErrorModal
        isOpen={true}
        onClose={mockOnClose}
        validationResult={errorValidation}
      />
    );
    
    // Kliknięcie przycisku "Zamknij"
    fireEvent.click(screen.getByText('Zamknij'));
    
    // Sprawdzenie, czy onClose zostało wywołane
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  // Test 7: Wywołanie funkcji onClose po kliknięciu przycisku "Kontynuuj pomimo ostrzeżeń"
  test('powinien wywołać onClose po kliknięciu przycisku "Kontynuuj pomimo ostrzeżeń"', () => {
    render(
      <BomErrorModal
        isOpen={true}
        onClose={mockOnClose}
        validationResult={warningValidation}
      />
    );
    
    // Kliknięcie przycisku "Kontynuuj pomimo ostrzeżeń"
    fireEvent.click(screen.getByText('Kontynuuj pomimo ostrzeżeń'));
    
    // Sprawdzenie, czy onClose zostało wywołane
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
