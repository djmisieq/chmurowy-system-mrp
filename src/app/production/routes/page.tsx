import React from 'react';
import RouteExplorer from '@/components/production/route/RouteExplorer';

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marszruty technologiczne</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition">
            Nowa marszruta
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mb-6">
        Zarządzaj marszrutami technologicznymi definującymi proces produkcyjny dla wytwarzanych produktów.
      </div>
      
      <RouteExplorer />
    </div>
  );
}