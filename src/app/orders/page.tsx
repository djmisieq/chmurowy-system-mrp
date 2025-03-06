"use client";

import React from 'react';
import { 
  ShoppingCart, 
  TruckIcon, 
  ClipboardList, 
  BarChart2,
  Factory
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '../../components/layout/MainLayout';
import NavCard from '../../components/orders/NavCard';
import OrdersStats from '../../components/orders/OrdersStats';
import OrdersOverview from '../../components/orders/OrdersOverview';
import RecentOrders from '../../components/orders/RecentOrders';

const OrdersPage = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Zamówienia</h2>
        <p className="mt-1 text-sm text-gray-500">Zarządzanie zamówieniami klientów i dostawców</p>
      </div>
      
      {/* Karty statystyk */}
      <OrdersStats />
      
      {/* Kafelki nawigacyjne */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <NavCard 
          title="Zamówienia klientów" 
          description="Zarządzaj zamówieniami od klientów"
          icon={<ShoppingCart size={24} />}
          href="/orders/sales" 
        />
        <NavCard 
          title="Zamówienia do dostawców" 
          description="Twórz i śledź zamówienia do dostawców"
          icon={<TruckIcon size={24} />}
          href="/orders/purchase" 
        />
        <NavCard 
          title="Planowanie zakupów" 
          description="Planuj zakupy na podstawie zapotrzebowań"
          icon={<ClipboardList size={24} />}
          href="/orders/planning" 
        />
        <NavCard 
          title="Zlecenia produkcyjne" 
          description="Zarządzaj zleceniami produkcyjnymi"
          icon={<Factory size={24} />}
          href="/production" 
        />
      </div>
      
      {/* Tabele i wykresy */}
      <Tabs defaultValue="overview" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="sales">Zamówienia klientów</TabsTrigger>
          <TabsTrigger value="purchase">Zamówienia do dostawców</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OrdersOverview />
        </TabsContent>
        
        <TabsContent value="sales">
          <RecentOrders type="sales" limit={10} />
        </TabsContent>
        
        <TabsContent value="purchase">
          <RecentOrders type="purchase" limit={10} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default OrdersPage;