"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchIcon, RefreshCw, Download, BarChart, Table, FileText, Clock } from 'lucide-react';
import RouteGanttView from './RouteGanttView';
import { ProductionRoute } from '@/types/route.types';

interface RouteExplorerProps {
  initialRouteId?: string;
}

const RouteExplorer: React.FC<RouteExplorerProps> = ({ initialRouteId }) => {
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<ProductionRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(initialRouteId);
  const [selectedRoute, setSelectedRoute] = useState<ProductionRoute | null>(null);
  const [viewMode, setViewMode] = useState<'gantt' | 'table' | 'details'>('gantt');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        // Pobieranie z mock API
        const response = await axios.get('/production-routes.json');
        const data: ProductionRoute[] = response.data;
        setRoutes(data);
        
        // Wybierz pierwszą marszrutę jeśli nie ma initialRouteId
        if (!initialRouteId && data.length > 0) {
          setSelectedRouteId(data[0].id);
        }
        
      } catch (error) {
        console.error('Błąd podczas pobierania marszrut produkcyjnych:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [initialRouteId]);

  useEffect(() => {
    if (selectedRouteId && routes.length > 0) {
      const route = routes.find(r => r.id === selectedRouteId);
      setSelectedRoute(route || null);
    } else {
      setSelectedRoute(null);
    }
  }, [selectedRouteId, routes]);

  const handleRefresh = () => {
    // Re-fetch data
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/production-routes.json');
        setRoutes(response.data);
      } catch (error) {
        console.error('Błąd podczas odświeżania marszrut produkcyjnych:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  };

  const handleExport = () => {
    if (!selectedRoute) return;
    
    const dataStr = JSON.stringify(selectedRoute, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `route-${selectedRoute.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin h-10 w-10 text-primary-500" />
        </div>
      );
    }
    
    if (!selectedRoute) {
      return (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Wybierz marszrutę produkcyjną z listy
        </div>
      );
    }
    
    switch (viewMode) {
      case 'gantt':
        return (
          <div className="p-4">
            <RouteGanttView operations={selectedRoute.operations} />
          </div>
        );
      case 'table':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Operacje w marszrucie</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nazwa operacji
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Centrum robocze
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Czas przygotowania
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Czas operacji
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedRoute.operations.map((operation) => (
                    <tr key={operation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {operation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {operation.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {operation.workCenterName || operation.workCenter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {operation.setupTime} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {operation.processingTime} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${operation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          operation.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}
                        >
                          {operation.status === 'completed' ? 'Zakończono' :
                          operation.status === 'in-progress' ? 'W trakcie' :
                          operation.status === 'pending' ? 'Oczekuje' : 
                          operation.status || 'Oczekuje'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'details':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Szczegóły marszruty</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p>{selectedRoute.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nazwa</p>
                <p>{selectedRoute.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Wersja</p>
                <p>{selectedRoute.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`${selectedRoute.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                  {selectedRoute.status === 'active' ? 'Aktywny' : 
                   selectedRoute.status === 'draft' ? 'Wersja robocza' : 
                   selectedRoute.status === 'obsolete' ? 'Wycofany' : 
                   selectedRoute.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data utworzenia</p>
                <p>{new Date(selectedRoute.createdAt).toLocaleDateString('pl-PL')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Utworzony przez</p>
                <p>{selectedRoute.createdBy}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Opis</p>
                <p>{selectedRoute.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Całkowity czas przygotowania</p>
                <p>{selectedRoute.totalSetupTime} min</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Całkowity czas procesu</p>
                <p>{selectedRoute.totalProcessingTime} min</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Liczba operacji</p>
                <p>{selectedRoute.operations.length}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Marszruty technologiczne</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
            title="Odśwież"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={handleExport}
            disabled={!selectedRoute}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eksportuj do JSON"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4">
        {/* Sidebar with Route list */}
        <div className="col-span-1 border-r min-h-[600px]">
          <div className="p-3 border-b">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Szukaj..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[550px]">
            {routes.filter(route => 
              route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (route.productName && route.productName.toLowerCase().includes(searchTerm.toLowerCase()))
            ).map(route => (
              <div 
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedRouteId === route.id ? 'bg-primary-50' : ''}`}
              >
                <div className="font-medium">{route.name}</div>
                <div className="text-xs text-gray-500 mt-1">Produkt: {route.productName}</div>
                <div className="text-xs text-gray-500 flex justify-between mt-1">
                  <span>ID: {route.id}</span>
                  <span>v{route.version}</span>
                </div>
              </div>
            ))}
            
            {routes.length === 0 && !loading && (
              <div className="p-4 text-center text-gray-500">
                Brak marszrut produkcyjnych
              </div>
            )}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="col-span-3">
          {/* View mode selector */}
          <div className="flex border-b">
            <button 
              onClick={() => setViewMode('gantt')}
              className={`flex items-center px-4 py-2 border-r ${viewMode === 'gantt' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
            >
              <BarChart size={16} className="mr-2" />
              Wykres Gantta
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`flex items-center px-4 py-2 border-r ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
            >
              <Table size={16} className="mr-2" />
              Tabela operacji
            </button>
            <button 
              onClick={() => setViewMode('details')}
              className={`flex items-center px-4 py-2 ${viewMode === 'details' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
            >
              <FileText size={16} className="mr-2" />
              Szczegóły
            </button>
          </div>
          
          {/* Content area */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RouteExplorer;