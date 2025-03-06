"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import StatCard from '../../components/dashboard/StatCard';
import StatusTable from '../../components/dashboard/StatusTable';
import ChartCard from '../../components/dashboard/ChartCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Factory, Clock, AlertTriangle, CheckCircle, Workflow, Tool } from 'lucide-react';

// Przykładowe dane dla strony produkcji
const MOCK_PRODUCTION_STATS = [
  { name: 'Aktywne zlecenia', value: '8', change: '+3', changeType: 'increase' },
  { name: 'Zakończone (miesiąc)', value: '12', change: '+2', changeType: 'increase' },
  { name: 'Wydajność', value: '94%', change: '+1.5%', changeType: 'increase' },
  { name: 'Obciążenie linii', value: '76%', change: '-5%', changeType: 'decrease' },
];

const MOCK_PRODUCTION_ORDERS = [
  { 
    id: 1, 
    name: 'Classic 180', 
    quantity: 2, 
    progress: 65, 
    status: 'In Progress', 
    startDate: '2025-03-05', 
    endDate: '2025-03-15',
    assignee: 'Zespół A'
  },
  { 
    id: 2, 
    name: 'Sport 210', 
    quantity: 1, 
    progress: 0, 
    status: 'Scheduled', 
    startDate: '2025-03-18', 
    endDate: '2025-03-28',
    assignee: 'Zespół B'
  },
  { 
    id: 3, 
    name: 'Luxury 250', 
    quantity: 1, 
    progress: 0, 
    status: 'Scheduled', 
    startDate: '2025-04-01', 
    endDate: '2025-04-18',
    assignee: 'Zespół C'
  },
  { 
    id: 4, 
    name: 'Fishing Pro 190', 
    quantity: 3, 
    progress: 0, 
    status: 'Pending', 
    startDate: '2025-04-20', 
    endDate: '2025-05-10',
    assignee: 'Zespół A'
  },
];

const MOCK_PRODUCTION_ISSUES = [
  { 
    id: 1, 
    description: 'Opóźnienie dostawy silników', 
    impact: 'high', 
    status: 'active', 
    reportDate: '2025-03-04',
    affectedOrders: 'Classic 180, Sport 210'
  },
  { 
    id: 2, 
    description: 'Konieczność wymiany uszkodzonych form', 
    impact: 'medium', 
    status: 'resolved', 
    reportDate: '2025-03-01',
    resolveDate: '2025-03-03',
    affectedOrders: 'Classic 180'
  },
  { 
    id: 3, 
    description: 'Brak pracowników w zespole tapicerskim', 
    impact: 'medium', 
    status: 'active', 
    reportDate: '2025-03-05',
    affectedOrders: 'Luxury 250'
  },
];

// Przykładowe dane dla wykresów
const PRODUCTION_PERFORMANCE_DATA = [
  { name: 'Tydzień 1', planowane: 4, zrealizowane: 3 },
  { name: 'Tydzień 2', planowane: 5, zrealizowane: 5 },
  { name: 'Tydzień 3', planowane: 6, zrealizowane: 5 },
  { name: 'Tydzień 4', planowane: 7, zrealizowane: 6 },
  { name: 'Tydzień 5', planowane: 5, zrealizowane: 5 },
  { name: 'Tydzień 6', planowane: 4, zrealizowane: 4 },
];

const PRODUCTION_EFFICIENCY_DATA = [
  { name: 'Kadłub', wydajność: 92 },
  { name: 'Lakierowanie', wydajność: 88 },
  { name: 'Montaż elektroniki', wydajność: 95 },
  { name: 'Montaż silnika', wydajność: 97 },
  { name: 'Tapicerka', wydajność: 90 },
  { name: 'Kontrola jakości', wydajność: 98 },
];

/**
 * Strona przeglądu produkcji
 */
