"use client";

import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  TruckIcon, 
  DollarSign, 
  TrendingUp, 
  Factory 
} from 'lucide-react';
import StatsCard from './StatsCard';
import { orderStats } from './mockData';
import { productionStatus } from './mockProductionOrders';

export const OrdersStats = () => {
  // Formatowanie wartości do wyświetlenia
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
      <StatsCard 
        title="Zamówienia klientów" 
        value={orderStats.totalCustomerOrders.toString()} 
        icon={<ShoppingCart size={24} />}
        trend={`${orderStats.openCustomerOrders} otwartych`} 
        trendType="neutral" 
      />
      <StatsCard 
        title="Zamówienia do dostawców" 
        value={orderStats.totalPurchaseOrders.toString()} 
        icon={<TruckIcon size={24} />}
        trend={`${orderStats.openPurchaseOrders} otwartych`} 
        trendType="neutral" 
        color="primary"
      />
      <StatsCard 
        title="W produkcji" 
        value={productionStatus.inProgress.toString()} 
        icon={<Factory size={24} />}
        trend={`${productionStatus.planned} zaplanowanych`} 
        trendType={productionStatus.inProgress > 0 ? "increase" : "neutral"} 
        color="success"
      />
      <StatsCard 
        title="Wartość zamówień klientów" 
        value={formatCurrency(orderStats.customerOrdersValue)} 
        icon={<DollarSign size={24} />}
        trend="+8% (ostatni miesiąc)" 
        trendType="increase" 
        color="success"
      />
      <StatsCard 
        title="Wartość zamówień do dostawców" 
        value={formatCurrency(orderStats.purchaseOrdersValue)} 
        icon={<Package size={24} />}
        trend="+2% (ostatni miesiąc)" 
        trendType="increase" 
        color="warning"
      />
      <StatsCard 
        title="Efektywność produkcji" 
        value={`${Math.round((productionStatus.totalActualHours / productionStatus.totalEstimatedHours) * 100)}%`} 
        icon={<TrendingUp size={24} />}
        trend={`${productionStatus.totalActualHours} / ${productionStatus.totalEstimatedHours} h`} 
        trendType="neutral" 
        color="primary"
      />
    </div>
  );
};

export default OrdersStats;