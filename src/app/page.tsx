"use client";

import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import axios from 'axios';
import StatCard from '../components/dashboard/StatCard';
import StatusTable from '../components/dashboard/StatusTable';
import ChartCard from '../components/dashboard/ChartCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { AlertTriangle, Package, ShoppingCart, ClipboardList, TrendingUp, BarChart } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Home() {
  // Dashboard data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [alertItems, setAlertItems] = useState([]);

  // Sample chart data for demonstration
  const [inventoryChartData, setInventoryChartData] = useState([
    { name: 'Styczeń', value: 350 },
    { name: 'Luty', value: 320 },
    { name: 'Marzec', value: 356 },
    { name: 'Kwiecień', value: 390 },
    { name: 'Maj', value: 410 },
    { name: 'Czerwiec', value: 405 },
  ]);

  const [productionChartData, setProductionChartData] = useState([
    { name: 'Tydzień 1', planowane: 4, zrealizowane: 3 },
    { name: 'Tydzień 2', planowane: 5, zrealizowane: 5 },
    { name: 'Tydzień 3', planowane: 6, zrealizowane: 5 },
    { name: 'Tydzień 4', planowane: 7, zrealizowane: 6 },
    { name: 'Tydzień 5', planowane: 5, zrealizowane: 5 },
    { name: 'Tydzień 6', planowane: 4, zrealizowane: 4 },
  ]);

  // Fetch data from mock API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/dashboard');
        const data = response.data;
        
        setStats(data.stats);
        setInventoryItems(data.inventorySummary);
        setScheduleItems(data.productionSchedule);
        setAlertItems(data.alerts || []);
        setError(false);
      } catch (err) {
        console.error('Błąd pobierania danych dashboardu:', err);
        setError(true);
        // Fallback data
        setStats([
          { name: 'Otwarte zamówienia', value: '15', change: '+2', changeType: 'increase' },
          { name: 'Produkty na magazynie', value: '356', change: '-12', changeType: 'decrease' },
          { name: 'Produkty do zamówienia', value: '23', change: '+5', changeType: 'increase' },
          { name: 'Planowane produkcje', value: '8', change: '+1', changeType: 'increase' },
        ]);
        setInventoryItems([
          { id: 1, name: 'Silnik podwieszany 40KM', stock: 12, threshold: 5, status: 'good' },
          { id: 2, name: 'Kadłub 18ft Classic', stock: 3, threshold: 5, status: 'warning' },
          { id: 3, name: 'Konsola sterowa Standard', stock: 8, threshold: 10, status: 'warning' },
          { id: 4, name: 'Zbiornik paliwa 100L', stock: 2, threshold: 8, status: 'critical' },
        ]);
        setScheduleItems([
          { id: 1, product: 'Classic 180', quantity: 2, status: 'In Progress', startDate: '2025-03-05', endDate: '2025-03-15' },
          { id: 2, product: 'Sport 210', quantity: 1, status: 'Scheduled', startDate: '2025-03-18', endDate: '2025-03-28' },
          { id: 3, product: 'Luxury 250', quantity: 1, status: 'Scheduled', startDate: '2025-04-01', endDate: '2025-04-18' },
        ]);
        setAlertItems([
          { id: 1, type: 'inventory', message: 'Niski stan magazynowy: Zbiornik paliwa 100L', timestamp: '2025-03-06T08:30:00Z', priority: 'high' },
          { id: 2, type: 'order', message: 'Opóźnione zamówienie #ZAM-2025-021', timestamp: '2025-03-05T14:15:00Z', priority: 'medium' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading component
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="ml-3 text-lg text-gray-600">Ładowanie danych...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Przegląd kluczowych wskaźników i zadań</p>
        {error && (
          <div className="mt-2 bg-red-50 p-3 rounded-md border border-red-200">
            <p className="text-red-600">Wystąpił problem z pobieraniem danych. Wyświetlane są dane przykładowe.</p>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard 
          title="Otwarte zamówienia"
          value={stats[0]?.value || "0"}
          change={stats[0]?.change}
          changeType={stats[0]?.changeType}
          icon={<ShoppingCart size={20} />}
        />
        <StatCard 
          title="Produkty na magazynie"
          value={stats[1]?.value || "0"}
          change={stats[1]?.change}
          changeType={stats[1]?.changeType}
          icon={<Package size={20} />}
          iconBgColor="bg-accent-100"
          iconTextColor="text-accent-600"
        />
        <StatCard 
          title="Produkty do zamówienia"
          value={stats[2]?.value || "0"}
          change={stats[2]?.change}
          changeType={stats[2]?.changeType}
          icon={<AlertTriangle size={20} />}
          iconBgColor="bg-warning-50"
          iconTextColor="text-warning-500"
        />
        <StatCard 
          title="Planowane produkcje"
          value={stats[3]?.value || "0"}
          change={stats[3]?.change}
          changeType={stats[3]?.changeType}
          icon={<ClipboardList size={20} />}
          iconBgColor="bg-success-50"
          iconTextColor="text-success-500"
        />
      </div>

      {/* Alerts & Notifications */}
      {alertItems.length > 0 && (
        <div className="mb-6">
          <Card 
            title="Alerty i powiadomienia"
            subtitle="Ostatnie zdarzenia wymagające uwagi"
          >
            <div className="space-y-3">
              {alertItems.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex p-3 rounded-lg border-l-4 ${
                    alert.priority === 'high' 
                      ? 'bg-red-50 border-red-500' 
                      : alert.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex-shrink-0 mr-3">
                    <AlertTriangle 
                      size={20} 
                      className={alert.priority === 'high' 
                        ? 'text-red-500' 
                        : alert.priority === 'medium'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                      } 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString('pl-PL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
        <ChartCard
          title="Stan magazynowy w czasie"
          subtitle="Liczba produktów w ostatnich 6 miesiącach"
          chartType="line"
          data={inventoryChartData}
          dataKeys={['value']}
          action={
            <Button href="/inventory/reports" size="sm" variant="outline">
              Pełny raport
            </Button>
          }
        />
        <ChartCard
          title="Realizacja produkcji"
          subtitle="Planowane vs. zrealizowane zlecenia produkcyjne"
          chartType="bar"
          data={productionChartData}
          dataKeys={['planowane', 'zrealizowane']}
          colors={['#0ea5e9', '#10b981']}
          action={
            <Button href="/production/reports" size="sm" variant="outline">
              Pełny raport
            </Button>
          }
        />
      </div>

      {/* Info Panels */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Inventory Status */}
        <StatusTable
          title="Stan magazynu"
          detailsUrl="/inventory"
          columns={[
            { key: 'name', header: 'Nazwa' },
            { key: 'stock', header: 'Stan', render: (stock, item) => `${stock} / ${item.threshold}+` },
            { 
              key: 'status', 
              header: 'Status', 
              render: (status) => <StatusTable.StatusBadge status={status} /> 
            }
          ]}
          data={inventoryItems}
        />

        {/* Production Schedule */}
        <StatusTable
          title="Harmonogram produkcji"
          detailsUrl="/production"
          columns={[
            { key: 'product', header: 'Produkt' },
            { key: 'quantity', header: 'Ilość' },
            { 
              key: 'status', 
              header: 'Status', 
              render: (status) => <StatusTable.StatusBadge status={status} /> 
            },
            { 
              key: 'startDate', 
              header: 'Data', 
              render: (startDate, item) => `${startDate} - ${item.endDate}` 
            }
          ]}
          data={scheduleItems}
        />
      </div>
    </MainLayout>
  );
}