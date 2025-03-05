// Dane testowe dla raportów magazynowych

import { mockInventoryItems } from './mockData';
import { mockCategories } from './mockCategories';
import { mockOperations } from './mockOperations';

// Typy raportów
export type ReportType = 
  | 'inventory_status' 
  | 'low_stock' 
  | 'inventory_value' 
  | 'turnover' 
  | 'category_distribution' 
  | 'location_usage';

// Struktura definicji raportu
export interface ReportDefinition {
  id: ReportType;
  name: string;
  description: string;
  icon: string;
  parameters: ReportParameter[];
}

// Typy parametrów raportów
export type ParameterType = 'date' | 'date_range' | 'select' | 'multi_select' | 'number' | 'checkbox';

// Struktura parametru raportu
export interface ReportParameter {
  id: string;
  name: string;
  type: ParameterType;
  required: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[];
}

// Definicje dostępnych raportów
export const reportDefinitions: ReportDefinition[] = [
  {
    id: 'inventory_status',
    name: 'Stan magazynowy na dzień',
    description: 'Raport prezentujący stan magazynowy wszystkich elementów na wybrany dzień',
    icon: 'calendar',
    parameters: [
      {
        id: 'date',
        name: 'Data raportu',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        id: 'categories',
        name: 'Kategorie',
        type: 'multi_select',
        required: false,
        options: mockCategories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
      },
      {
        id: 'show_zero_stock',
        name: 'Pokaż elementy z zerowym stanem',
        type: 'checkbox',
        required: false,
        defaultValue: false
      }
    ]
  },
  {
    id: 'low_stock',
    name: 'Elementy o niskim stanie',
    description: 'Raport elementów, których stan jest niższy od minimalnego lub zbliża się do minimum',
    icon: 'alert-triangle',
    parameters: [
      {
        id: 'threshold_percentage',
        name: 'Próg ostrzeżenia (%)',
        type: 'number',
        required: true,
        defaultValue: 20
      },
      {
        id: 'categories',
        name: 'Kategorie',
        type: 'multi_select',
        required: false,
        options: mockCategories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
      }
    ]
  },
  {
    id: 'inventory_value',
    name: 'Analiza wartości magazynu',
    description: 'Raport pokazujący wartość magazynu w podziale na kategorie i lokalizacje',
    icon: 'dollar-sign',
    parameters: [
      {
        id: 'date_range',
        name: 'Zakres dat',
        type: 'date_range',
        required: true,
        defaultValue: {
          from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0]
        }
      },
      {
        id: 'group_by',
        name: 'Grupuj według',
        type: 'select',
        required: true,
        defaultValue: 'category',
        options: [
          { value: 'category', label: 'Kategoria' },
          { value: 'location', label: 'Lokalizacja' }
        ]
      }
    ]
  },
  {
    id: 'turnover',
    name: 'Raport obrotów magazynowych',
    description: 'Analiza ruchu magazynowego (przyjęcia/wydania) w zadanym okresie',
    icon: 'refresh-cw',
    parameters: [
      {
        id: 'date_range',
        name: 'Zakres dat',
        type: 'date_range',
        required: true,
        defaultValue: {
          from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0]
        }
      },
      {
        id: 'operation_types',
        name: 'Typy operacji',
        type: 'multi_select',
        required: false,
        options: [
          { value: 'PZ', label: 'Przyjęcie zewnętrzne (PZ)' },
          { value: 'WZ', label: 'Wydanie zewnętrzne (WZ)' },
          { value: 'PW', label: 'Przyjęcie wewnętrzne (PW)' },
          { value: 'RW', label: 'Wydanie wewnętrzne (RW)' },
          { value: 'MM', label: 'Przesunięcie międzymagazynowe (MM)' }
        ]
      },
      {
        id: 'group_by',
        name: 'Grupuj według',
        type: 'select',
        required: true,
        defaultValue: 'day',
        options: [
          { value: 'day', label: 'Dzień' },
          { value: 'week', label: 'Tydzień' },
          { value: 'month', label: 'Miesiąc' }
        ]
      }
    ]
  },
  {
    id: 'category_distribution',
    name: 'Rozkład kategorii',
    description: 'Wykres pokazujący rozkład elementów i wartości według kategorii',
    icon: 'pie-chart',
    parameters: [
      {
        id: 'date',
        name: 'Data raportu',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        id: 'chart_type',
        name: 'Typ wykresu',
        type: 'select',
        required: true,
        defaultValue: 'pie',
        options: [
          { value: 'pie', label: 'Kołowy' },
          { value: 'bar', label: 'Słupkowy' }
        ]
      },
      {
        id: 'value_type',
        name: 'Wartość',
        type: 'select',
        required: true,
        defaultValue: 'count',
        options: [
          { value: 'count', label: 'Liczba elementów' },
          { value: 'value', label: 'Wartość finansowa' }
        ]
      }
    ]
  },
  {
    id: 'location_usage',
    name: 'Wykorzystanie lokalizacji',
    description: 'Raport pokazujący stopień wykorzystania lokalizacji magazynowych',
    icon: 'map-pin',
    parameters: [
      {
        id: 'threshold',
        name: 'Próg wykorzystania (%)',
        type: 'number',
        required: true,
        defaultValue: 80
      },
      {
        id: 'show_empty',
        name: 'Pokaż puste lokalizacje',
        type: 'checkbox',
        required: false,
        defaultValue: true
      }
    ]
  }
];

