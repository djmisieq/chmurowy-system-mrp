"use client";

import React from 'react';
import { RouteOperation } from '@/types/route.types';

interface RouteGanttViewProps {
  operations: RouteOperation[];
}

const RouteGanttView: React.FC<RouteGanttViewProps> = ({ operations }) => {
  // Sortuj operacje na podstawie zależności
  const sortedOperations = [...operations].sort((a, b) => {
    // Jeśli b jest zależne od a
    if (b.predecessors?.includes(a.id)) return -1;
    // Jeśli a jest zależne od b
    if (a.predecessors?.includes(b.id)) return 1;
    // Inne przypadki - pozostaw bez zmian
    return 0;
  });
  
  // Oblicz całkowity czas wszystkich operacji (potrzebny do skalowania)
  const totalTime = sortedOperations.reduce((total, op) => total + op.processingTime, 0);
  
  // Znajdź unikalne centra robocze
  const workCenters = Array.from(new Set(sortedOperations.map(op => op.workCenterName || op.workCenter)));
  
  // Przypisz operacje do centrów roboczych
  const operationsByWorkCenter = workCenters.map(wc => ({
    workCenter: wc,
    operations: sortedOperations.filter(op => (op.workCenterName || op.workCenter) === wc)
  }));
  
  // Funkcja pomocnicza do generowania koloru na podstawie id operacji
  const getOperationColor = (operationId: string) => {
    // Utwórz prosty hash z id
    const hash = operationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Generuj kolor na podstawie hasha (ograniczony do jasnych odcieni)
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 65%)`;
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Diagram Gantta marszruty</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Linia czasu (oś pozioma) */}
          <div className="h-8 border-b border-gray-300 flex">
            <div className="w-48 border-r border-gray-300 font-medium bg-gray-50 flex items-center px-3">
              Centrum robocze
            </div>
            <div className="flex-grow relative">
              {/* Znaczniki czasu */}
              {Array.from({ length: 11 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute top-0 bottom-0 flex items-center justify-center text-xs text-gray-500"
                  style={{ left: `${i * 10}%`, width: '1px', height: '100%' }}
                >
                  <div className="absolute top-0 h-2 w-[1px] bg-gray-300"></div>
                  <div className="absolute -left-4 top-3">{i * (totalTime / 10)}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Wiersze z operacjami według centrum roboczego */}
          {operationsByWorkCenter.map((wcGroup, wcIndex) => (
            <div key={wcIndex} className="flex border-b border-gray-200">
              <div className="w-48 border-r border-gray-300 bg-gray-50 p-3 flex items-center">
                <div className="font-medium truncate">{wcGroup.workCenter}</div>
              </div>
              <div className="flex-grow relative h-16">
                {/* Operacje na wykresie */}
                {wcGroup.operations.map((operation, opIndex) => {
                  // Oblicz pozycję startową na podstawie zależności
                  const dependentOps = operations.filter(op => 
                    operation.predecessors?.includes(op.id)
                  );
                  
                  const startOffset = dependentOps.length > 0 
                    ? Math.max(...dependentOps.map(op => op.processingTime)) 
                    : 0;
                  
                  const startPosition = startOffset / totalTime * 100;
                  const width = (operation.processingTime / totalTime) * 100;
                  
                  return (
                    <div 
                      key={opIndex}
                      className="absolute rounded h-8 flex items-center justify-center text-xs font-medium overflow-hidden whitespace-nowrap cursor-pointer hover:opacity-90"
                      style={{
                        backgroundColor: getOperationColor(operation.id),
                        left: `${startPosition}%`,
                        width: `${width}%`,
                        top: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                      }}
                      title={`${operation.name} - Czas: ${operation.processingTime} min - Setup: ${operation.setupTime} min`}
                    >
                      {operation.name}
                    </div>
                  );
                })}
                
                {/* Linie zależności (prostsze podejście) */}
                {wcGroup.operations.map((operation, opIndex) => {
                  return operation.predecessors?.map((predId, i) => {
                    const predecessor = operations.find(op => op.id === predId);
                    if (!predecessor) return null;
                    
                    // Tu powinny być bardziej złożone obliczenia dla dokładnego pozycjonowania strzałek
                    // W prostszej wersji możemy tylko zaznaczyć zależności kolorem tła
                    return (
                      <div 
                        key={`${operation.id}-${predId}-${i}`}
                        className="absolute h-1 bg-gray-300"
                        style={{
                          // Bardzo uproszczone - w rzeczywistym systemie wymagane bardziej złożone obliczenia
                          left: '0',
                          right: '0',
                          top: '12px',
                          opacity: 0.3
                        }}
                      />
                    );
                  });
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p className="italic">Uwaga: Diagram jest uproszczoną wizualizacją. Rzeczywiste czasy i zależności mogą się różnić.</p>
      </div>
    </div>
  );
};

export default RouteGanttView;