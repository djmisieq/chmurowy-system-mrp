import React from 'react';
import MainLayout from '../layout/MainLayout';
import StatsCard from './StatsCard';
import InventorySummary from './InventorySummary';
import ProductionSchedule from './ProductionSchedule';

export default function MainDashboard() {
  // W przyszłości dane będą pobierane z API
  const stats = [
    { name: 'Otwarte zamówienia', value: '15', change: '+2', changeType: 'increase' },
    { name: 'Produkty na magazynie', value: '356', change: '-12', changeType: 'decrease' },
    { name: 'Produkty do zamówienia', value: '23', change: '+5', changeType: 'increase' },
    { name: 'Planowane produkcje', value: '8', change: '+1', changeType: 'increase' },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Przegląd kluczowych wskaźników i zadań</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <StatsCard key={stat.name} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <InventorySummary />
        <ProductionSchedule />
      </div>
    </MainLayout>
  );
}
