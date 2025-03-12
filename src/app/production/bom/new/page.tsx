"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BomMetadataForm from '@/components/production/bom/BomMetadataForm';
import { ProductBom } from '@/types/bom.types';

export default function NewBomPage() {
  const router = useRouter();
  const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>(false);

  const handleSave = (bom: ProductBom) => {
    // W rzeczywistej aplikacji tutaj byłoby połączenie z API
    console.log('Utworzono nowy BOM:', bom);
    
    // Pokaż komunikat o sukcesie
    setSavedSuccessfully(true);
    
    // Przekieruj po krótkim czasie
    setTimeout(() => {
      router.push('/production/bom');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/production/bom');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/production/bom')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Nowa struktura BOM</h1>
      </div>

      {savedSuccessfully ? (
        <div className="bg-green-50 text-green-800 p-4 rounded-md">
          Struktura BOM została pomyślnie utworzona! Przekierowywanie...
        </div>
      ) : (
        <BomMetadataForm
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}