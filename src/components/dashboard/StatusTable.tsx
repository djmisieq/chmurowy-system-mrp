"use client";

import React from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface StatusTableProps {
  title: string;
  columns: {
    key: string;
    header: string;
    width?: string;
    render?: (value: any, item: any) => React.ReactNode;
  }[];
  data: any[];
  detailsUrl?: string;
  emptyMessage?: string;
  loading?: boolean;
  compact?: boolean;
}

/**
 * StatusTable component for displaying inventory, production status, etc.
 */
const StatusTable: React.FC<StatusTableProps> = ({
  title,
  columns,
  data,
  detailsUrl,
  emptyMessage = "Brak danych do wyświetlenia",
  loading = false,
  compact = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
        <div className="border-t border-gray-200 p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">Ładowanie...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        {detailsUrl && (
          <Button 
            href={detailsUrl}
            variant="outline"
            size="sm"
          >
            Szczegóły
          </Button>
        )}
      </div>
      <div className="border-t border-gray-200">
        {data.length === 0 ? (
          <div className="p-6 text-center text-gray-500">{emptyMessage}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(column => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width || ''}`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map(column => (
                      <td 
                        key={`${index}-${column.key}`} 
                        className={`px-6 py-${compact ? '3' : '4'} whitespace-nowrap text-sm ${column.key === 'name' ? 'font-medium text-gray-900' : 'text-gray-500'}`}
                      >
                        {column.render 
                          ? column.render(item[column.key], item) 
                          : item[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components for table rendering
StatusTable.StatusBadge = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case 'good':
    case 'normal':
    case 'scheduled':
    case 'completed':
      return <Badge variant="success" dot>{status === 'good' ? 'Dobry' : status === 'normal' ? 'Normalny' : status === 'scheduled' ? 'Zaplanowano' : 'Zakończono'}</Badge>;
      
    case 'warning':
    case 'low':
    case 'pending':
    case 'waiting':
      return <Badge variant="warning" dot>{status === 'warning' ? 'Ostrzeżenie' : status === 'low' ? 'Niski stan' : status === 'pending' ? 'Oczekujący' : 'Oczekiwanie'}</Badge>;
      
    case 'critical':
    case 'overdue':
    case 'error':
      return <Badge variant="danger" dot>{status === 'critical' ? 'Krytyczny' : status === 'overdue' ? 'Opóźniony' : 'Błąd'}</Badge>;
      
    case 'in progress':
    case 'active':
      return <Badge variant="info" dot>{status === 'in progress' ? 'W trakcie' : 'Aktywny'}</Badge>;
      
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

export default StatusTable;