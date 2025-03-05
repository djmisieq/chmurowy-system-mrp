"use client";

import React from 'react';
import { PlusCircle, UploadCloud, Download, AlertTriangle } from 'lucide-react';

interface ActionPanelProps {
  onAddNew: () => void;
  onImport: () => void;
  onExport: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ onAddNew, onImport, onExport }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={onAddNew}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Dodaj nowy element
      </button>
      
      <button
        onClick={onImport}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <UploadCloud className="mr-2 h-5 w-5 text-gray-500" />
        Importuj z CSV/Excel
      </button>
      
      <button
        onClick={onExport}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <Download className="mr-2 h-5 w-5 text-gray-500" />
        Eksportuj dane
      </button>
    </div>
  );
};

export default ActionPanel;
