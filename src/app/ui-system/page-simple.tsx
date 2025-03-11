"use client";

import React, { useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import Dropdown from '@/components/ui/Dropdown';
import Tooltip from '@/components/ui/Tooltip';
import Skeleton from '@/components/ui/Skeleton';
import { 
  Plus, 
  Settings, 
  Search, 
  Download, 
  Trash,
  Edit,
  Copy,
  ClipboardList,
  Eye,
  Info
} from 'lucide-react';
import { 
  ColorSwatch, 
  IconDisplay, 
  ComponentExample, 
  DocumentationSection, 
  DocumentationSubsection 
} from './components';

export default function SimpleUISystemPage() {
  // Sample data for dropdown
  const dropdownItems = [
    { id: 'edit', label: 'Edytuj', icon: <Edit size={16} /> },
    { id: 'duplicate', label: 'Duplikuj', icon: <Copy size={16} /> },
    { id: 'view', label: 'Zobacz szczegóły', icon: <Eye size={16} /> },
    { id: 'divider', divider: true },
    { id: 'delete', label: 'Usuń', icon: <Trash size={16} />, },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Biblioteka komponentów UI</h1>
      
      {/* Dropdown Component */}
      <DocumentationSection
        title="Dropdown"
        description="Komponenty rozwijane do wyświetlania list opcji i menu kontekstowego."
      >
        <DocumentationSubsection title="Podstawowy dropdown">
          <div className="flex items-center space-x-6">
            <Dropdown
              trigger="Opcje"
              items={dropdownItems}
            />
            
            <Dropdown
              trigger={
                <Button variant="primary" icon={<Settings size={16} />}>
                  Ustawienia
                </Button>
              }
              items={dropdownItems}
              align="right"
            />
          </div>
        </DocumentationSubsection>
      </DocumentationSection>
      
      {/* Tooltip Component */}
      <DocumentationSection
        title="Tooltip"
        description="Komponenty podpowiedzi wyświetlające dodatkowe informacje po najechaniu kursorem."
      >
        <DocumentationSubsection title="Kierunki tooltipów">
          <div className="flex items-center justify-around">
            <Tooltip content="Podpowiedź u góry" position="top">
              <Button variant="outline" size="sm">U góry</Button>
            </Tooltip>
            
            <Tooltip content="Podpowiedź po prawej" position="right">
              <Button variant="outline" size="sm">Po prawej</Button>
            </Tooltip>
            
            <Tooltip content="Podpowiedź na dole" position="bottom">
              <Button variant="outline" size="sm">Na dole</Button>
            </Tooltip>
            
            <Tooltip content="Podpowiedź po lewej" position="left">
              <Button variant="outline" size="sm">Po lewej</Button>
            </Tooltip>
          </div>
        </DocumentationSubsection>
        
        <DocumentationSubsection title="Tooltip z ikoną">
          <div className="flex items-center space-x-2">
            <span>Status zamówienia:</span>
            <Badge variant="success">Zakończone</Badge>
            <Tooltip content="Zamówienie zostało zrealizowane i wysłane do klienta.">
              <div className="cursor-help text-gray-400 hover:text-gray-600">
                <Info size={16} />
              </div>
            </Tooltip>
          </div>
        </DocumentationSubsection>
      </DocumentationSection>
      
      {/* Skeleton Component */}
      <DocumentationSection
        title="Skeleton"
        description="Komponenty dla stanów ładowania, wyświetlające przybliżony układ strony przed załadowaniem danych."
      >
        <DocumentationSubsection title="Podstawowe Skeleton">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="40%" />
            </div>
            
            <div className="flex space-x-4">
              <Skeleton variant="circle" width={60} height={60} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
          </div>
        </DocumentationSubsection>
        
        <DocumentationSubsection title="Card Skeleton">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <Skeleton.Circle width={40} height={40} className="mb-4" />
              <Skeleton variant="text" className="mb-2" />
              <Skeleton variant="text" width="70%" className="mb-2" />
              <Skeleton variant="text" width="90%" />
            </Card>
            
            <Card className="p-4">
              <Skeleton variant="rect" height={120} className="mb-4" />
              <Skeleton variant="text" className="mb-2" />
              <Skeleton variant="text" width="60%" />
            </Card>
            
            <Card className="p-4">
              <Skeleton.Table rows={3} columns={2} />
            </Card>
          </div>
        </DocumentationSubsection>
      </DocumentationSection>
      
      {/* Alert Example Updates */}
      <DocumentationSection
        title="Alerty"
        description="Rozbudowane warianty alertów do prezentacji różnych typów komunikatów."
      >
        <div className="space-y-4">
          <Alert variant="info" title="Oczekujące zatwierdzenie">
            Zamówienie wymaga zatwierdzenia przed realizacją. 
            <Button size="sm" variant="ghost" className="ml-4">
              Zatwierdź teraz
            </Button>
          </Alert>
          
          <Alert variant="success" title="Operacja zakończona sukcesem" icon={<ClipboardList size={20} />}>
            Inwentaryzacja została zakończona i zapisana. Wykazano 5 rozbieżności.
          </Alert>
          
          <Alert variant="warning" title="Niski stan magazynowy">
            <div>
              <p className="mb-2">Wykryto niski stan magazynowy dla następujących produktów:</p>
              <ul className="list-disc list-inside pl-2">
                <li>Silnik Mercury 150HP (pozostało: 2 szt.)</li>
                <li>Kadłub Premium 21ft (pozostało: 1 szt.)</li>
              </ul>
            </div>
          </Alert>
        </div>
      </DocumentationSection>
    </div>
  );
}
