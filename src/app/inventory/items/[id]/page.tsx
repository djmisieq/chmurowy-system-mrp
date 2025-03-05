"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  DollarSign,
  AlertTriangle,
  MapPin,
  History,
  FileText,
  Anchor,
  Settings
} from 'lucide-react';
import MainLayout from '../../../../components/layout/MainLayout';
import InfoCard from '../../../../components/inventory/InfoCard';
import ItemActionPanel from '../../../../components/inventory/ItemActionPanel';
import TabPanel from '../../../../components/inventory/TabPanel';
import OperationHistory from '../../../../components/inventory/OperationHistory';
import TechnicalSpec from '../../../../components/inventory/TechnicalSpec';
import RelatedDocuments from '../../../../components/inventory/RelatedDocuments';
import RelatedProducts from '../../../../components/inventory/RelatedProducts';
import { 
  mockInventoryItems, 
  InventoryItem 
} from '../../../../components/inventory/mockData';
import {
  getItemOperations,
  getItemDocuments,
  getItemProducts
} from '../../../../components/inventory/mockOperations';

interface InventoryItemDetailPageProps {
  params: {
    id: string;
  }
}

const InventoryItemDetailPage: React.FC<InventoryItemDetailPageProps> = ({ params }) => {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Pobierz dane elementu na podstawie ID
  useEffect(() => {
    // Symulacja połączenia z API
    const fetchItem = () => {
      setLoading(true);
      try {
        // Konwersja params.id na number
        const itemId = parseInt(params.id, 10);
        const foundItem = mockInventoryItems.find(item => item.id === itemId);
        
        if (foundItem) {
          setItem(foundItem);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Błąd pobierania danych elementu:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [params.id]);
  
  // Obsługa akcji
  const handleReceive = () => {
    alert('Przyjęcie na magazyn');
    // Tutaj będzie przekierowanie do formularza przyjęcia
  };
  
  const handleIssue = () => {
    alert('Wydanie z magazynu');
    // Tutaj będzie przekierowanie do formularza wydania
  };
  
  const handleTransfer = () => {
    alert('Przesunięcie międzymagazynowe');
    // Tutaj będzie przekierowanie do formularza przesunięcia
  };
  
  const handleEdit = () => {
    alert('Edycja danych elementu');
    // Tutaj będzie przekierowanie do formularza edycji
  };
  
  const handleDelete = () => {
    alert('Usuwanie elementu');
    // Tutaj będzie potwierdzenie usunięcia
  };
  
  // Formatowanie wartości waluty
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Zawartość zakładek
  const renderTabs = () => {
    if (!item) return [];
    
    const itemId = item.id;
    const operations = getItemOperations(itemId);
    const documents = getItemDocuments(itemId);
    const products = getItemProducts(itemId);
    
    return [
      {
        id: 'history',
        label: 'Historia operacji',
        icon: <History size={18} />,
        content: <OperationHistory operations={operations} />
      },
      {
        id: 'specs',
        label: 'Specyfikacja techniczna',
        icon: <Settings size={18} />,
        content: <TechnicalSpec item={item} />
      },
      {
        id: 'documents',
        label: 'Dokumenty',
        icon: <FileText size={18} />,
        content: <RelatedDocuments 
          documents={documents} 
          onDelete={(id) => alert(`Usuwanie dokumentu ${id}`)} 
          onUpload={() => alert('Dodawanie dokumentu')} 
        />
      },
      {
        id: 'products',
        label: 'Powiązane produkty',
        icon: <Anchor size={18} />,
        content: <RelatedProducts products={products} itemId={itemId} />
      }
    ];
  };
  
  // Stany ładowania i błędów
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-lg text-gray-600">Ładowanie danych...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !item) {
    return (
      <MainLayout>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">Błąd</h2>
          <p className="mb-4">Nie można znaleźć elementu o podanym ID.</p>
          <Link href="/inventory/items" className="text-blue-600 hover:underline">
            Powrót do listy elementów
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Przyciski nawigacyjne */}
      <div className="mb-6 flex items-center">
        <Link href="/inventory/items" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{item.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Kod: <span className="font-medium">{item.code}</span> | 
            Kategoria: <span className="font-medium">{item.category}</span>
          </p>
        </div>
      </div>
      
      {/* Panel akcji */}
      <ItemActionPanel 
        onReceive={handleReceive}
        onIssue={handleIssue}
        onTransfer={handleTransfer}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      {/* Karty informacyjne */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <InfoCard 
          title="Stan magazynowy" 
          value={`${item.stock} ${item.unit}`} 
          icon={<Package size={20} />}
          color={item.stock < item.minStock ? 'warning' : 'primary'}
        />
        <InfoCard 
          title="Wartość całkowita" 
          value={formatCurrency(item.value * item.stock)} 
          icon={<DollarSign size={20} />}
          color="success"
        />
        <InfoCard 
          title="Stan min/max" 
          value={`${item.minStock} / ${item.maxStock}`} 
          icon={<AlertTriangle size={20} />}
          color={item.stock < item.minStock ? 'danger' : 'info'}
        />
        <InfoCard 
          title="Lokalizacja" 
          value={item.location} 
          icon={<MapPin size={20} />}
          color="primary"
        />
      </div>
      
      {/* Zakładki */}
      <TabPanel tabs={renderTabs()} defaultTab="history" />
    </MainLayout>
  );
};

export default InventoryItemDetailPage;
