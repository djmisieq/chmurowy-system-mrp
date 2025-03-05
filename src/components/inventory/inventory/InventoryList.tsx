import React from 'react';
import { Eye, Play, XCircle, Calendar, Users, CheckCircle } from 'lucide-react';
import { Inventory, formatDate } from '../mockInventory';

interface InventoryListProps {
  inventories: Inventory[];
  activeTab: 'active' | 'completed';
  onViewDetails: (id: number) => void;
  onStartInventory: (id: number) => void;
  onCancelInventory: (id: number) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({
  inventories,
  activeTab,
  onViewDetails,
  onStartInventory,
  onCancelInventory
}) => {
  // Pobierz status jako tekst i kolor
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'planned':
        return { label: 'Zaplanowana', color: 'bg-blue-100 text-blue-800' };
      case 'in_progress':
        return { label: 'W trakcie', color: 'bg-yellow-100 text-yellow-800' };
      case 'completed':
        return { label: 'Zakończona', color: 'bg-green-100 text-green-800' };
      case 'approved':
        return { label: 'Zatwierdzona', color: 'bg-green-100 text-green-800' };
      case 'canceled':
        return { label: 'Anulowana', color: 'bg-red-100 text-red-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  // Typ inwentaryzacji jako tekst
  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'full':
        return 'Pełna';
      case 'partial':
        return 'Częściowa';
      case 'random':
        return 'Wyrywkowa';
      default:
        return type;
    }
  };
  
  // Oblicz postęp inwentaryzacji
  const calculateProgress = (inventory: Inventory) => {
    if (inventory.items.length === 0) return 0;
    
    const countedItems = inventory.items.filter(item => item.status !== 'pending').length;
    return Math.round((countedItems / inventory.items.length) * 100);
  };
  
  return (
    <div className="overflow-hidden">
      {inventories.length === 0 ? (
        <div className="text-center py-16 px-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Brak inwentaryzacji</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'active'
              ? 'Nie masz żadnych aktywnych inwentaryzacji. Zaplanuj nową inwentaryzację.'
              : 'Nie masz żadnych zakończonych inwentaryzacji.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {inventories.map((inventory) => {
            const statusDisplay = getStatusDisplay(inventory.status);
            const progress = calculateProgress(inventory);
            
            return (
              <div key={inventory.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="text-sm font-medium text-primary-600 truncate mr-2">
                      {inventory.name}
                    </p>
                    <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                        {statusDisplay.label}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getTypeDisplay(inventory.type)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <button
                      onClick={() => onViewDetails(inventory.id)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      title="Szczegóły"
                    >
                      <Eye size={18} />
                    </button>
                    
                    {inventory.status === 'planned' && (
                      <button
                        onClick={() => onStartInventory(inventory.id)}
                        className="ml-2 text-primary-500 hover:text-primary-700"
                        title="Rozpocznij"
                      >
                        <Play size={18} />
                      </button>
                    )}
                    
                    {(inventory.status === 'planned' || inventory.status === 'in_progress') && (
                      <button
                        onClick={() => onCancelInventory(inventory.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Anuluj"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="sm:flex sm:justify-between mt-2">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500 mr-6">
                      <Calendar size={16} className="flex-shrink-0 mr-1.5 text-gray-400" />
                      <span>{formatDate(inventory.planDate)}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Users size={16} className="flex-shrink-0 mr-1.5 text-gray-400" />
                      <span>{inventory.assignedUsers.join(', ')}</span>
                    </div>
                  </div>
                  
                  {inventory.status === 'in_progress' && (
                    <div className="mt-2 sm:mt-0 flex items-center">
                      <span className="text-xs text-gray-500 mr-2">Postęp:</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-700">{progress}%</span>
                    </div>
                  )}
                  
                  {inventory.status === 'completed' && (
                    <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500">
                      <CheckCircle size={16} className="flex-shrink-0 mr-1.5 text-green-500" />
                      <span>Zakończono {inventory.endDate ? formatDate(inventory.endDate) : ''}</span>
                    </div>
                  )}
                </div>
                
                {inventory.description && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 line-clamp-1">{inventory.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryList;