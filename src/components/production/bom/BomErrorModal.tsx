"use client";

import React from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import { ValidationResult } from '@/services/BomValidationService';

interface BomErrorModalProps {
  validationResult: ValidationResult | null;
  sourceItem?: { id: string; name: string; type: string };
  targetItem?: { id: string; name: string; type: string };
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Komponent modalny wyświetlający błędy i ostrzeżenia walidacji BOM
 */
const BomErrorModal: React.FC<BomErrorModalProps> = ({
  validationResult,
  sourceItem,
  targetItem,
  isOpen,
  onClose
}) => {
  if (!isOpen || !validationResult) return null;

  const { errors, warnings } = validationResult;
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        <div className={`p-4 flex items-center border-b ${hasErrors ? 'bg-red-50' : 'bg-amber-50'}`}>
          {hasErrors ? (
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
          )}
          <h3 className={`text-lg font-semibold ${hasErrors ? 'text-red-700' : 'text-amber-700'}`}>
            {hasErrors ? 'Błąd walidacji BOM' : 'Ostrzeżenie walidacji BOM'}
          </h3>
          <button
            onClick={onClose}
            className="ml-auto rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {(sourceItem || targetItem) && (
            <div className="mb-4 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Szczegóły operacji</h4>
              {sourceItem && (
                <div className="flex mb-2">
                  <span className="text-sm text-gray-500 w-20">Element:</span>
                  <span className="text-sm font-medium">
                    {sourceItem.name} <span className="text-gray-500">({sourceItem.type})</span>
                  </span>
                </div>
              )}
              {targetItem && (
                <div className="flex">
                  <span className="text-sm text-gray-500 w-20">Do elementu:</span>
                  <span className="text-sm font-medium">
                    {targetItem.name} <span className="text-gray-500">({targetItem.type})</span>
                  </span>
                </div>
              )}
            </div>
          )}

          {hasErrors && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-red-600 mb-2">Błędy</h4>
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-600">{error}</li>
                ))}
              </ul>
            </div>
          )}

          {hasWarnings && (
            <div>
              <h4 className="text-sm font-semibold text-amber-600 mb-2">Ostrzeżenia</h4>
              <ul className="list-disc pl-5 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-amber-600">{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
          >
            Zamknij
          </button>
          {!hasErrors && warnings.length > 0 && (
            <button
              onClick={() => {
                // Tu można dodać logikę kontynuacji operacji pomimo ostrzeżeń
                onClose();
              }}
              className="ml-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Kontynuuj pomimo ostrzeżeń
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BomErrorModal;
