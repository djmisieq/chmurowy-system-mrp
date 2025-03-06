import { ProductionOrder } from './mockData';

// Przykładowe zlecenia produkcyjne
export const mockProductionOrders: ProductionOrder[] = [
  {
    id: 1001,
    orderNumber: 'ZP/2025/001',
    relatedCustomerOrderId: 1,
    relatedCustomerOrderNumber: 'ZK/2025/001',
    status: 'in_progress',
    planningDate: '2025-02-16',
    startDate: '2025-02-20',
    completionDate: null,
    priority: 'high',
    assignedTo: 'Zespół Produkcyjny A',
    items: [
      {
        id: 1,
        productId: 101,
        productName: 'Łódź motorowa Sport 21ft',
        quantity: 1,
        completedQuantity: 0,
        status: 'in_progress',
        materialStatus: 'allocated',
        estimatedHours: 120,
        actualHours: 45
      }
    ],
    notes: 'Etap produkcji: instalacja silnika i układu napędowego.'
  },
  {
    id: 1002,
    orderNumber: 'ZP/2025/002',
    relatedCustomerOrderId: 4,
    relatedCustomerOrderNumber: 'ZK/2025/004',
    status: 'completed',
    planningDate: '2025-01-15',
    startDate: '2025-01-20',
    completionDate: '2025-03-01',
    priority: 'normal',
    assignedTo: 'Zespół Produkcyjny B',
    items: [
      {
        id: 2,
        productId: 102,
        productName: 'Łódź motorowa Classic 18ft',
        quantity: 3,
        completedQuantity: 3,
        status: 'completed',
        materialStatus: 'issued',
        estimatedHours: 280,
        actualHours: 295
      }
    ],
    notes: 'Produkcja zakończona, łodzie oczekują na dostawę.'
  },
  {
    id: 1003,
    orderNumber: 'ZP/2025/003',
    relatedCustomerOrderId: 2,
    relatedCustomerOrderNumber: 'ZK/2025/002',
    status: 'planned',
    planningDate: '2025-02-20',
    startDate: null,
    completionDate: null,
    priority: 'normal',
    assignedTo: 'Zespół Produkcyjny C',
    items: [
      {
        id: 3,
        productId: 102,
        productName: 'Łódź motorowa Classic 18ft',
        quantity: 1,
        completedQuantity: 0,
        status: 'pending',
        materialStatus: 'pending',
        estimatedHours: 100,
        actualHours: 0
      }
    ],
    notes: 'Oczekiwanie na dostawę kadłuba - planowane rozpoczęcie 2025-03-10.'
  },
  {
    id: 1004,
    orderNumber: 'ZP/2025/004',
    relatedCustomerOrderId: 3,
    relatedCustomerOrderNumber: 'ZK/2025/003',
    status: 'on_hold',
    planningDate: '2025-03-02',
    startDate: null,
    completionDate: null,
    priority: 'normal',
    assignedTo: 'Zespół Produkcyjny A',
    items: [
      {
        id: 4,
        productId: 103,
        productName: 'Łódź motorowa Luxury 24ft',
        quantity: 1,
        completedQuantity: 0,
        status: 'pending',
        materialStatus: 'pending',
        estimatedHours: 150,
        actualHours: 0
      }
    ],
    notes: 'Wstrzymane - oczekiwanie na potwierdzenie i wpłatę od klienta.'
  }
];

// Status produkcji wg zamówień klientów
export const productionStatus = {
  inProgress: mockProductionOrders.filter(order => order.status === 'in_progress').length,
  planned: mockProductionOrders.filter(order => order.status === 'planned').length,
  onHold: mockProductionOrders.filter(order => order.status === 'on_hold').length,
  completed: mockProductionOrders.filter(order => order.status === 'completed').length,
  totalEstimatedHours: mockProductionOrders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.estimatedHours, 0);
  }, 0),
  totalActualHours: mockProductionOrders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + (item.actualHours || 0), 0);
  }, 0)
};

// Aktywne zlecenia produkcyjne (in_progress, planned)
export const activeProductionOrders = mockProductionOrders.filter(
  order => order.status === 'in_progress' || order.status === 'planned'
);