import React from 'react';
import { Eye, Play, XCircle, Calendar, Users, CheckCircle } from 'lucide-react';
import { Inventory, formatDate } from '../mockInventory';
import Badge from '@/components/ui/Badge';
import Tooltip from '@/components/ui/Tooltip';
import Dropdown from '@/components/ui/Dropdown';

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
        return { label: 'Zaplanowana', variant: 'info' as const };
      case 'in_progress':
        return { label: 'W trakcie', variant: 'warning' as const };
      case 'completed':
        return { label: 'Zakończona', variant: 'success' as const };
      case 'approved':
        return { label: 'Zatwierdzona', variant: 'success' as const };
      case 'canceled':
        return { label: 'Anulowana', variant: 'danger' as const };
      default:
        return { label: status, variant: 'default' as const };
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

  // Utwórz menu akcji dla każdej inwentaryzacji
  const getActionMenu = (inventory: Inventory) => {
    const actions = [
      { 
        id: 'view', 
        label: 'Zobacz szczegóły', 
        icon: <Eye size={16} />, 
        onClick: () => onViewDetails(inventory.id) 
      }
    ];

    if (inventory.status === 'planned') {
      actions.push({ 
        id: 'start', 
        label: 'Rozpocznij inwentaryzację', 
        icon: <Play size={16} />, 
        onClick: () => onStartInventory(inventory.id) 
      });
    }

    if (inventory.status === 'planned' || inventory.status === 'in_progress') {
      actions.push({ 
        id: 'cancel', 
        label: 'Anuluj inwentaryzację', 
        icon: <XCircle size={16} />, 
        onClick: () => onCancelInventory(inventory.id) 
      });
    }

    return actions;
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
            const actionMenu = getActionMenu(inventory);
            
            return (
              <div key={inventory.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="text-sm font-medium text-primary-600 truncate mr-2">
                      {inventory.name}
                    </p>
                    <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                      <Badge variant={statusDisplay.variant} size="sm">
                        {statusDisplay.label}
                      </Badge>
                      <Badge size="sm">
                        {getTypeDisplay(inventory.type)}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <Dropdown
                      trigger={
                        <button className="text-gray-500 hover:text-gray-700 p-1 rounded">
                          <Eye size={18} />
                        </button>
                      }
                      items={actionMenu}
                      align="right"
                      width="w-56"
                    />
                  </div>
                </div>
                
                <div className="sm:flex sm:justify-between mt-2">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500 mr-6">
                      <Tooltip content="Data zaplanowania" position="top">
                        <div className="flex items-center">
                          <Calendar size={16} className="flex-shrink-0 mr-1.5 text-gray-400" />
                          <span>{formatDate(inventory.planDate)}</span>
                        </div>
                      </Tooltip>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Tooltip content="Przypisani użytkownicy" position="top">
                        <div className="flex items-center">
                          <Users size={16} className="flex-shrink-0 mr-1.5 text-gray-400" />
                          <span>{inventory.assignedUsers.join(', ')}</span>
                        </div>
                      </Tooltip>
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
                      <Tooltip content="Data zakończenia" position="top">
                        <div className="flex items-center">
                          <CheckCircle size={16} className="flex-shrink-0 mr-1.5 text-success-500" />
                          <span>Zakończono {inventory.endDate ? formatDate(inventory.endDate) : ''}</span>
                        </div>
                      </Tooltip>
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