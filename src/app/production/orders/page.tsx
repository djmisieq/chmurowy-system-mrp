"use client";

import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Plus, Search, Edit, Trash, Eye, Filter, ArrowUpDown, Calendar, UserPlus, ExternalLink } from 'lucide-react';

// Typ zlecenia produkcyjnego
interface ProductionOrder {
  id: number;
  name: string;
  orderNumber: string;
  quantity: number;
  progress: number;
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startDate?: string;
  endDate?: string;
  assignee?: string;
  salesOrderId?: string;
  notes?: string;
}

// Przykładowe dane zleceń produkcyjnych
const MOCK_PRODUCTION_ORDERS: ProductionOrder[] = [
  { 
    id: 1, 
    name: 'Classic 180', 
    orderNumber: 'PROD-2025-001',
    quantity: 2, 
    progress: 65, 
    status: 'In Progress',
    priority: 'Medium',
    startDate: '2025-03-05', 
    endDate: '2025-03-15',
    assignee: 'Zespół A',
    salesOrderId: 'SO-2025-042',
    notes: 'Specjalne wykończenie tapicerki'
  },
  { 
    id: 2, 
    name: 'Sport 210', 
    orderNumber: 'PROD-2025-002',
    quantity: 1, 
    progress: 0, 
    status: 'Scheduled',
    priority: 'Medium', 
    startDate: '2025-03-18', 
    endDate: '2025-03-28',
    assignee: 'Zespół B',
    salesOrderId: 'SO-2025-051'
  },
  { 
    id: 3, 
    name: 'Luxury 250', 
    orderNumber: 'PROD-2025-003',
    quantity: 1, 
    progress: 0, 
    status: 'Scheduled',
    priority: 'High', 
    startDate: '2025-04-01', 
    endDate: '2025-04-18',
    assignee: 'Zespół C',
    salesOrderId: 'SO-2025-055'
  },
  { 
    id: 4, 
    name: 'Fishing Pro 190', 
    orderNumber: 'PROD-2025-004',
    quantity: 3, 
    progress: 0, 
    status: 'Pending',
    priority: 'Low', 
    startDate: '2025-04-20', 
    endDate: '2025-05-10',
    salesOrderId: 'SO-2025-072'
  },
  { 
    id: 5, 
    name: 'Sport 210 Custom', 
    orderNumber: 'PROD-2025-005',
    quantity: 1, 
    progress: 100, 
    status: 'Completed',
    priority: 'High', 
    startDate: '2025-02-15', 
    endDate: '2025-03-01',
    assignee: 'Zespół A',
    salesOrderId: 'SO-2025-039',
    notes: 'Niestandardowe wyposażenie elektroniczne'
  },
  { 
    id: 6, 
    name: 'Classic 180', 
    orderNumber: 'PROD-2025-006',
    quantity: 1, 
    progress: 0, 
    status: 'Cancelled',
    priority: 'Medium', 
    startDate: '2025-03-01', 
    endDate: '2025-03-12',
    salesOrderId: 'SO-2025-044',
    notes: 'Anulowane na prośbę klienta'
  },
];

/**
 * Strona zleceń produkcyjnych
 */
