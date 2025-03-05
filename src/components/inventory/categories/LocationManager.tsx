import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Boxes } from 'lucide-react';
import { Location, getSublocations, getLocationTypeLabel } from '../mockCategories';

interface LocationManagerProps {
  locations: Location[];
  onAddLocation: (parentId: number | null) => void;
  onEditLocation: (id: number) => void;
  onDeleteLocation: (id: number) => void;
  onItemsManage: (id: number) => void;
}

interface LocationNodeProps {
  location: Location;
  locations: Location[];
  level: number;
  expanded: boolean;
  onToggle: () => void;
  onAddLocation: (parentId: number) => void;
  onEditLocation: (id: number) => void;
  onDeleteLocation: (id: number) => void;
  onItemsManage: (id: number) => void;
}

const LocationNode: React.FC<LocationNodeProps> = ({
  location,
  locations,
  level,
  expanded,
  onToggle,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
  onItemsManage
}) => {
  const sublocations = getSublocations(location.id);
  const hasChildren = sublocations.length > 0;
  
  // Formatowanie pojemności lokalizacji
  const formatCapacity = () => {
    if (location.capacity !== undefined && location.capacityUnit) {
      return `${location.capacity} ${location.capacityUnit}`;
    }
    return null;
  };
  
  // Pobierz odpowiedni kolor tła dla typu lokalizacji
  const getTypeColor = () => {
    switch (location.type) {
      case 'warehouse': return 'bg-blue-100 text-blue-800';
      case 'zone': return 'bg-green-100 text-green-800';
      case 'rack': return 'bg-purple-100 text-purple-800';
      case 'shelf': return 'bg-yellow-100 text-yellow-800';
      case 'bin': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="location-node">
      <div 
        className={`flex items-center py-2 px-3 hover:bg-gray-50 ${expanded ? 'bg-gray-50' : ''} ${!location.active ? 'opacity-60' : ''}`}
        style={{ paddingLeft: `${12 + level * 20}px` }}
      >
        <div className="flex-grow flex items-center">
          <button
            onClick={onToggle}
            className={`mr-1 focus:outline-none ${!hasChildren ? 'invisible' : ''}`}
          >
            {expanded ? (
              <ChevronDown size={18} className="text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </button>
          
          <span className="font-medium text-gray-800">{location.name}</span>
          
          <span className="ml-2 text-xs text-gray-500">({location.code})</span>
          
          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor()}`}>
            {getLocationTypeLabel(location.type)}
          </span>
          
          {formatCapacity() && (
            <span className="ml-2 text-xs text-gray-500">
              Max: {formatCapacity()}
            </span>
          )}
          
          {location.itemsCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {location.itemsCount} {location.itemsCount === 1 ? 'element' : 'elementów'}
            </span>
          )}
          
          {!location.active && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Nieaktywna
            </span>
          )}
        </div>
        
        <div className="flex-shrink-0 flex space-x-2">
          <button
            onClick={() => onAddLocation(location.id)}
            title="Dodaj podlokalizację"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => onItemsManage(location.id)}
            title="Zarządzaj elementami"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Boxes size={16} />
          </button>
          <button
            onClick={() => onEditLocation(location.id)}
            title="Edytuj lokalizację"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDeleteLocation(location.id)}
            title="Usuń lokalizację"
            className="text-red-500 hover:text-red-700 focus:outline-none"
            disabled={location.itemsCount > 0 || hasChildren}
          >
            <Trash2 size={16} className={location.itemsCount > 0 || hasChildren ? 'opacity-50 cursor-not-allowed' : ''} />
          </button>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="sublocations">
          {sublocations
            .sort((a, b) => a.code.localeCompare(b.code))
            .map(sublocation => (
              <LocationNodeWithState
                key={sublocation.id}
                location={sublocation}
                locations={locations}
                level={level + 1}
                onAddLocation={onAddLocation}
                onEditLocation={onEditLocation}
                onDeleteLocation={onDeleteLocation}
                onItemsManage={onItemsManage}
              />
            ))}
        </div>
      )}
    </div>
  );
};

// Wrapper z wewnętrznym stanem dla każdego węzła
const LocationNodeWithState: React.FC<Omit<LocationNodeProps, 'expanded' | 'onToggle'>> = (props) => {
  const [expanded, setExpanded] = useState(props.level === 0); // Rozwijaj tylko główne lokalizacje
  
  return (
    <LocationNode
      {...props}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    />
  );
};

const LocationManager: React.FC<LocationManagerProps> = ({
  locations,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
  onItemsManage
}) => {
  // Pobierz tylko lokalizacje główne (bez rodzica)
  const rootLocations = getSublocations(null);
  
  return (
    <div className="location-manager">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Struktura lokalizacji magazynowych</h3>
        <button
          onClick={() => onAddLocation(null)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus size={16} className="mr-1" />
          Dodaj magazyn
        </button>
      </div>
      
      <div className="p-4">
        {rootLocations.length > 0 ? (
          <div className="location-container border border-gray-200 rounded-md overflow-hidden">
            {rootLocations
              .sort((a, b) => a.code.localeCompare(b.code))
              .map(location => (
                <LocationNodeWithState
                  key={location.id}
                  location={location}
                  locations={locations}
                  level={0}
                  onAddLocation={onAddLocation}
                  onEditLocation={onEditLocation}
                  onDeleteLocation={onDeleteLocation}
                  onItemsManage={onItemsManage}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Brak lokalizacji</h3>
            <p className="mt-1 text-sm text-gray-500">
              Nie masz jeszcze żadnych zdefiniowanych lokalizacji magazynowych.
            </p>
            <div className="mt-6">
              <button
                onClick={() => onAddLocation(null)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus size={16} className="-ml-1 mr-2" />
                Dodaj pierwszy magazyn
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-blue-50 text-blue-700 text-sm">
        <p>
          <strong>Wskazówka:</strong> Lokalizacje są zorganizowane hierarchicznie: magazyn → strefa → regał → półka → pojemnik.
          Lokalizacje zawierające elementy lub podlokalizacje nie mogą być usunięte.
        </p>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Legenda:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              Magazyn
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
              Strefa
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
              Regał
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
              Półka
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
              Pojemnik
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationManager;