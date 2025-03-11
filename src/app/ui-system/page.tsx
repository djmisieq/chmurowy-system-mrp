"use client";

import React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { 
  Plus, 
  Check, 
  AlertTriangle, 
  Info, 
  X, 
  Search, 
  Download, 
  Settings, 
  Mail 
} from 'lucide-react';

export default function UISystemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">UI System - Chmurowy MRP</h1>
      
      {/* Color System */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Paleta kolorów</h2>
        <p className="text-slate-600 mb-6">
          Spójny system kolorów zaprojektowany dla Chmurowego Systemu MRP, z uwzględnieniem tematyki morskiej i łodzi motorowodnych.
        </p>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Kolory podstawowe (Primary)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <ColorSwatch color="bg-primary-50" name="Primary 50" hex="#f0f9ff" />
          <ColorSwatch color="bg-primary-100" name="Primary 100" hex="#e0f2fe" />
          <ColorSwatch color="bg-primary-500" name="Primary 500" hex="#0ea5e9" />
          <ColorSwatch color="bg-primary-700" name="Primary 700" hex="#0369a1" />
          <ColorSwatch color="bg-primary-900" name="Primary 900" hex="#0c4a6e" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Kolory dodatkowe (Accent)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <ColorSwatch color="bg-accent-50" name="Accent 50" hex="#fff5e6" />
          <ColorSwatch color="bg-accent-100" name="Accent 100" hex="#ffeacc" />
          <ColorSwatch color="bg-accent-500" name="Accent 500" hex="#ff9900" />
          <ColorSwatch color="bg-accent-700" name="Accent 700" hex="#995c00" />
          <ColorSwatch color="bg-accent-900" name="Accent 900" hex="#331f00" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Kolory neutralne</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <ColorSwatch color="bg-neutral-50" name="Neutral 50" hex="#fafafa" />
          <ColorSwatch color="bg-neutral-100" name="Neutral 100" hex="#f5f5f5" />
          <ColorSwatch color="bg-neutral-300" name="Neutral 300" hex="#d4d4d4" />
          <ColorSwatch color="bg-neutral-500" name="Neutral 500" hex="#737373" />
          <ColorSwatch color="bg-neutral-900" name="Neutral 900" hex="#171717" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Kolory statusów</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <ColorSwatch color="bg-success-500" name="Success" hex="#10b981" textColor="text-white" />
          <ColorSwatch color="bg-warning-500" name="Warning" hex="#f59e0b" textColor="text-white" />
          <ColorSwatch color="bg-danger-500" name="Danger" hex="#ef4444" textColor="text-white" />
          <ColorSwatch color="bg-neutral-500" name="Neutral" hex="#737373" textColor="text-white" />
        </div>
      </section>
      
      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Typografia</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Nagłówek 1 (H1)</h1>
            <p className="text-sm text-slate-500">text-4xl font-bold text-slate-800</p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-slate-800">Nagłówek 2 (H2)</h2>
            <p className="text-sm text-slate-500">text-3xl font-semibold text-slate-800</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-800">Nagłówek 3 (H3)</h3>
            <p className="text-sm text-slate-500">text-2xl font-semibold text-slate-800</p>
          </div>
          <div>
            <h4 className="text-xl font-medium text-slate-800">Nagłówek 4 (H4)</h4>
            <p className="text-sm text-slate-500">text-xl font-medium text-slate-800</p>
          </div>
          <div>
            <p className="text-base text-slate-600">Tekst podstawowy - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p className="text-sm text-slate-500">text-base text-slate-600</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Tekst drugorzędny - Informacje dodatkowe, adnotacje, opisy pól formularza.</p>
            <p className="text-xs text-slate-400">text-sm text-slate-500</p>
          </div>
        </div>
      </section>
      
      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Przyciski</h2>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Warianty przycisków</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <Button variant="primary">Przycisk Primary</Button>
          <Button variant="secondary">Przycisk Secondary</Button>
          <Button variant="outline">Przycisk Outline</Button>
          <Button variant="ghost">Przycisk Ghost</Button>
          <Button variant="danger">Przycisk Danger</Button>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Rozmiary przycisków</h3>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Button size="sm">Mały</Button>
          <Button size="md">Średni</Button>
          <Button size="lg">Duży</Button>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Przyciski z ikonami</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <Button icon={<Plus size={16} />}>Dodaj</Button>
          <Button variant="outline" icon={<Check size={16} />}>Zatwierdź</Button>
          <Button variant="danger" icon={<X size={16} />}>Usuń</Button>
          <Button variant="secondary" icon={<Download size={16} />}>Pobierz</Button>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Stany przycisków</h3>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Przycisk wyłączony</Button>
          <Button fullWidth>Przycisk pełnej szerokości</Button>
          <Button href="#">Przycisk jako link</Button>
        </div>
      </section>
      
      {/* Badges */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Plakietki (Badges)</h2>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Warianty plakietek</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <Badge>Domyślna</Badge>
          <Badge variant="success">Sukces</Badge>
          <Badge variant="warning">Ostrzeżenie</Badge>
          <Badge variant="danger">Błąd</Badge>
          <Badge variant="info">Informacja</Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Plakietki z kropką</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <Badge dot>Domyślna</Badge>
          <Badge dot variant="success">Sukces</Badge>
          <Badge dot variant="warning">Ostrzeżenie</Badge>
          <Badge dot variant="danger">Błąd</Badge>
          <Badge dot variant="info">Informacja</Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-3">Rozmiary plakietek</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge size="sm">Mała</Badge>
          <Badge size="md">Średnia</Badge>
        </div>
      </section>
      
      {/* Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Karty</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Standardowa karta</h3>
            <p className="text-slate-600">Podstawowy kontener do grupowania powiązanych informacji i komponentów.</p>
          </Card>
          
          <Card className="p-6 border-t-4 border-t-primary-500">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Karta z akcentem</h3>
            <p className="text-slate-600">Karta z kolorowym akcentem do wyróżnienia ważnych sekcji.</p>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="bg-primary-500 p-4 text-white">
              <h3 className="font-medium">Karta z nagłówkiem</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600">Karta z wyróżnionym nagłówkiem do prezentacji danych.</p>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Form Controls */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Elementy formularzy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Pola tekstowe</h3>
            <div className="space-y-4">
              <Input
                label="Standardowe pole"
                placeholder="Wprowadź tekst..."
              />
              
              <Input
                label="Pole z ikoną"
                placeholder="Wyszukaj..."
                icon={<Search size={18} />}
              />
              
              <Input
                label="Pole z podpowiedzią"
                placeholder="Wprowadź e-mail..."
                hint="Wpisz poprawny adres e-mail w formacie nazwa@domena.pl"
              />
              
              <Input
                label="Pole z błędem"
                value="niepoprawny@email"
                error="Nieprawidłowy adres e-mail"
              />
              
              <Input
                label="Pole wyłączone"
                placeholder="Niedostępne pole"
                disabled
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Pola wyboru</h3>
            <div className="space-y-4">
              <Select
                label="Standardowa lista"
                placeholder="Wybierz opcję..."
                options={[
                  { value: '1', label: 'Opcja 1' },
                  { value: '2', label: 'Opcja 2' },
                  { value: '3', label: 'Opcja 3' },
                ]}
              />
              
              <Select
                label="Lista z wartością domyślną"
                options={[
                  { value: '1', label: 'Opcja 1' },
                  { value: '2', label: 'Opcja 2' },
                  { value: '3', label: 'Opcja 3' },
                ]}
                value="2"
              />
              
              <Select
                label="Lista z błędem"
                placeholder="Wybierz opcję..."
                options={[
                  { value: '1', label: 'Opcja 1' },
                  { value: '2', label: 'Opcja 2' },
                  { value: '3', label: 'Opcja 3' },
                ]}
                error="Pole wymagane"
              />
              
              <Select
                label="Lista wyłączona"
                placeholder="Wybierz opcję..."
                options={[
                  { value: '1', label: 'Opcja 1' },
                  { value: '2', label: 'Opcja 2' },
                  { value: '3', label: 'Opcja 3' },
                ]}
                disabled
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Iconography */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Ikony</h2>
        <p className="text-slate-600 mb-6">
          Aplikacja korzysta z biblioteki Lucide React dla spójnego zestawu ikon.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <IconDisplay icon={<Plus size={24} />} name="Plus" />
          <IconDisplay icon={<Settings size={24} />} name="Settings" />
          <IconDisplay icon={<Search size={24} />} name="Search" />
          <IconDisplay icon={<Mail size={24} />} name="Mail" />
          <IconDisplay icon={<Check size={24} />} name="Check" />
          <IconDisplay icon={<X size={24} />} name="X" />
          <IconDisplay icon={<Download size={24} />} name="Download" />
          <IconDisplay icon={<AlertTriangle size={24} />} name="AlertTriangle" />
          <IconDisplay icon={<Info size={24} />} name="Info" />
        </div>
      </section>
      
      {/* Usage Guidelines */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Wytyczne użycia</h2>
        
        <div className="space-y-6">
          <div className="bg-primary-50 border-l-4 border-primary-500 p-4">
            <h3 className="text-lg font-medium text-primary-700 mb-2">Konsekwentne używanie kolorów</h3>
            <p className="text-primary-600">
              Używaj kolorów zgodnie z ich semantycznym znaczeniem. Kolor primary dla głównych akcji, 
              success dla potwierdzenia, warning dla ostrzeżeń i danger dla błędów i akcji destrukcyjnych.
            </p>
          </div>
          
          <div className="bg-primary-50 border-l-4 border-primary-500 p-4">
            <h3 className="text-lg font-medium text-primary-700 mb-2">Hierarchia informacji</h3>
            <p className="text-primary-600">
              Utrzymuj czytelną hierarchię informacji poprzez odpowiednie użycie typografii. 
              Używaj nagłówków H1-H4 do strukturyzowania treści, a różnych stylów tekstu do 
              odróżnienia informacji głównych od drugorzędnych.
            </p>
          </div>
          
          <div className="bg-primary-50 border-l-4 border-primary-500 p-4">
            <h3 className="text-lg font-medium text-primary-700 mb-2">Spójność interfejsu</h3>
            <p className="text-primary-600">
              Używaj tych samych komponentów UI do realizacji podobnych funkcji w całej aplikacji. 
              Zapewni to spójne doświadczenie użytkownikom i ułatwi im naukę systemu.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Components
const ColorSwatch = ({ color, name, hex, textColor = 'text-black' }) => (
  <div className="flex flex-col">
    <div className={`h-16 rounded-lg ${color} border border-neutral-200 mb-2`}></div>
    <p className="text-sm font-medium">{name}</p>
    <p className="text-xs text-slate-500">{hex}</p>
  </div>
);

const IconDisplay = ({ icon, name }) => (
  <div className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg">
    <div className="text-slate-700 mb-2">{icon}</div>
    <p className="text-sm text-slate-600">{name}</p>
  </div>
);
