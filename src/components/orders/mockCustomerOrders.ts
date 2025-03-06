import { CustomerOrder } from './mockData';

// Przykładowi klienci
export const mockCustomers = [
  { 
    id: 1, 
    name: 'Yacht Marina Gdańsk', 
    email: 'zamowienia@yachtmarina.pl', 
    phone: '+48 123 456 789',
    address: 'ul. Portowa 12, 80-001 Gdańsk',
    type: 'business'
  },
  { 
    id: 2, 
    name: 'Morskie Centrum Rekreacji', 
    email: 'biuro@morskiecentrum.com', 
    phone: '+48 987 654 321',
    address: 'ul. Nadmorska 45, 72-100 Świnoujście',
    type: 'business'
  },
  { 
    id: 3, 
    name: 'Jan Kowalski', 
    email: 'jan.kowalski@example.com', 
    phone: '+48 111 222 333',
    address: 'ul. Żeglarska 7/2, 70-001 Szczecin',
    type: 'individual'
  },
  { 
    id: 4, 
    name: 'Mazurskie Wypożyczalnie Sp. z o.o.', 
    email: 'kontakt@mazurskiewypozyczalnie.pl', 
    phone: '+48 444 555 666',
    address: 'ul. Jeziorna 22, 11-500 Giżycko',
    type: 'business'
  },
  { 
    id: 5, 
    name: 'Alicja Nowak', 
    email: 'alicja.nowak@example.com', 
    phone: '+48 777 888 999',
    address: 'ul. Regatowa 13, 81-198 Sopot',
    type: 'individual'
  }
];

// Przykładowe zamówienia klientów
export const mockCustomerOrders: CustomerOrder[] = [
  {
    id: 1,
    orderNumber: 'ZK/2025/001',
    customer: {
      id: 1,
      name: 'Yacht Marina Gdańsk',
      email: 'zamowienia@yachtmarina.pl',
      phone: '+48 123 456 789'
    },
    status: 'in_production',
    orderDate: '2025-02-15',
    deliveryDate: '2025-04-10',
    totalValue: 350000,
    paidValue: 175000,
    priority: 'high',
    assignedTo: 'Adam Nowak',
    items: [
      {
        id: 1,
        productId: 101,
        productName: 'Łódź motorowa Sport 21ft',
        quantity: 1,
        unitPrice: 280000,
        totalPrice: 280000,
        status: 'in_production',
        productionOrderId: 1001
      },
      {
        id: 2,
        productId: 205,
        productName: 'Pakiet wyposażenia Premium',
        quantity: 1,
        unitPrice: 70000,
        totalPrice: 70000,
        status: 'pending'
      }
    ],
    notes: 'Klient prosi o dokładne zabezpieczenie elektroniki przed wodą morską.'
  },
  {
    id: 2,
    orderNumber: 'ZK/2025/002',
    customer: {
      id: 3,
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      phone: '+48 111 222 333'
    },
    status: 'confirmed',
    orderDate: '2025-02-18',
    deliveryDate: '2025-05-05',
    totalValue: 190000,
    paidValue: 50000,
    priority: 'normal',
    assignedTo: 'Marta Wilk',
    items: [
      {
        id: 3,
        productId: 102,
        productName: 'Łódź motorowa Classic 18ft',
        quantity: 1,
        unitPrice: 175000,
        totalPrice: 175000,
        status: 'pending'
      },
      {
        id: 4,
        productId: 203,
        productName: 'Pakiet wyposażenia Standard',
        quantity: 1,
        unitPrice: 15000,
        totalPrice: 15000,
        status: 'pending'
      }
    ],
    notes: 'Pierwszy zakup klienta. Przygotować szczegółową instrukcję obsługi.'
  },
  {
    id: 3,
    orderNumber: 'ZK/2025/003',
    customer: {
      id: 2,
      name: 'Morskie Centrum Rekreacji',
      email: 'biuro@morskiecentrum.com',
      phone: '+48 987 654 321'
    },
    status: 'new',
    orderDate: '2025-03-01',
    deliveryDate: null,
    totalValue: 620000,
    paidValue: 0,
    priority: 'normal',
    items: [
      {
        id: 5,
        productId: 103,
        productName: 'Łódź motorowa Luxury 24ft',
        quantity: 1,
        unitPrice: 550000,
        totalPrice: 550000,
        status: 'pending'
      },
      {
        id: 6,
        productId: 207,
        productName: 'Pakiet wyposażenia Deluxe',
        quantity: 1,
        unitPrice: 70000,
        totalPrice: 70000,
        status: 'pending'
      }
    ],
    notes: 'Zamówienie wymaga potwierdzenia - klient planuje dokonać wpłaty 10.03.2025.'
  },
  {
    id: 4,
    orderNumber: 'ZK/2025/004',
    customer: {
      id: 4,
      name: 'Mazurskie Wypożyczalnie Sp. z o.o.',
      email: 'kontakt@mazurskiewypozyczalnie.pl',
      phone: '+48 444 555 666'
    },
    status: 'ready',
    orderDate: '2025-01-10',
    deliveryDate: '2025-03-05',
    totalValue: 810000,
    paidValue: 810000,
    priority: 'normal',
    assignedTo: 'Piotr Zieliński',
    items: [
      {
        id: 7,
        productId: 102,
        productName: 'Łódź motorowa Classic 18ft',
        quantity: 3,
        unitPrice: 175000,
        totalPrice: 525000,
        status: 'ready'
      },
      {
        id: 8,
        productId: 201,
        productName: 'Pakiet wyposażenia Basic',
        quantity: 3,
        unitPrice: 25000,
        totalPrice: 75000,
        status: 'ready'
      },
      {
        id: 9,
        productId: 301,
        productName: 'Zestaw serwisowy',
        quantity: 3,
        unitPrice: 5000,
        totalPrice: 15000,
        status: 'ready'
      }
    ],
    notes: 'Przygotować także dokumentację do rejestracji łodzi.'
  },
  {
    id: 5,
    orderNumber: 'ZK/2025/005',
    customer: {
      id: 5,
      name: 'Alicja Nowak',
      email: 'alicja.nowak@example.com',
      phone: '+48 777 888 999'
    },
    status: 'completed',
    orderDate: '2025-01-05',
    deliveryDate: '2025-02-28',
    totalValue: 195000,
    paidValue: 195000,
    priority: 'normal',
    assignedTo: 'Adam Nowak',
    items: [
      {
        id: 10,
        productId: 102,
        productName: 'Łódź motorowa Classic 18ft',
        quantity: 1,
        unitPrice: 175000,
        totalPrice: 175000,
        status: 'shipped'
      },
      {
        id: 11,
        productId: 204,
        productName: 'Pakiet bezpieczeństwa',
        quantity: 1,
        unitPrice: 20000,
        totalPrice: 20000,
        status: 'shipped'
      }
    ],
    notes: 'Dostawa zrealizowana w terminie. Klient zadowolony.'
  }
];

// Elementy wymagające uwagi (zamówienia z wysokim priorytetem lub opóźnione)
export const attentionOrders = mockCustomerOrders.filter(
  order => order.priority === 'high' || order.priority === 'urgent'
);