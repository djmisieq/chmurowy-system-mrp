import React from 'react';
import BomExplorer from '@/components/production/bom/BomExplorer';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function BomPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Struktura produktów (BOM)</h1>
        <div className="flex space-x-2">
          <Link href="/production/bom/new">
            <button className="flex items-center px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition">
              <Plus size={18} className="mr-2" />
              Nowa struktura BOM
            </button>
          </Link>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mb-6">
        Zarządzaj strukturami produktów (BOM) i przeglądaj materiały potrzebne do produkcji.
      </div>
      
      <BomExplorer />
    </div>
  );
}