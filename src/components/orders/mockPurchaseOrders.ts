import { PurchaseOrder } from './mockData';

// Przykładowe zamówienia do dostawców
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    orderNumber: 'ZD/2025/001',
    supplier: {
      id: 1,
      name: 'Marine Motors Sp. z o.o.',
      email: 'kontakt@marinemotors.pl',
      phone: '+48 123 456 789'
    },
    status: 'confirmed',
    orderDate: '2025-02-10',
    expectedDeliveryDate: '2025-03-15',
    receivedDate: null,
    totalValue: 145000,
    priority: 'high',
    createdBy: 'Anna Wiśniewska',
    items: [
      {
        id: 1,
        itemId: 1,
        itemCode: 'SIL-40KM',
        itemName: 'Silnik podwieszany 40KM',
        quantity: 8,
        unitPrice: 12000,
        totalPrice: 96000,
        receivedQuantity: 0,
        status: 'pending'
      },
      {
        id: 2,
        itemId: 10,
        itemCode: 'SIL-60KM',
        itemName: 'Silnik podwieszany 60KM',
        quantity: 3,
        unitPrice: 18000,
        totalPrice: 54000,
        receivedQuantity: 0,
        status: 'pending'
      }
    ],
    notes: 'Zamówienie priorytetowe - silniki niezbędne do realizacji zamówień ZK/2025/001 i ZK/2025/002.'
  },
  {
    id: 2,
    orderNumber: 'ZD/2025/002',
    supplier: {
      id: 2,
      name: 'Yacht Parts S.A.',
      email: 'info@yachtparts.com',
      phone: '+48 987 654 321'
    },
    status: 'partially_received',
    orderDate: '2025-02-05',
    expectedDeliveryDate: '2025-03-05',
    receivedDate: '2025-03-01',
    totalValue: 168000,
    priority: 'normal',
    createdBy: 'Michał Kowalczyk',
    items: [
      {
        id: 3,
        itemId: 2,
        itemCode: 'KAD-18CL',
        itemName: 'Kadłub 18ft Classic',
        quantity: 5,
        unitPrice: 25000,
        totalPrice: 125000,
        receivedQuantity: 3,
        status: 'partially_received'
      },
      {
        id: 4,
        itemId: 11,
        itemCode: 'KAD-21SP',
        itemName: 'Kadłub 21ft Sport',
        quantity: 1,
        unitPrice: 30000,
        totalPrice: 30000,
        receivedQuantity: 0,
        status: 'pending'
      },
      {
        id: 5,
        itemId: 5,
        itemCode: 'TAP-PR',
        itemName: 'Zestaw tapicerski Premium',
        quantity: 3,
        unitPrice: 4500,
        totalPrice: 13500,
        receivedQuantity: 3,
        status: 'received'
      }
    ],
    notes: 'Pozostałe kadłuby oczekiwane w ciągu tygodnia.'
  },
  {
    id: 3,
    orderNumber: 'ZD/2025/003',
    supplier: {
      id: 3,
      name: 'ElectroNautic',
      email: 'sales@electronautic.eu',
      phone: '+48 111 222 333'
    },
    status: 'received',
    orderDate: '2025-01-25',
    expectedDeliveryDate: '2025-02-15',
    receivedDate: '2025-02-13',
    totalValue: 42850,
    priority: 'normal',
    createdBy: 'Anna Wiśniewska',
    items: [
      {
        id: 6,
        itemId: 6,
        itemCode: 'AKU-120',
        itemName: 'Akumulator 120Ah',
        quantity: 15,
        unitPrice: 900,
        totalPrice: 13500,
        receivedQuantity: 15,
        status: 'received'
      },
      {
        id: 7,
        itemId: 7,
        itemCode: 'OSW-LED',
        itemName: 'Oświetlenie LED nawigacyjne',
        quantity: 25,
        unitPrice: 450,
        totalPrice: 11250,
        receivedQuantity: 25,
        status: 'received'
      },
      {
        id: 8,
        itemId: 8,
        itemCode: 'GPS-MAR',
        itemName: 'Nawigacja GPS morska',
        quantity: 6,
        unitPrice: 3200,
        totalPrice: 19200,
        receivedQuantity: 6,
        status: 'received'
      }
    ],
    notes: 'Dostawa zrealizowana zgodnie z zamówieniem.'
  },
  {
    id: 4,
    orderNumber: 'ZD/2025/004',
    supplier: {
      id: 4,
      name: 'BoatSupplies',
      email: 'office@boatsupplies.pl',
      phone: '+48 444 555 666'
    },
    status: 'sent',
    orderDate: '2025-02-25',
    expectedDeliveryDate: '2025-03-25',
    receivedDate: null,
    totalValue: 15500,
    priority: 'normal',
    createdBy: 'Michał Kowalczyk',
    items: [
      {
        id: 9,
        itemId: 9,
        itemCode: 'SR-INOX',
        itemName: 'Śruby nierdzewne M8',
        quantity: 2000,
        unitPrice: 2.5,
        totalPrice: 5000,
        receivedQuantity: 0,
        status: 'pending'
      },
      {
        id: 10,
        itemId: 13,
        itemCode: 'ZL-DECK',
        itemName: 'Złącza pokładowe',
        quantity: 100,
        unitPrice: 85,
        totalPrice: 8500,
        receivedQuantity: 0,
        status: 'pending'
      },
      {
        id: 11,
        itemId: 14,
        itemCode: 'USZ-RUB',
        itemName: 'Uszczelki gumowe',
        quantity: 200,
        unitPrice: 10,
        totalPrice: 2000,
        receivedQuantity: 0,
        status: 'pending'
      }
    ],
    notes: 'Materiały uzupełniające do magazynu.'
  },
  {
    id: 5,
    orderNumber: 'ZD/2025/005',
    supplier: {
      id: 2,
      name: 'Yacht Parts S.A.',
      email: 'info@yachtparts.com',
      phone: '+48 987 654 321'
    },
    status: 'draft',
    orderDate: '2025-03-01',
    expectedDeliveryDate: '2025-04-01',
    receivedDate: null,
    totalValue: 55000,
    priority: 'normal',
    createdBy: 'Anna Wiśniewska',
    items: [
      {
        id: 12,
        itemId: 3,
        itemCode: 'KON-STD',
        itemName: 'Konsola sterowa Standard',
        quantity: 10,
        unitPrice: 5500,
        totalPrice: 55000,
        receivedQuantity: 0,
        status: 'pending'
      }
    ],
    notes: 'Zamówienie w przygotowaniu - wymaga zatwierdzenia.'
  }
];

// Elementy wymagające uwagi (zamówienia od dostawców oczekujące na dostawę)
export const attentionPurchaseOrders = mockPurchaseOrders.filter(
  order => (order.status === 'sent' || order.status === 'confirmed') && 
  (order.priority === 'high' || order.priority === 'urgent')
);

// Nadchodzące planowane dostawy
export const upcomingDeliveries = mockPurchaseOrders
  .filter(order => order.status === 'sent' || order.status === 'confirmed')
  .sort((a, b) => {
    const dateA = a.expectedDeliveryDate ? new Date(a.expectedDeliveryDate) : new Date('2099-12-31');
    const dateB = b.expectedDeliveryDate ? new Date(b.expectedDeliveryDate) : new Date('2099-12-31');
    return dateA.getTime() - dateB.getTime();
  })
  .slice(0, 5); // Pobierz 5 najbliższych dostaw