// Funkcje generujące dane raportów

export const generateReportData = (reportType: ReportType, parameters: Record<string, any>): any => {
  switch (reportType) {
    case 'inventory_status':
      return generateInventoryStatusReport(parameters);
    case 'low_stock':
      return generateLowStockReport(parameters);
    case 'inventory_value':
      return generateInventoryValueReport(parameters);
    case 'turnover':
      return generateTurnoverReport(parameters);
    case 'category_distribution':
      return generateCategoryDistributionReport(parameters);
    case 'location_usage':
      return generateLocationUsageReport(parameters);
    default:
      return { error: 'Nieznany typ raportu' };
  }
};

// Stan magazynowy na dzień
const generateInventoryStatusReport = (parameters: Record<string, any>) => {
  const { date, categories, show_zero_stock } = parameters;
  
  let filteredItems = [...mockInventoryItems];
  
  // Filtruj według kategorii jeśli podano
  if (categories && categories.length > 0) {
    filteredItems = filteredItems.filter(item => 
      categories.includes(mockCategories.find(cat => cat.name === item.category)?.id.toString())
    );
  }
  
  // Filtruj elementy z zerowym stanem jeśli wymagane
  if (!show_zero_stock) {
    filteredItems = filteredItems.filter(item => item.stock > 0);
  }
  
  // Mapuj do formatu raportu
  const reportData = filteredItems.map(item => ({
    id: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
    stock: item.stock,
    minStock: item.minStock,
    maxStock: item.maxStock,
    unit: item.unit,
    unitValue: item.value,
    totalValue: item.stock * item.value,
    location: item.location,
    status: item.stock < item.minStock ? 'low' : (item.stock > item.maxStock ? 'high' : 'normal')
  }));
  
  // Podsumowanie
  const summary = {
    totalItems: reportData.length,
    lowStockItems: reportData.filter(item => item.status === 'low').length,
    highStockItems: reportData.filter(item => item.status === 'high').length,
    totalValue: reportData.reduce((sum, item) => sum + item.totalValue, 0)
  };
  
  return {
    title: 'Stan magazynowy na dzień ' + new Date(date).toLocaleDateString('pl-PL'),
    parameters,
    data: reportData,
    summary
  };
};

