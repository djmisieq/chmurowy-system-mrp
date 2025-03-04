export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  location: string;
}

export interface Order {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  orderDate: string;
  deliveryDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface ProductionPlan {
  id: string;
  modelName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'in-progress' | 'scheduled' | 'pending' | 'completed';
  completionRate: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'production' | 'inventory' | 'sales';
}

export interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

export interface DashboardData {
  stats: Stat[];
  inventorySummary: {
    id: number;
    name: string;
    stock: number;
    threshold: number;
    status: string;
  }[];
  productionSchedule: {
    id: number;
    product: string;
    quantity: number;
    status: string;
    startDate: string;
    endDate: string;
  }[];
}
