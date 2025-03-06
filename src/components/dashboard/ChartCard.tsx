"use client";

import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Card from '../ui/Card';

// Define chart data types
type ChartData = {
  name: string;
  [key: string]: any;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  chartType: 'bar' | 'line' | 'pie' | 'stacked-bar';
  data: ChartData[];
  dataKeys?: string[];
  colors?: string[];
  height?: number;
  className?: string;
  action?: React.ReactNode;
  loading?: boolean;
  xAxisDataKey?: string;
  barSize?: number;
  hideAxis?: boolean;
  tooltip?: boolean;
  legend?: boolean;
}

/**
 * ChartCard component for dashboard visualizations
 * Supports Bar, Line, and Pie charts with consistent styling
 */
const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  chartType,
  data,
  dataKeys = ['value'],
  colors = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'],
  height = 300,
  className = '',
  action,
  loading = false,
  xAxisDataKey = 'name',
  barSize,
  hideAxis = false,
  tooltip = true,
  legend = true
}) => {
  if (loading) {
    return (
      <Card title={title} subtitle={subtitle} className={className}>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Card>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} barSize={barSize}>
              {!hideAxis && <CartesianGrid strokeDasharray="3 3" />}
              {!hideAxis && <XAxis dataKey={xAxisDataKey} />}
              {!hideAxis && <YAxis />}
              {tooltip && <Tooltip />}
              {legend && <Legend />}
              {dataKeys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'stacked-bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} barSize={barSize}>
              {!hideAxis && <CartesianGrid strokeDasharray="3 3" />}
              {!hideAxis && <XAxis dataKey={xAxisDataKey} />}
              {!hideAxis && <YAxis />}
              {tooltip && <Tooltip />}
              {legend && <Legend />}
              {dataKeys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  stackId="a"
                  fill={colors[index % colors.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              {!hideAxis && <CartesianGrid strokeDasharray="3 3" />}
              {!hideAxis && <XAxis dataKey={xAxisDataKey} />}
              {!hideAxis && <YAxis />}
              {tooltip && <Tooltip />}
              {legend && <Legend />}
              {dataKeys.map((key, index) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                nameKey={xAxisDataKey}
                dataKey={dataKeys[0]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {tooltip && <Tooltip />}
              {legend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
            <p className="text-gray-500">Nieobsługiwany typ wykresu</p>
          </div>
        );
    }
  };

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={action}
      className={className}
    >
      {data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <p className="text-gray-500">Brak danych do wyświetlenia</p>
        </div>
      ) : (
        renderChart()
      )}
    </Card>
  );
};

export default ChartCard;