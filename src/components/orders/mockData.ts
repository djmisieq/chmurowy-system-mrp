// Typy danych dla zamówień klientów
export interface CustomerOrder {
  id: number;
  orderNumber: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  status: 'new' | 'confirmed' | 'in_production' | 'ready' | 'shipped' | 'completed' | 'cancelled';
  orderDate: string;
  deliveryDate: string | null;
  totalValue: number;
  paidValue: number;
  items: CustomerOrderItem[];
  notes?: string;
  priority: 'normal' | 'high' | 'urgent';
  assignedTo?: string;
}

// Typy danych dla pojedynczego elementu zamówienia klienta
export interface CustomerOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'in_production' | 'ready' | 'shipped';
  productionOrderId?: number;
}

// Typy danych dla zamówień do dostawców
export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplier: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  status: 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'received' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string | null;
  receivedDate: string | null;
  totalValue: number;
  items: PurchaseOrderItem[];
  notes?: string;
  priority: 'normal' | 'high' | 'urgent';
  createdBy: string;
}

// Typy danych dla pojedynczego elementu zamówienia do dostawcy
export interface PurchaseOrderItem {
  id: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  status: 'pending' | 'partially_received' | 'received';
}

// Typy danych dla powiązania zamówień klientów z produkcją
export interface ProductionOrder {
  id: number;
  orderNumber: string;
  relatedCustomerOrderId: number;
  relatedCustomerOrderNumber: string;
  status: 'planned' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  planningDate: string;
  startDate: string | null;
  completionDate: string | null;
  items: ProductionOrderItem[];
  priority: 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  notes?: string;
}

// Typy danych dla pojedynczego elementu zlecenia produkcyjnego
export interface ProductionOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  completedQuantity: number;
  status: 'pending' | 'in_progress' | 'completed';
  materialStatus: 'pending' | 'allocated' | 'issued';
  estimatedHours: number;
  actualHours?: number;
}

// Statystyki zamówień
export const orderStats = {
  totalCustomerOrders: 32,
  openCustomerOrders: 12,
  totalPurchaseOrders: 41,
  openPurchaseOrders: 18,
  customerOrdersValue: 5250000,
  purchaseOrdersValue: 890000,
  inProductionOrders: 5
};