// Elementy o niskim stanie
const generateLowStockReport = (parameters: Record<string, any>) => {
  const { threshold_percentage, categories } = parameters;
  
  let filteredItems = [...mockInventoryItems];
  
  // Filtruj według kategorii jeśli podano
  if (categories && categories.length > 0) {
    filteredItems = filteredItems.filter(item => 
      categories.includes(mockCategories.find(cat => cat.name === item.category)?.id.toString())
    );
  }
  
  // Filtruj elementy o niskim stanie
  filteredItems = filteredItems.filter(item => {
    const threshold = item.minStock * (1 + threshold_percentage / 100);
    return item.stock <= threshold;
  });
  
  // Sortuj od najmniejszego procentu wypełnienia
  filteredItems.sort((a, b) => {
    const percentA = a.minStock > 0 ? (a.stock / a.minStock) * 100 : 0;
    const percentB = b.minStock > 0 ? (b.stock / b.minStock) * 100 : 0;
    return percentA - percentB;
  });
  
  // Mapuj do formatu raportu
  const reportData = filteredItems.map(item => {
    const percentage = item.minStock > 0 ? (item.stock / item.minStock) * 100 : 0;
    return {
      id: item.id,
      code: item.code,
      name: item.name,
      category: item.category,
      stock: item.stock,
      minStock: item.minStock,
      unit: item.unit,
      percentage: percentage.toFixed(0),
      missingQuantity: Math.max(0, item.minStock - item.stock),
      location: item.location,
      status: item.stock < item.minStock ? 'critical' : 'warning'
    };
  });
  
  // Podsumowanie
  const summary = {
    totalItems: reportData.length,
    criticalItems: reportData.filter(item => item.status === 'critical').length,
    warningItems: reportData.filter(item => item.status === 'warning').length
  };
  
  return {
    title: 'Elementy o niskim stanie magazynowym (próg ' + threshold_percentage + '%)',
    parameters,
    data: reportData,
    summary
  };
};

// Analiza wartości magazynu
const generateInventoryValueReport = (parameters: Record<string, any>) => {
  const { date_range, group_by } = parameters;
  
  // Grupowanie według kategorii
  if (group_by === 'category') {
    const categoryGroups = mockCategories.map(category => {
      // Znajdź wszystkie elementy w tej kategorii
      const items = mockInventoryItems.filter(item => {
        const categoryObj = mockCategories.find(cat => cat.name === item.category);
        return categoryObj && categoryObj.id === category.id;
      });
      
      const totalValue = items.reduce((sum, item) => sum + (item.stock * item.value), 0);
      const itemsCount = items.length;
      
      return {
        id: category.id,
        name: category.name,
        code: category.code,
        itemsCount,
        totalValue
      };
    }).filter(group => group.itemsCount > 0);
    
    // Sortuj według wartości (od najwyższej)
    categoryGroups.sort((a, b) => b.totalValue - a.totalValue);
    
    // Dane do wykresu
    const chartData = categoryGroups.map(group => ({
      name: group.name,
      value: group.totalValue
    }));
    
    // Podsumowanie
    const summary = {
      totalCategories: categoryGroups.length,
      totalValue: categoryGroups.reduce((sum, group) => sum + group.totalValue, 0)
    };
    
    return {
      title: 'Analiza wartości magazynu według kategorii',
      parameters,
      data: categoryGroups,
      chartData,
      summary
    };
  }
  
  // Grupowanie według lokalizacji
  if (group_by === 'location') {
    // Uzyskaj unikalne lokalizacje
    const locations = [...new Set(mockInventoryItems.map(item => item.location))];
    
    const locationGroups = locations.map(location => {
      // Znajdź wszystkie elementy w tej lokalizacji
      const items = mockInventoryItems.filter(item => item.location === location);
      
      const totalValue = items.reduce((sum, item) => sum + (item.stock * item.value), 0);
      const itemsCount = items.length;
      
      return {
        location,
        itemsCount,
        totalValue
      };
    });
    
    // Sortuj według wartości (od najwyższej)
    locationGroups.sort((a, b) => b.totalValue - a.totalValue);
    
    // Dane do wykresu
    const chartData = locationGroups.map(group => ({
      name: group.location,
      value: group.totalValue
    }));
    
    // Podsumowanie
    const summary = {
      totalLocations: locationGroups.length,
      totalValue: locationGroups.reduce((sum, group) => sum + group.totalValue, 0)
    };
    
    return {
      title: 'Analiza wartości magazynu według lokalizacji',
      parameters,
      data: locationGroups,
      chartData,
      summary
    };
  }
  
  return { error: 'Nieobsługiwane grupowanie' };
};

