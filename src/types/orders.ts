// Podstawowy interfejs dla wspólnych pól zamówień
export interface BaseOrder {
  id: string;
  orderNumber: string;
  creationDate: string;
  lastModified: string;
  notes: string;
  attachments?: string[];
  totalValue: number;
  items: OrderItem[];
}

// Zamówienie od klienta
export interface SalesOrder extends BaseOrder {
  customerName: string;
  customerContact: string;
  customerEmail: string;
  deliveryAddress: string;
  orderDate: string;
  requestedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: 'draft' | 'confirmed' | 'in_production' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'critical';
  paymentTerms: string;
  paymentStatus: 'pending' | 'partial' | 'paid';
  relatedProductionOrderId?: string;
}

// Zamówienie do dostawcy
export interface PurchaseOrder extends BaseOrder {
  supplierName: string;
  supplierContact: string;
  supplierEmail: string;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'received' | 'cancelled';
  deliveryTerms: string;
  paymentTerms: string;
}

// Element zamówienia
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  requestedDeliveryDate?: string;
  status?: string;
  lineTotal: number;
}

// Zlecenie produkcyjne
export interface ProductionOrder {
  id: string;
  orderNumber: string;
  relatedSalesOrderId?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'critical';
  items: ProductionItem[];
  assignedTo: string[];
  completionRate: number;
}

// Element zlecenia produkcyjnego
export interface ProductionItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  completedQuantity: number;
  startDate: string;
  endDate: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

// Historia statusów zamówienia
export interface OrderStatusHistory {
  id: string;
  orderId: string;
  orderType: 'sales' | 'purchase' | 'production';
  status: string;
  timestamp: string;
  changedBy: string;
  notes?: string;
}

// Filtr zamówień
export interface OrderFilter {
  dateFrom?: string;
  dateTo?: string;
  status?: string[];
  customer?: string;
  supplier?: string;
  priority?: string[];
  product?: string;
  minValue?: number;
  maxValue?: number;
}