export default function ProductionOrdersPage() {
  const [orders, setOrders] = useState<ProductionOrder[]>(MOCK_PRODUCTION_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Filtrowanie zleceń
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.salesOrderId && order.salesOrderId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesPriority = !priorityFilter || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Otwórz szczegóły zlecenia
  const handleViewDetails = (order: ProductionOrder) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Otwórz formularz edycji
  const handleEdit = (order: ProductionOrder) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  // Otwórz potwierdzenie usunięcia
  const handleDeleteConfirm = (order: ProductionOrder) => {
    setSelectedOrder(order);
    setIsDeleteOpen(true);
  };

  // Usuń zlecenie
  const handleDelete = () => {
    if (selectedOrder) {
      setOrders(orders.filter(order => order.id !== selectedOrder.id));
      setIsDeleteOpen(false);
    }
  };

  // Funkcja renderująca statusy
  const renderStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="default" dot>Oczekujące</Badge>;
      case 'Scheduled':
        return <Badge variant="info" dot>Zaplanowane</Badge>;
      case 'In Progress':
        return <Badge variant="warning" dot>W realizacji</Badge>;
      case 'Completed':
        return <Badge variant="success" dot>Zakończone</Badge>;
      case 'Cancelled':
        return <Badge variant="danger" dot>Anulowane</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Funkcja renderująca priorytety
  const renderPriority = (priority: string) => {
    switch (priority) {
      case 'Low':
        return <span className="text-green-600">Niski</span>;
      case 'Medium':
        return <span className="text-blue-600">Średni</span>;
      case 'High':
        return <span className="text-orange-600">Wysoki</span>;
      case 'Critical':
        return <span className="text-red-600 font-semibold">Krytyczny</span>;
      default:
        return <span>{priority}</span>;
    }
  };

  // Pasek postępu
  const renderProgressBar = (progress: number) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Zlecenia produkcyjne</h2>
        <p className="mt-1 text-sm text-gray-500">Zarządzanie zleceniami produkcyjnymi i ich statusami</p>
      </div>

      {/* Filtry i wyszukiwanie */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              placeholder="Szukaj zleceń..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              fullWidth
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              placeholder="Filtruj po statusie"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Wszystkie statusy' },
                { value: 'Pending', label: 'Oczekujące' },
                { value: 'Scheduled', label: 'Zaplanowane' },
                { value: 'In Progress', label: 'W realizacji' },
                { value: 'Completed', label: 'Zakończone' },
                { value: 'Cancelled', label: 'Anulowane' },
              ]}
              size="md"
            />
            <Select
              placeholder="Filtruj po priorytecie"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: '', label: 'Wszystkie priorytety' },
                { value: 'Low', label: 'Niski' },
                { value: 'Medium', label: 'Średni' },
                { value: 'High', label: 'Wysoki' },
                { value: 'Critical', label: 'Krytyczny' },
              ]}
              size="md"
            />
            <Button 
              variant="primary" 
              icon={<Plus size={18} />}
              onClick={() => {
                setSelectedOrder(null);
                setIsFormOpen(true);
              }}
            >
              Nowe zlecenie
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabela zleceń */}
      <Card className="mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Numer/Nazwa
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ilość
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Postęp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorytet
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Przypisane
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Akcje</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    Nie znaleziono zleceń produkcyjnych spełniających kryteria
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.quantity} szt.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full max-w-xs">
                          <div className="text-xs mb-1">{order.progress}%</div>
                          {renderProgressBar(order.progress)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatus(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPriority(order.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.startDate && order.endDate ? (
                        <div>
                          <div>{order.startDate}</div>
                          <div>{order.endDate}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Nie zaplanowano</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.assignee || (
                        <span className="text-gray-400">Nie przypisano</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewDetails(order)}
                          className="text-gray-400 hover:text-primary-600"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEdit(order)}
                          className="text-gray-400 hover:text-primary-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteConfirm(order)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal ze szczegółami zlecenia */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Szczegóły zlecenia: ${selectedOrder?.orderNumber}`}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <div>
              {selectedOrder?.status !== 'Completed' && selectedOrder?.status !== 'Cancelled' && (
                <Button 
                  variant="outline"
                  icon={<UserPlus size={16} />}
                  onClick={() => setIsDetailOpen(false)}
                >
                  Przypisz zespół
                </Button>
              )}
            </div>
            <div className="space-x-3">
              <Button 
                variant="outline"
                onClick={() => setIsDetailOpen(false)}
              >
                Zamknij
              </Button>
              <Button 
                variant="primary"
                icon={<Edit size={16} />}
                onClick={() => {
                  setIsDetailOpen(false);
                  if (selectedOrder) handleEdit(selectedOrder);
                }}
              >
                Edytuj
              </Button>
            </div>
          </div>
        }
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Informacje podstawowe</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block">Nazwa produktu</span>
                    <span className="font-medium">{selectedOrder.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Numer zlecenia</span>
                    <span className="font-medium">{selectedOrder.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Ilość</span>
                    <span className="font-medium">{selectedOrder.quantity} szt.</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Status</span>
                    {renderStatus(selectedOrder.status)}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Priorytet</span>
                    {renderPriority(selectedOrder.priority)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Postęp i planowanie</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block">Postęp realizacji</span>
                    <div className="mt-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{selectedOrder.progress}%</span>
                      </div>
                      {renderProgressBar(selectedOrder.progress)}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Data rozpoczęcia</span>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium">{selectedOrder.startDate || "Nie zaplanowano"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Data zakończenia</span>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium">{selectedOrder.endDate || "Nie zaplanowano"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Przypisanie</span>
                    <span className="font-medium">{selectedOrder.assignee || "Nie przypisano"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Powiązania i uwagi</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                {selectedOrder.salesOrderId && (
                  <div>
                    <span className="text-xs text-gray-500 block">Zamówienie sprzedaży</span>
                    <div className="flex items-center">
                      <ExternalLink size={16} className="text-primary-500 mr-2" />
                      <a href={`/orders/sales/${selectedOrder.salesOrderId}`} className="text-primary-600 hover:underline">
                        {selectedOrder.salesOrderId}
                      </a>
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="text-xs text-gray-500 block">Uwagi</span>
                  <p className="text-gray-700 mt-1">
                    {selectedOrder.notes || "Brak uwag"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal z formularzem */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedOrder ? "Edycja zlecenia produkcyjnego" : "Nowe zlecenie produkcyjne"}
        size="lg"
        footer={
          <Modal.Footer
            onClose={() => setIsFormOpen(false)}
            onConfirm={() => {
              // W rzeczywistej aplikacji tutaj byłaby walidacja i zapisywanie
              setIsFormOpen(false);
            }}
            confirmText={selectedOrder ? "Zapisz zmiany" : "Utwórz zlecenie"}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Nazwa produktu"
            value={selectedOrder?.name || ''}
            fullWidth
            required
          />
          <Input
            label="Numer zlecenia"
            value={selectedOrder?.orderNumber || 'PROD-2025-XXX'}
            fullWidth
            required
          />
          <Input
            label="Ilość"
            type="number"
            min="1"
            value={selectedOrder?.quantity.toString() || '1'}
            fullWidth
            required
          />
          <Select
            label="Status"
            value={selectedOrder?.status || 'Pending'}
            options={[
              { value: 'Pending', label: 'Oczekujące' },
              { value: 'Scheduled', label: 'Zaplanowane' },
              { value: 'In Progress', label: 'W realizacji' },
              { value: 'Completed', label: 'Zakończone' },
              { value: 'Cancelled', label: 'Anulowane' },
            ]}
            fullWidth
            required
          />
          <Select
            label="Priorytet"
            value={selectedOrder?.priority || 'Medium'}
            options={[
              { value: 'Low', label: 'Niski' },
              { value: 'Medium', label: 'Średni' },
              { value: 'High', label: 'Wysoki' },
              { value: 'Critical', label: 'Krytyczny' },
            ]}
            fullWidth
            required
          />
          <Input
            label="Postęp (%)"
            type="number"
            min="0"
            max="100"
            value={selectedOrder?.progress.toString() || '0'}
            fullWidth
          />
          <Input
            label="Data rozpoczęcia"
            type="date"
            value={selectedOrder?.startDate || ''}
            fullWidth
          />
          <Input
            label="Data zakończenia"
            type="date"
            value={selectedOrder?.endDate || ''}
            fullWidth
          />
          <Input
            label="Przypisanie"
            value={selectedOrder?.assignee || ''}
            fullWidth
          />
          <Input
            label="Powiązane zamówienie sprzedaży"
            value={selectedOrder?.salesOrderId || ''}
            fullWidth
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uwagi
          </label>
          <textarea
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={selectedOrder?.notes || ''}
          ></textarea>
        </div>
      </Modal>

      {/* Modal usuwania */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Potwierdź usunięcie"
        size="sm"
        footer={
          <Modal.Footer
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
            confirmText="Usuń"
            danger
          />
        }
      >
        <div className="py-4">
          <p className="text-gray-700">
            Czy na pewno chcesz usunąć zlecenie <strong>{selectedOrder?.orderNumber}</strong>?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Ta operacja jest nieodwracalna.
          </p>
        </div>
      </Modal>
    </MainLayout>
  );
}
