"use client";

import React from 'react';
import { PlusCircle, Upload, Download, FileSpreadsheet } from 'lucide-react';

interface ActionPanelProps {
  onAddNew?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onPrint?: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ 
  onAddNew = () => {},
  onImport = () => {},
  onExport = () => {},
  onPrint = () => {}
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-3">
      <button
        onClick={onAddNew}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <PlusCircle size={18} className="mr-2" />
        Dodaj nowy element
      </button>
      
      <button
        onClick={onImport}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Upload size={18} className="mr-2" />
        Importuj z CSV/Excel
      </button>
      
      <button
        onClick={onExport}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Download size={18} className="mr-2" />
        Eksportuj dane
      </button>
      
      <button
        onClick={onPrint}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <FileSpreadsheet size={18} className="mr-2" />
        Drukuj etykiety/kody
      </button>
    </div>
  );
};

export default ActionPanel;