// Raport obrotów magazynowych
const generateTurnoverReport = (parameters: Record<string, any>) => {
  const { date_range, operation_types, group_by } = parameters;
  
  // Filtruj operacje według daty i typu
  let filteredOperations = mockOperations.filter(op => {
    const opDate = new Date(op.date);
    const startDate = new Date(date_range.from);
    const endDate = new Date(date_range.to);
    
    return opDate >= startDate && opDate <= endDate && 
      (!operation_types || operation_types.length === 0 || operation_types.includes(op.type));
  });
  
  // Przygotuj dane według wybranego grupowania
  const getGroupKey = (date: Date): string => {
    if (group_by === 'day') {
      return date.toISOString().split('T')[0];
    }
    if (group_by === 'week') {
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil(days / 7);
      return `${date.getFullYear()}-W${weekNumber}`;
    }
    if (group_by === 'month') {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
    return date.toISOString().split('T')[0];
  };
  
  // Grupuj operacje
  const groupedData: Record<string, {
    key: string,
    inbound: number,
    outbound: number,
    inboundValue: number,
    outboundValue: number,
    operationsCount: number
  }> = {};
  
  filteredOperations.forEach(op => {
    const date = new Date(op.date);
    const groupKey = getGroupKey(date);
    
    if (!groupedData[groupKey]) {
      groupedData[groupKey] = {
        key: groupKey,
        inbound: 0,
        outbound: 0,
        inboundValue: 0,
        outboundValue: 0,
        operationsCount: 0
      };
    }
    
    // Oblicz wartość operacji
    const value = op.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Określ typ operacji (przyjęcie/wydanie)
    if (['PZ', 'PW'].includes(op.type)) {
      groupedData[groupKey].inbound += 1;
      groupedData[groupKey].inboundValue += value;
    } else if (['WZ', 'RW'].includes(op.type)) {
      groupedData[groupKey].outbound += 1;
      groupedData[groupKey].outboundValue += value;
    }
    
    groupedData[groupKey].operationsCount += 1;
  });
  
  // Konwertuj do tablicy i sortuj według daty
  const reportData = Object.values(groupedData).sort((a, b) => a.key.localeCompare(b.key));
  
  // Przygotuj dane do wykresu
  const chartData = reportData.map(group => ({
    name: formatGroupLabel(group.key, group_by),
    inbound: group.inboundValue,
    outbound: group.outboundValue,
    balance: group.inboundValue - group.outboundValue
  }));
  
  // Podsumowanie
  const summary = {
    totalOperations: filteredOperations.length,
    totalInboundValue: reportData.reduce((sum, group) => sum + group.inboundValue, 0),
    totalOutboundValue: reportData.reduce((sum, group) => sum + group.outboundValue, 0),
    balance: reportData.reduce((sum, group) => sum + group.inboundValue - group.outboundValue, 0)
  };
  
  return {
    title: 'Raport obrotów magazynowych',
    parameters,
    data: reportData,
    chartData,
    summary
  };
};

// Rozkład kategorii
const generateCategoryDistributionReport = (parameters: Record<string, any>) => {
  const { date, chart_type, value_type } = parameters;
  
  const categoryGroups = mockCategories.map(category => {
    // Znajdź wszystkie elementy w tej kategorii
    const items = mockInventoryItems.filter(item => {
      const categoryObj = mockCategories.find(cat => cat.name === item.category);
      return categoryObj && categoryObj.id === category.id;
    });
    
    const count = items.length;
    const value = items.reduce((sum, item) => sum + (item.stock * item.value), 0);
    
    return {
      id: category.id,
      name: category.name,
      count,
      value,
      percentage: 0  // Będzie obliczone później
    };
  }).filter(group => group.count > 0);
  
  // Oblicz procentowy udział
  const totalCount = categoryGroups.reduce((sum, group) => sum + group.count, 0);
  const totalValue = categoryGroups.reduce((sum, group) => sum + group.value, 0);
  
  categoryGroups.forEach(group => {
    if (value_type === 'count') {
      group.percentage = (group.count / totalCount) * 100;
    } else {
      group.percentage = (group.value / totalValue) * 100;
    }
  });
  
  // Sortuj według wybranej wartości (od najwyższej)
  categoryGroups.sort((a, b) => {
    return value_type === 'count' 
      ? b.count - a.count 
      : b.value - a.value;
  });
  
  // Dane do wykresu
  const chartData = categoryGroups.map(group => ({
    name: group.name,
    value: value_type === 'count' ? group.count : group.value
  }));
  
  // Podsumowanie
  const summary = {
    totalCategories: categoryGroups.length,
    totalItems: totalCount,
    totalValue
  };
  
  return {
    title: 'Rozkład ' + (value_type === 'count' ? 'liczby elementów' : 'wartości magazynu') + ' według kategorii',
    parameters,
    data: categoryGroups,
    chartData,
    chartType: chart_type,
    summary
  };
};

// Wykorzystanie lokalizacji
const generateLocationUsageReport = (parameters: Record<string, any>) => {
  const { threshold, show_empty } = parameters;
  
  // Uzyskaj unikalne lokalizacje
  const locations = [...new Set(mockInventoryItems.map(item => item.location))];
  
  const locationUsage = locations.map(location => {
    // Znajdź wszystkie elementy w tej lokalizacji
    const items = mockInventoryItems.filter(item => item.location === location);
    
    const itemsCount = items.length;
    const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
    
    // Symulujemy pojemność lokalizacji (w rzeczywistości pochodziłaby z danych lokalizacji)
    const capacity = Math.max(totalStock, Math.round(totalStock * (1 + Math.random())));
    const usagePercentage = capacity > 0 ? (totalStock / capacity) * 100 : 0;
    
    return {
      location,
      itemsCount,
      totalStock,
      capacity,
      usagePercentage,
      status: usagePercentage >= threshold ? 'high' : (usagePercentage > 0 ? 'normal' : 'empty')
    };
  });
  
  // Filtruj puste lokalizacje jeśli nie są wymagane
  const filteredLocations = show_empty 
    ? locationUsage 
    : locationUsage.filter(loc => loc.status !== 'empty');
  
  // Sortuj według wykorzystania (od najwyższego)
  filteredLocations.sort((a, b) => b.usagePercentage - a.usagePercentage);
  
  // Dane do wykresu
  const chartData = filteredLocations.map(loc => ({
    name: loc.location,
    usage: loc.usagePercentage,
    capacity: loc.capacity,
    current: loc.totalStock
  }));
  
  // Podsumowanie
  const summary = {
    totalLocations: filteredLocations.length,
    highUsageLocations: filteredLocations.filter(loc => loc.status === 'high').length,
    emptyLocations: filteredLocations.filter(loc => loc.status === 'empty').length,
    averageUsage: filteredLocations.reduce((sum, loc) => sum + loc.usagePercentage, 0) / filteredLocations.length
  };
  
  return {
    title: 'Wykorzystanie lokalizacji magazynowych',
    parameters,
    data: filteredLocations,
    chartData,
    summary
  };
};

// Pomocnicze funkcje formatujące
const formatGroupLabel = (key: string, groupBy: string): string => {
  if (groupBy === 'day') {
    return new Date(key).toLocaleDateString('pl-PL');
  }
  if (groupBy === 'week') {
    const [year, week] = key.split('-W');
    return `${year} tydzień ${week}`;
  }
  if (groupBy === 'month') {
    const [year, month] = key.split('-');
    return `${year}-${month}`;
  }
  return key;
};