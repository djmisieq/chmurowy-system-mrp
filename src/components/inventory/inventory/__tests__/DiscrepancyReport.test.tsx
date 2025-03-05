import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DiscrepancyReport from '../DiscrepancyReport';
import { mockInventories } from '../../mockInventory';
import { generateMockDiscrepancies } from '../../mockDiscrepancies';

// Mock funkcje do testów
const mockOnApproveCorrection = jest.fn();
const mockOnApproveAll = jest.fn();
const mockOnGenerateReport = jest.fn();
const mockOnSave = jest.fn();

describe('DiscrepancyReport Component', () => {
  // Przygotowanie danych testowych
  const mockInventory = mockInventories[0];
  const mockDiscrepancies = generateMockDiscrepancies(mockInventory.id).filter(item => item.difference !== 0);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the discrepancy report component', () => {
    render(
      <DiscrepancyReport
        inventory={mockInventory}
        discrepancies={mockDiscrepancies}
        onApproveCorrection={mockOnApproveCorrection}
        onApproveAll={mockOnApproveAll}
        onGenerateReport={mockOnGenerateReport}
        onSave={mockOnSave}
      />
    );

    // Sprawdź czy tytuł raportu jest widoczny
    expect(screen.getByText('Raport rozbieżności inwentaryzacyjnych')).toBeInTheDocument();
    
    // Sprawdź czy nazwa inwentaryzacji jest wyświetlana
    expect(screen.getByText(`Inwentaryzacja #${mockInventory.id} - ${mockInventory.name}`)).toBeInTheDocument();
    
    // Sprawdź czy przyciski akcji są wyświetlane
    expect(screen.getByText('Generuj raport PDF')).toBeInTheDocument();
    expect(screen.getByText('Zapisz zmiany')).toBeInTheDocument();
    expect(screen.getByText('Zatwierdź wszystkie korekty')).toBeInTheDocument();
  });

  test('displays correct statistics', () => {
    render(
      <DiscrepancyReport
        inventory={mockInventory}
        discrepancies={mockDiscrepancies}
        onApproveCorrection={mockOnApproveCorrection}
        onApproveAll={mockOnApproveAll}
        onGenerateReport={mockOnGenerateReport}
        onSave={mockOnSave}
      />
    );

    // Sprawdź karty statystyk
    expect(screen.getByText('Pozycje ogółem')).toBeInTheDocument();
    expect(screen.getByText('Z rozbieżnościami')).toBeInTheDocument();
    expect(screen.getByText('Nadwyżki')).toBeInTheDocument();
    expect(screen.getByText('Niedobory')).toBeInTheDocument();
    expect(screen.getByText('Zatwierdzone')).toBeInTheDocument();
    
    // Sprawdź liczby w statystykach
    expect(screen.getByText(mockDiscrepancies.length.toString())).toBeInTheDocument();
    
    // Sprawdź liczby nadwyżek/niedoborów
    const positiveDiscrepancies = mockDiscrepancies.filter(item => item.difference > 0).length;
    const negativeDiscrepancies = mockDiscrepancies.filter(item => item.difference < 0).length;
    
    expect(screen.getByText(positiveDiscrepancies.toString())).toBeInTheDocument();
    expect(screen.getByText(negativeDiscrepancies.toString())).toBeInTheDocument();
  });

  test('renders table with discrepancy data', () => {
    render(
      <DiscrepancyReport
        inventory={mockInventory}
        discrepancies={mockDiscrepancies}
        onApproveCorrection={mockOnApproveCorrection}
        onApproveAll={mockOnApproveAll}
        onGenerateReport={mockOnGenerateReport}
        onSave={mockOnSave}
      />
    );

    // Sprawdź czy nagłówki tabeli są wyświetlane
    expect(screen.getByText('Kod')).toBeInTheDocument();
    expect(screen.getByText('Nazwa')).toBeInTheDocument();
    expect(screen.getByText('Stan księgowy')).toBeInTheDocument();
    expect(screen.getByText('Stan faktyczny')).toBeInTheDocument();
    expect(screen.getByText('Różnica')).toBeInTheDocument();
    expect(screen.getByText('Różnica %')).toBeInTheDocument();
    expect(screen.getByText('Akcje')).toBeInTheDocument();
    
    // Sprawdź czy dane produktów są wyświetlane
    mockDiscrepancies.forEach(item => {
      expect(screen.getByText(item.code)).toBeInTheDocument();
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  test('calls onApproveCorrection when approve button is clicked', () => {
    render(
      <DiscrepancyReport
        inventory={mockInventory}
        discrepancies={mockDiscrepancies}
        onApproveCorrection={mockOnApproveCorrection}
        onApproveAll={mockOnApproveAll}
        onGenerateReport={mockOnGenerateReport}
        onSave={mockOnSave}
      />
    );

    // Znajdź i kliknij przycisk zatwierdzania dla pierwszego elementu
    const approveButton = screen.getAllByText('Zatwierdź korektę')[0];
    fireEvent.click(approveButton);
    
    // Sprawdź czy funkcja została wywołana z ID pierwszego elementu
    expect(mockOnApproveCorrection).toHaveBeenCalledWith(expect.any(Number));
  });

  test('calls onApproveAll when approve all button is clicked', () => {
    render(
      <DiscrepancyReport
        inventory={mockInventory}
        discrepancies={mockDiscrepancies}
        onApproveCorrection={mockOnApproveCorrection}
        onApproveAll={mockOnApproveAll}
        onGenerateReport={mockOnGenerateReport}
        onSave={mockOnSave}
      />
    );

    // Znajdź i kliknij przycisk zatwierdzania wszystkich korekt
    const approveAllButton = screen.getByText('Zatwierdź wszystkie korekty');
    fireEvent.click(approveAllButton);
    
    // Sprawdź czy funkcja została wywołana
    expect(mockOnApproveAll).toHaveBeenCalled();
  });

  test('calls onGenerateReport when generate report button is clicked', () => {
    render(
      <DiscrepancyReport
        inventory={mockInventory}
        discrepancies={mockDiscrepancies}
        onApproveCorrection={mockOnApproveCorrection}
        onApproveAll={mockOnApproveAll}
        onGenerateReport={mockOnGenerateReport}
        onSave={mockOnSave}
      />
    );

    // Znajdź i kliknij przycisk generowania raportu
    const generateReportButton = screen.getByText('Generuj raport PDF');
    fireEvent.click(generateReportButton);
    
    // Sprawdź czy funkcja została wywołana
    expect(mockOnGenerateReport).toHaveBeenCalled();
  });

  test('calls onSave when save button is clicked', () => {
    render(
      <DiscrepancyReport
        inventory={mockInventory}
        discrepancies={mockDiscrepancies}
        onApproveCorrection={mockOnApproveCorrection}
        onApproveAll={mockOnApproveAll}
        onGenerateReport={mockOnGenerateReport}
        onSave={mockOnSave}
      />
    );

    // Znajdź i kliknij przycisk zapisania zmian w stopce
    const saveButton = screen.getByText('Zapisz i zatwierdź raport');
    fireEvent.click(saveButton);
    
    // Sprawdź czy funkcja została wywołana
    expect(mockOnSave).toHaveBeenCalled();
  });

  test('shows approved state for approved corrections', () => {
    // Utwórz dane z zatwierdzonymi korektami
    const approvedDiscrepancies = mockDiscrepancies.map((item, index) => ({
      ...item,
      correctionApproved: index === 0 // Zatwierdź tylko pierwszy element
    }));

    render(
      <DiscrepancyReport
        inventory={mockInventory}
        discrepancies={approvedDiscrepancies}
        onApproveCorrection={mockOnApproveCorrection}
        onApproveAll={mockOnApproveAll}
        onGenerateReport={mockOnGenerateReport}
        onSave={mockOnSave}
      />
    );

    // Sprawdź czy pierwszy element pokazuje "Zatwierdzone"
    expect(screen.getByText('Zatwierdzone')).toBeInTheDocument();
    
    // Sprawdź czy pozostałe elementy mają przyciski "Zatwierdź korektę"
    expect(screen.getAllByText('Zatwierdź korektę').length).toBe(approvedDiscrepancies.filter(item => !item.correctionApproved && item.difference !== 0).length);
  });
});