export default function ProductionPage() {
  const [loading, setLoading] = useState(false);
  const [productionStats, setProductionStats] = useState(MOCK_PRODUCTION_STATS);
  const [productionOrders, setProductionOrders] = useState(MOCK_PRODUCTION_ORDERS);
  const [productionIssues, setProductionIssues] = useState(MOCK_PRODUCTION_ISSUES);
  const [performanceData, setPerformanceData] = useState(PRODUCTION_PERFORMANCE_DATA);
  const [efficiencyData, setEfficiencyData] = useState(PRODUCTION_EFFICIENCY_DATA);

  // Tutaj w rzeczywistej aplikacji pobieralibyśmy dane z API

  // Renderuj pasek postępu dla zleceń produkcyjnych
  const renderProgressBar = (progress: number) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-primary-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  // Renderuj badge statusu dla problemów produkcyjnych
  const renderIssueStatus = (status: string, impact: string) => {
    if (status === 'active') {
      return impact === 'high' 
        ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Aktywny</span>
        : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Aktywny</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Rozwiązany</span>;
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Produkcja</h2>
        <p className="mt-1 text-sm text-gray-500">Przegląd aktualnych zleceń produkcyjnych i wydajności</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {productionStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.name}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={
              index === 0 ? <Workflow size={20} /> :
              index === 1 ? <CheckCircle size={20} /> :
              index === 2 ? <Tool size={20} /> :
              <Factory size={20} />
            }
            iconBgColor={
              index === 0 ? "bg-primary-100" :
              index === 1 ? "bg-success-50" :
              index === 2 ? "bg-accent-100" :
              "bg-warning-50"
            }
            iconTextColor={
              index === 0 ? "text-primary-600" :
              index === 1 ? "text-success-500" :
              index === 2 ? "text-accent-600" :
              "text-warning-500"
            }
          />
        ))}
      </div>

      {/* Wykresy */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
        <ChartCard
          title="Realizacja produkcji"
          subtitle="Planowane vs. zrealizowane zlecenia produkcyjne"
          chartType="bar"
          data={performanceData}
          dataKeys={['planowane', 'zrealizowane']}
          colors={['#0ea5e9', '#10b981']}
          action={
            <Button href="/production/performance" size="sm" variant="outline">
              Pełny raport
            </Button>
          }
        />
        <ChartCard
          title="Wydajność linii produkcyjnych"
          subtitle="Procentowe wykorzystanie mocy produkcyjnych"
          chartType="bar"
          data={efficiencyData}
          dataKeys={['wydajność']}
          colors={['#0ea5e9']}
          action={
            <Button href="/production/resources" size="sm" variant="outline">
              Szczegóły
            </Button>
          }
        />
      </div>

      {/* Aktywne zlecenia produkcyjne */}
      <div className="mb-6">
        <StatusTable
          title="Aktywne zlecenia produkcyjne"
          detailsUrl="/production/orders"
          columns={[
            { key: 'name', header: 'Produkt' },
            { key: 'quantity', header: 'Ilość' },
            { 
              key: 'progress', 
              header: 'Postęp', 
              render: (progress) => (
                <div className="w-full max-w-xs">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{progress}%</span>
                  </div>
                  {renderProgressBar(progress)}
                </div>
              )
            },
            { 
              key: 'status', 
              header: 'Status', 
              render: (status) => <StatusTable.StatusBadge status={status} /> 
            },
            { 
              key: 'assignee', 
              header: 'Przypisane', 
            },
            { 
              key: 'startDate', 
              header: 'Data', 
              render: (startDate, item) => `${startDate} - ${item.endDate}` 
            }
          ]}
          data={productionOrders}
        />
      </div>

      {/* Problemy produkcyjne */}
      <div className="mb-6">
        <Card 
          title="Problemy produkcyjne" 
          subtitle="Aktualne problemy wpływające na produkcję"
          action={
            <Button 
              href="/production/issues" 
              size="sm" 
              variant="outline"
              icon={<AlertTriangle size={16} />}
            >
              Zarządzaj
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data zgłoszenia</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wpływ na</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productionIssues.map((issue, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{issue.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderIssueStatus(issue.status, issue.impact)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {issue.reportDate}
                      {issue.resolveDate && <div className="text-xs text-green-600">Rozwiązane: {issue.resolveDate}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {issue.affectedOrders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
