"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search,
  RefreshCw,
  Filter,
  ArrowDownUp 
} from 'lucide-react';
import axios from 'axios';
import { RouteOperation, ProductionRoute } from '@/types/route.types';
import RouteOperationsList from './RouteOperationsList';
import RouteOperationModal from './RouteOperationModal';

interface RouteOperationsEditorProps {
  routeId: string;
  onRouteUpdate?: (route: ProductionRoute) => void;
}

const RouteOperationsEditor: React.FC<RouteOperationsEditorProps> = ({
  routeId,
  onRouteUpdate
}) => {
  // State
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<ProductionRoute | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<RouteOperation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNewOperation, setIsNewOperation] = useState(false);
  const [parentOperationId, setParentOperationId] = useState<string | undefined>(undefined);
  
  // Reference data
  const [workCenters, setWorkCenters] = useState<{ id: string; name: string }[]>([]);
  const [resources, setResources] = useState<{ id: string; name: string; type: string }[]>([]);
  const [materials, setMaterials] = useState<{ id: string; name: string; unit: string }[]>([]);

  // Load route data and reference data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be fetched from an API with the specific route ID
        // For mock data, we'll find it from all routes
        const routesResponse = await axios.get('/production-routes.json');
        const allRoutes: ProductionRoute[] = routesResponse.data;
        const currentRoute = allRoutes.find(r => r.id === routeId);
        
        if (currentRoute) {
          setRoute(currentRoute);
        }
        
        // Fetch reference data
        const workCentersResponse = await axios.get('/work-centers.json');
        setWorkCenters(workCentersResponse.data || []);
        
        const resourcesResponse = await axios.get('/resources.json');
        setResources(resourcesResponse.data || []);
        
        const materialsResponse = await axios.get('/materials.json');
        setMaterials(materialsResponse.data || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback for demo
        setWorkCenters([
          { id: 'WC-001', name: 'Stanowisko formowania' },
          { id: 'WC-002', name: 'Stanowisko montażu' },
          { id: 'WC-003', name: 'Stanowisko wykończeniowe' }
        ]);
        
        setResources([
          { id: 'RES-001', name: 'Forma kadłubowa 18ft', type: 'tool' },
          { id: 'RES-002', name: 'Pracownik montażowy', type: 'personnel' },
          { id: 'RES-003', name: 'Szlifierka kątowa', type: 'machine' }
        ]);
        
        setMaterials([
          { id: 'MAT-001', name: 'Żywica epoksydowa', unit: 'kg' },
          { id: 'MAT-002', name: 'Mata szklana 450g', unit: 'm²' },
          { id: 'MAT-003', name: 'Żelkot biały', unit: 'kg' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [routeId]);

  // Handle opening the modal for adding a new operation
  const handleAddOperation = (parentId?: string) => {
    setSelectedOperation(null);
    setIsNewOperation(true);
    setParentOperationId(parentId);
    setModalOpen(true);
  };

  // Handle opening the modal for editing an existing operation
  const handleEditOperation = (operation: RouteOperation) => {
    setSelectedOperation(operation);
    setIsNewOperation(false);
    setParentOperationId(undefined);
    setModalOpen(true);
  };

  // Handle deleting an operation
  const handleDeleteOperation = async (operationId: string) => {
    if (!route) return;
    
    const confirmed = window.confirm('Czy na pewno chcesz usunąć tę operację?');
    if (!confirmed) return;

    // Remove the operation from the route
    const updatedOperations = route.operations.filter(op => op.id !== operationId);
    
    // Also check if this operation is a dependency for any other operation
    // and remove it from their predecessorOperations
    updatedOperations.forEach(op => {
      if (op.predecessorOperations?.includes(operationId)) {
        op.predecessorOperations = op.predecessorOperations.filter(id => id !== operationId);
      }
    });
    
    const updatedRoute = {
      ...route,
      operations: updatedOperations
    };
    
    setRoute(updatedRoute);
    
    // In a real app, you would save these changes to the backend
    // For now, we'll just update the local state
    if (onRouteUpdate) {
      onRouteUpdate(updatedRoute);
    }
  };

  // Handle saving an operation (new or updated)
  const handleSaveOperation = (operation: RouteOperation, isSubOperation = false) => {
    if (!route) return;
    
    let updatedRoute: ProductionRoute;
    
    if (isSubOperation && parentOperationId) {
      // Adding/updating a sub-operation
      const parentIndex = route.operations.findIndex(op => op.id === parentOperationId);
      
      if (parentIndex !== -1) {
        // Create a copy of operations array
        const updatedOperations = [...route.operations];
        
        // Check if sub-operation already exists or is new
        const subOpIndex = updatedOperations[parentIndex].subOperations?.findIndex(
          sub => sub.id === operation.id
        ) ?? -1;
        
        // Initialize subOperations array if it doesn't exist
        if (!updatedOperations[parentIndex].subOperations) {
          updatedOperations[parentIndex].subOperations = [];
        }
        
        // Update or add the sub-operation
        if (subOpIndex !== -1) {
          updatedOperations[parentIndex].subOperations![subOpIndex] = operation;
        } else {
          updatedOperations[parentIndex].subOperations!.push(operation);
        }
        
        updatedRoute = {
          ...route,
          operations: updatedOperations
        };
      } else {
        // Parent operation not found, just return
        return;
      }
    } else if (isNewOperation) {
      // Adding a new top-level operation
      updatedRoute = {
        ...route,
        operations: [...route.operations, operation]
      };
    } else {
      // Updating an existing top-level operation
      updatedRoute = {
        ...route,
        operations: route.operations.map(op => 
          op.id === operation.id ? operation : op
        )
      };
    }
    
    setRoute(updatedRoute);
    setModalOpen(false);
    
    // In a real app, you would save these changes to the backend
    // For now, we'll just update the local state
    if (onRouteUpdate) {
      onRouteUpdate(updatedRoute);
    }
  };

  // Handle reordering operations
  const handleReorderOperations = (operations: RouteOperation[]) => {
    if (!route) return;
    
    const updatedRoute = {
      ...route,
      operations
    };
    
    setRoute(updatedRoute);
    
    // In a real app, you would save these changes to the backend
    // For now, we'll just update the local state
    if (onRouteUpdate) {
      onRouteUpdate(updatedRoute);
    }
  };

  // Filtered operations based on search term
  const filteredOperations = route?.operations.filter(op => 
    op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.workCenterName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Operacje marszruty</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Szukaj operacji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => {}}
            className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
            title="Filtry"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={() => {}}
            className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
            title="Odśwież"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => handleAddOperation()}
            className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition flex items-center"
          >
            <Plus size={18} className="mr-1" /> Dodaj operację
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="animate-spin h-10 w-10 text-primary-500" />
          </div>
        ) : route ? (
          <>
            <RouteOperationsList
              route={route}
              onAddOperation={handleAddOperation}
              onEditOperation={handleEditOperation}
              onDeleteOperation={handleDeleteOperation}
              onReorderOperations={handleReorderOperations}
              onOperationSelect={handleEditOperation}
            />
            
            {/* Operation Editor Modal */}
            <RouteOperationModal
              isOpen={modalOpen}
              operation={selectedOperation}
              parentOperationId={parentOperationId}
              route={route}
              workCenters={workCenters}
              resources={resources}
              materials={materials}
              onSave={handleSaveOperation}
              onCancel={() => setModalOpen(false)}
            />
          </>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <p>Nie znaleziono marszruty o ID {routeId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteOperationsEditor;