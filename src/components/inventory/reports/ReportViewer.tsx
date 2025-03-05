import React, { useState } from 'react';
import { ArrowLeft, Download, Printer, Settings, FileBarChart } from 'lucide-react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ReportType } from '../mockReports';

// Kolory dla wykresów
const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

interface ReportViewerProps {
  reportType: ReportType;
  reportData: any;
  onBackToConfig: () => void;
  onNewReport: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({
  reportType,
  reportData,
  onBackToConfig,
  onNewReport
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('chart');
  
  // Jeśli wystąpił błąd
  if (reportData.error) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-red-50 border-b border-red-200">
          <h3 className="text-lg leading-6 font-medium text-red-700">
            Błąd generowania raportu
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-red-500">
            {reportData.error}
          </p>
        </div>
        <div className="p-4 flex justify-end">
          <button
            type="button"
            onClick={onNewReport}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Wybierz inny raport
          </button>
        </div>
      </div>
    );
  }
  
  // Formatuj wartość liczbową
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pl-PL').format(num);
  };
  
  // Formatuj wartość pieniężną
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };
  
  // Funkcja generująca wykres w zależności od typu raportu
  const renderChart = () => {
    // Jeśli raport nie ma danych do wykresu
    if (!reportData.chartData || reportData.chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-80 bg-gray-50 rounded-md">
          <p className="text-gray-500">Brak danych do wyświetlenia na wykresie</p>
        </div>
      );
    }
    
    // Wykresy dla poszczególnych typów raportów
    switch (reportType) {
      case 'inventory_status':
        // Wykres słupkowy podziału na kategorie
        const categoryData = Object.entries(
          reportData.data.reduce((acc: Record<string, number>, item: any) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {})
        ).map(([name, value]) => ({ name, value }));
        
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} elementów`, 'Liczba']} />
                <Bar dataKey="value" name="Liczba elementów" fill="#0088FE">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'low_stock':
        // Wykres słupkowy elementów o niskim stanie (top 10)
        const lowStockData = [...reportData.data]
          .sort((a, b) => a.percentage - b.percentage)
          .slice(0, 10)
          .map(item => ({
            name: item.name,
            currentStock: item.stock,
            minStock: item.minStock
          }));
        
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lowStockData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="currentStock" name="Stan aktualny" fill="#FF8042" />
                <Bar dataKey="minStock" name="Stan minimalny" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'inventory_value':
        // Wykres kołowy lub słupkowy w zależności od liczby kategorii
        if (reportData.chartData.length <= 6) {
          return (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {reportData.chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Wartość']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          );
        } else {
          return (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData.chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Wartość']} />
                  <Bar dataKey="value" name="Wartość" fill="#0088FE">
                    {reportData.chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        }
        
      case 'turnover':
        // Wykres liniowy obrotów w czasie
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={reportData.chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
                <Legend />
                <Line type="monotone" dataKey="inbound" name="Przyjęcia" stroke="#00C49F" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="outbound" name="Wydania" stroke="#FF8042" />
                <Line type="monotone" dataKey="balance" name="Bilans" stroke="#0088FE" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'category_distribution':
        // Wykres kołowy lub słupkowy w zależności od parametru
        if (reportData.chartType === 'pie') {
          return (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {reportData.chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [
                    reportData.parameters.value_type === 'count' 
                      ? `${formatNumber(value as number)} elementów` 
                      : formatCurrency(value as number),
                    ''
                  ]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          );
        } else {
          return (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData.chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip formatter={(value) => [
                    reportData.parameters.value_type === 'count' 
                      ? `${formatNumber(value as number)} elementów` 
                      : formatCurrency(value as number),
                    ''
                  ]} />
                  <Bar dataKey="value" name={reportData.parameters.value_type === 'count' ? 'Liczba elementów' : 'Wartość'} fill="#0088FE">
                    {reportData.chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        }
        
      case 'location_usage':
        // Wykres słupkowy wykorzystania lokalizacji
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData.chartData.slice(0, 10)} // Top 10 locations
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Wykorzystanie']} />
                <Bar dataKey="usage" name="Wykorzystanie (%)" fill="#0088FE">
                  {reportData.chartData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.usage >= reportData.parameters.threshold ? '#FF8042' : 
                        entry.usage >= 50 ? '#FFBB28' : '#00C49F'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-80 bg-gray-50 rounded-md">
            <p className="text-gray-500">Brak dostępnej wizualizacji dla tego typu raportu</p>
          </div>
        );
    }
  };
  
  // Render tabeli danych
  const renderDataTable = () => {
    if (!reportData.data || reportData.data.length === 0) {
      return (
        <div className="flex items-center justify-center h-80 bg-gray-50 rounded-md">
          <p className="text-gray-500">Brak danych do wyświetlenia w tabeli</p>
        </div>
      );
    }
    
    // Pobierz nagłówki z pierwszego wiersza danych
    const headers = Object.keys(reportData.data[0]);
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/Id$/, 'ID')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.data.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {headers.map(header => (
                  <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderCellValue(header, row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render wartości komórki
  const renderCellValue = (header: string, value: any) => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Tak' : 'Nie';
    }
    
    if (header.includes('percentage') || header.includes('Percentage')) {
      return `${value}%`;
    }
    
    if (header.includes('value') || header.includes('Value') || header.includes('price') || 
        header.includes('Price') || header.includes('cost') || header.includes('Cost')) {
      return formatCurrency(Number(value));
    }
    
    if (typeof value === 'number') {
      return formatNumber(value);
    }
    
    return value.toString();
  };
  
  // Generowanie podsumowania raportu
  const renderSummary = () => {
    if (!reportData.summary) return null;
    
    const summaryItems = Object.entries(reportData.summary).map(([key, value]) => {
      let formattedValue = value;
      let formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      
      // Format appropriate values
      if (typeof value === 'number') {
        if (key.toLowerCase().includes('value') || key.toLowerCase().includes('balance')) {
          formattedValue = formatCurrency(value as number);
        } else {
          formattedValue = formatNumber(value as number);
        }
      }
      
      return { key: formattedKey, value: formattedValue };
    });
    
    return (
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Podsumowanie raportu</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryItems.map(item => (
            <div key={item.key} className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs text-gray-500">{item.key}</p>
              <p className="text-lg font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            type="button"
            onClick={onBackToConfig}
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {reportData.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Wygenerowano: {new Date().toLocaleString('pl-PL')}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => alert('Eksport do Excel/CSV')}
          >
            <Download size={16} className="mr-1" />
            Eksportuj
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => alert('Drukowanie raportu')}
          >
            <Printer size={16} className="mr-1" />
            Drukuj
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onBackToConfig}
          >
            <Settings size={16} className="mr-1" />
            Parametry
          </button>
        </div>
      </div>
      
      {/* Przyciski przełączania zakładek */}
      <div className="bg-white border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            className={`${
              activeTab === 'chart'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('chart')}
          >
            Wykres
          </button>
          <button
            className={`${
              activeTab === 'table'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('table')}
          >
            Dane
          </button>
        </nav>
      </div>
      
      {/* Zawartość raportu */}
      <div className="p-4">
        {activeTab === 'chart' ? renderChart() : renderDataTable()}
      </div>
      
      {/* Podsumowanie */}
      {renderSummary()}
      
      {/* Przyciski akcji */}
      <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button
          type="button"
          onClick={onNewReport}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FileBarChart size={16} className="mr-2" />
          Nowy raport
        </button>
        <button
          type="button"
          onClick={onBackToConfig}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Settings size={16} className="mr-2" />
          Zmień parametry raportu
        </button>
      </div>
    </div>
  );
};

export default ReportViewer;