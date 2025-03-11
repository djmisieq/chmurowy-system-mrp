"use client";

import React from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface Column<T> {
  key: string;
  title: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  sortConfig?: SortConfig;
  onSort?: (sortConfig: SortConfig) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  stripedRows?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  bordered?: boolean;
  className?: string;
  zebra?: boolean;
}

/**
 * Reusable Table component with sorting, loading state, and customizable styles
 */
function Table<T>({
  data,
  columns,
  keyExtractor,
  sortConfig,
  onSort,
  isLoading = false,
  emptyMessage = "Brak danych do wyświetlenia",
  stripedRows = false,
  hoverable = true,
  compact = false,
  bordered = true,
  className = '',
  zebra = false,
}: TableProps<T>) {
  // Handler for column header click (sorting)
  const handleSort = (key: string) => {
    if (!onSort) return;
    
    // If already sorting by this column, toggle direction
    if (sortConfig?.key === key) {
      onSort({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // New sort column, default to ascending
      onSort({
        key,
        direction: 'asc',
      });
    }
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown size={16} className="ml-1 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={16} className="ml-1 text-primary-500" />
    ) : (
      <ChevronDown size={16} className="ml-1 text-primary-500" />
    );
  };

  // Generate alignment class
  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'left':
      default:
        return 'text-left';
    }
  };

  // Base table classes
  const tableClasses = `
    w-full
    ${bordered ? 'border border-neutral-200' : ''}
    ${className}
  `.trim();
  
  // Header classes
  const headerClasses = `
    bg-neutral-50
    text-neutral-700
    text-sm
    font-medium
    ${bordered ? 'border-b border-neutral-200' : ''}
  `.trim();
  
  // Row classes
  const getRowClasses = (index: number) => `
    ${hoverable ? 'hover:bg-primary-50' : ''}
    ${zebra && index % 2 === 1 ? 'bg-neutral-50' : ''}
    ${bordered ? 'border-t border-neutral-200' : ''}
    ${isLoading ? 'opacity-50' : ''}
    transition-colors
  `.trim();
  
  // Cell classes
  const cellClasses = `
    ${compact ? 'px-3 py-2' : 'px-4 py-3'}
    ${bordered ? 'border-r border-neutral-200 last:border-r-0' : ''}
    text-sm
  `.trim();

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        <thead className={headerClasses}>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                className={`${cellClasses} ${getAlignmentClass(column.align)}`}
                style={{ width: column.width }}
              >
                {column.sortable && onSort ? (
                  <button
                    className="flex items-center font-medium focus:outline-none"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.title}
                    {getSortIcon(column.key)}
                  </button>
                ) : (
                  column.title
                )}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className={`${cellClasses} text-center text-neutral-500 py-8`}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr 
                key={keyExtractor(item)} 
                className={getRowClasses(index)}
              >
                {columns.map((column) => (
                  <td 
                    key={`${keyExtractor(item)}-${column.key}`}
                    className={`${cellClasses} ${getAlignmentClass(column.align)}`}
                  >
                    {column.render 
                      ? column.render(item, index)
                      // @ts-ignore - Safely access dynamic property
                      : item[column.key] || '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
