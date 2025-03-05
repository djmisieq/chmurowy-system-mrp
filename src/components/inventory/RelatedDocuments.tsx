"use client";

import React from 'react';
import { FileText, Download, Trash2, Upload } from 'lucide-react';
import { Document } from './mockOperations';

interface RelatedDocumentsProps {
  documents: Document[];
  onDelete?: (id: number) => void;
  onUpload?: () => void;
}

const RelatedDocuments: React.FC<RelatedDocumentsProps> = ({ 
  documents,
  onDelete = () => {},
  onUpload = () => {}
}) => {
  // Formatowanie daty
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Ikona dla typu dokumentu
  const getDocumentTypeIcon = (type: string) => {
    return <FileText size={18} />;
  };
  
  // Etykieta dla typu dokumentu
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'manual':
        return 'Instrukcja';
      case 'certificate':
        return 'Certyfikat';
      case 'invoice':
        return 'Faktura';
      case 'specification':
        return 'Specyfikacja';
      case 'drawing':
        return 'Rysunek techniczny';
      default:
        return type;
    }
  };
  
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={onUpload}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Upload size={18} className="mr-2" />
          Dodaj dokument
        </button>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Brak dokumentów dla tego elementu
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {documents.map((document) => (
              <li key={document.id} className="hover:bg-gray-50">
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0">
                      {getDocumentTypeIcon(document.type)}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{document.name}</h4>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                          {getDocumentTypeLabel(document.type)}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Dodano: {formatDate(document.uploadDate)}</span>
                        <span className="mx-2">•</span>
                        <span>Przez: {document.uploadedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Pobierz"
                      onClick={() => window.open(document.fileUrl, '_blank')}
                    >
                      <Download size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Usuń"
                      onClick={() => onDelete(document.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RelatedDocuments;
