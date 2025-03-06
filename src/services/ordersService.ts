// Serwis do obsługi zamówień
// Tymczasowo używa mockowanych danych, docelowo będzie korzystał z API

import { SalesOrder, PurchaseOrder, ProductionOrder, OrderFilter } from '../types/orders';

const BASE_URL = '/api';
const MOCK_API_URL = '/mock-api';

// Funkcja pomocnicza do obsługi błędów fetch
const handleFetchError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Funkcja pomocnicza do obsługi danych mockowanych w przypadku niedostępności API
const fallbackToMockData = async (endpoint: string, errorMessage: string) => {
  console.warn(`${errorMessage} Używam danych mockowanych.`);
  try {
    const mockResponse = await fetch(`${MOCK_API_URL}${endpoint}.json`);
    return await mockResponse.json();
  } catch (mockErr) {
    console.error('Nie można załadować mockowanych danych:', mockErr);
    throw new Error('Nie można załadować danych aplikacji.');
  }
};

// Pobieranie zamówień klientów
export const getSalesOrders = async (filter?: OrderFilter): Promise<SalesOrder[]> => {
  try {
    // Docelowo: pobieranie z rzeczywistego API
    // const queryParams = filter ? `?${new URLSearchParams(filter as any).toString()}` : '';
    // const response = await fetch(`${BASE_URL}/sales-orders${queryParams}`);
    // const data = await handleFetchError(response);
    // return data.salesOrders || [];
    
    // Tymczasowo: pobieranie z mockowanych danych
    const response = await fetch(`${MOCK_API_URL}/sales-orders.json`);
    const data = await response.json();
    
    // Filtrowanie danych po stronie klienta (tymczasowo)
    let filteredOrders = data.salesOrders || [];
    
    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filteredOrders = filteredOrders.filter((order: SalesOrder) => 
          filter.status?.includes(order.status)
        );
      }
      
      if (filter.dateFrom) {
        const fromDate = new Date(filter.dateFrom);
        filteredOrders = filteredOrders.filter((order: SalesOrder) => 
          new Date(order.orderDate) >= fromDate
        );
      }
      
      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo);
        filteredOrders = filteredOrders.filter((order: SalesOrder) => 
          new Date(order.orderDate) <= toDate
        );
      }
      
      // Dodatkowe filtry można dodać w miarę potrzeb
    }
    
    return filteredOrders;
  } catch (error) {
    return fallbackToMockData('/sales-orders', 'Błąd podczas pobierania zamówień klientów.').then(data => data.salesOrders || []);
  }
};

// Pobieranie pojedynczego zamówienia klienta
export const getSalesOrder = async (id: string): Promise<SalesOrder | null> => {
  try {
    // Docelowo: pobieranie z rzeczywistego API
    // const response = await fetch(`${BASE_URL}/sales-orders/${id}`);
    // return await handleFetchError(response);
    
    // Tymczasowo: pobieranie z mockowanych danych
    const response = await fetch(`${MOCK_API_URL}/sales-orders.json`);
    const data = await response.json();
    const order = data.salesOrders.find((order: SalesOrder) => order.id === id);
    
    return order || null;
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów zamówienia:', error);
    
    // Próba pobrania danych mockowanych
    try {
      const mockData = await fallbackToMockData('/sales-orders', 'Błąd podczas pobierania szczegółów zamówienia.');
      return mockData.salesOrders.find((order: SalesOrder) => order.id === id) || null;
    } catch (mockErr) {
      return null;
    }
  }
};

// Pobieranie zamówień do dostawców
export const getPurchaseOrders = async (filter?: OrderFilter): Promise<PurchaseOrder[]> => {
  try {
    const response = await fetch(`${MOCK_API_URL}/purchase-orders.json`);
    const data = await response.json();
    return data.purchaseOrders || [];
  } catch (error) {
    return fallbackToMockData('/purchase-orders', 'Błąd podczas pobierania zamówień do dostawców.').then(data => data.purchaseOrders || []);
  }
};

// Pobieranie zleceń produkcyjnych
export const getProductionOrders = async (filter?: OrderFilter): Promise<ProductionOrder[]> => {
  try {
    const response = await fetch(`${MOCK_API_URL}/production-orders.json`);
    const data = await response.json();
    return data.productionOrders || [];
  } catch (error) {
    return fallbackToMockData('/production-orders', 'Błąd podczas pobierania zleceń produkcyjnych.').then(data => data.productionOrders || []);
  }
};

// Tworzenie nowego zamówienia klienta
export const createSalesOrder = async (order: Omit<SalesOrder, 'id'>): Promise<SalesOrder> => {
  // Docelowo będzie wysyłać request do API
  // W obecnej wersji tylko symuluje tworzenie zamówienia
  return {
    id: `so-${Math.floor(Math.random() * 1000)}`,
    orderNumber: `SO-2025-${Math.floor(Math.random() * 1000)}`,
    creationDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    ...order
  };
};

// Aktualizacja istniejącego zamówienia klienta
export const updateSalesOrder = async (id: string, orderData: Partial<SalesOrder>): Promise<SalesOrder | null> => {
  // Docelowo będzie wysyłać request do API
  // W obecnej wersji tylko symuluje aktualizację zamówienia
  try {
    const currentOrder = await getSalesOrder(id);
    if (!currentOrder) {
      throw new Error('Zamówienie nie istnieje');
    }
    
    return {
      ...currentOrder,
      ...orderData,
      lastModified: new Date().toISOString()
    };
  } catch (error) {
    console.error('Błąd podczas aktualizacji zamówienia:', error);
    return null;
  }
};

// Zmiana statusu zamówienia klienta
export const updateSalesOrderStatus = async (id: string, status: SalesOrder['status']): Promise<boolean> => {
  try {
    const updateResult = await updateSalesOrder(id, { status });
    return !!updateResult;
  } catch (error) {
    console.error('Błąd podczas zmiany statusu zamówienia:', error);
    return false;
  }
};

// Eksportuj inne potrzebne funkcje serwisowe
