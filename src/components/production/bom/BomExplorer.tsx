"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchIcon, RefreshCw, Download, Eye, Table, FileText } from 'lucide-react';
import BomTreeView from './BomTreeView';
import { ProductBom } from '@/types/bom.types';

interface BomExplorerProps {
  initialBomId?: string;
}

const BomExplorer: React.FC<BomExplorerProps> = ({ initialBomId }) => {
  const [loading, setLoading] = useState(true);
  const [boms, setBoms] = useState<ProductBom[]>([]);
  const [selectedBomId, setSelectedBomId] = useState<string | undefined>(initialBomId);
  const [selectedBom, setSelectedBom] = useState<ProductBom | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'table' | 'details'>('tree');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBoms = async () => {
      try {
        setLoading(true);
        // Pobieranie z mock API
        const response = await axios.get('/product-boms.json');
        const data: ProductBom[] = response.data;
        setBoms(data);
        
        // Wybierz pierwszy BOM jeśli nie ma initialBomId
        if (!initialBomId && data.length > 0) {
          setSelectedBomId(data[0].id);
        }
        
      } catch (error) {
        console.error('Błąd podczas pobierania struktur BOM:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoms();
  }, [initialBomId]);

  useEffect(() => {
    if (selectedBomId && boms.length > 0) {
      const bom = boms.find(b => b.id === selectedBomId);
      setSelectedBom(bom || null);
    } else {
      setSelectedBom(null);
    }
  }, [selectedBomId, boms]);

  const handleRefresh = () => {
    // Re-fetch data
    const fetchBoms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/product-boms.json');
        setBoms(response.data);
      } catch (error) {
        console.error('Błąd podczas odświeżania struktur BOM:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoms();
  };

  const handleExport = () => {
    if (!selectedBom) return;
    
    const dataStr = JSON.stringify(selectedBom, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bom-${selectedBom.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin h-10 w-10 text-primary-500" />
        </div>
      );
    }
    
    if (!selectedBom) {
      return (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Wybierz strukturę BOM z listy
        </div>
      );
    }
    
    switch (viewMode) {
      case 'tree':
        return (
          <div className="p-4">
            <BomTreeView item={selectedBom.rootItem} expandedByDefault={true} />
          </div>
        );
      case 'table':
        return (
          <div className="p-4">
            <p className="text-gray-500 italic">Widok tabelaryczny zostanie dodany w przyszłej wersji.</p>
          </div>
        );
      case 'details':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Szczegóły struktury BOM</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p>{selectedBom.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nazwa</p>
                <p>{selectedBom.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Wersja</p>
                <p>{selectedBom.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`${selectedBom.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                  {selectedBom.status === 'active' ? 'Aktywny' : 
                   selectedBom.status === 'draft' ? 'Wersja robocza' : 
                   selectedBom.status === 'obsolete' ? 'Wycofany' : 
                   selectedBom.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data utworzenia</p>
                <p>{new Date(selectedBom.createdAt).toLocaleDateString('pl-PL')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Utworzony przez</p>
                <p>{selectedBom.createdBy}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Opis</p>
                <p>{selectedBom.description}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Struktura produktów (BOM)</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
            title="Odśwież"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={handleExport}
            disabled={!selectedBom}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eksportuj do JSON"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4">
        {/* Sidebar with BOM list */}
        <div className="col-span-1 border-r min-h-[600px]">
          <div className="p-3 border-b">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Szukaj..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[550px]">
            {boms.filter(bom => 
              bom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              bom.id.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(bom => (
              <div 
                key={bom.id}
                onClick={() => setSelectedBomId(bom.id)}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedBomId === bom.id ? 'bg-primary-50' : ''}`}
              >
                <div className="font-medium">{bom.name}</div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>ID: {bom.id}</span>
                  <span>v{bom.version}</span>
                </div>
              </div>
            ))}
            
            {boms.length === 0 && !loading && (
              <div className="p-4 text-center text-gray-500">
                Brak struktur BOM
              </div>
            )}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="col-span-3">
          {/* View mode selector */}
          <div className="flex border-b">
            <button 
              onClick={() => setViewMode('tree')}
              className={`flex items-center px-4 py-2 border-r ${viewMode === 'tree' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
            >
              <Eye size={16} className="mr-2" />
              Drzewo
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`flex items-center px-4 py-2 border-r ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
            >
              <Table size={16} className="mr-2" />
              Tabela
            </button>
            <button 
              onClick={() => setViewMode('details')}
              className={`flex items-center px-4 py-2 ${viewMode === 'details' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
            >
              <FileText size={16} className="mr-2" />
              Szczegóły
            </button>
          </div>
          
          {/* Content area */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BomExplorer;