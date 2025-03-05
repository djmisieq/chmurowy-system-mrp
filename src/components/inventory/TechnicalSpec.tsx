"use client";

import React from 'react';
import { InventoryItem } from './mockData';

interface TechnicalSpecProps {
  item: InventoryItem;
}

const TechnicalSpec: React.FC<TechnicalSpecProps> = ({ item }) => {
  // Jest to przykładowy komponent, który wyświetla podstawowe dane techniczne
  // W rzeczywistej aplikacji dane techniczne byłyby bardziej złożone i dynamiczne
  
  // Przykładowe dane techniczne (w rzeczywistości powinny pochodzić z API)
  const technicalData = {
    // Dane dla silnika
    'SIL-40KM': {
      moc: '40 KM',
      waga: '98 kg',
      typ: 'czterosuwowy',
      paliwo: 'benzyna',
      pojemność: '996 cc',
      chłodzenie: 'wodne',
      rozrusznik: 'elektryczny',
      zbiornik: 'zewnętrzny',
      producent: 'Marine Motors',
      model: 'MM40-ECO',
      gwarancja: '24 miesiące'
    },
    // Dane dla kadłuba
    'KAD-18CL': {
      długość: '18 stóp / 5.5m',
      szerokość: '2.2m',
      zanurzenie: '0.4m',
      waga: '450 kg',
      materiał: 'laminat poliestrowo-szklany',
      kolor: 'biały',
      kategoria: 'CE-C',
      osoby: '6',
      ładowność: '500 kg',
      producent: 'Yacht Parts',
      model: 'Classic 180',
      gwarancja: '36 miesięcy'
    }
  };
  
  // Sprawdź, czy mamy dane techniczne dla tego elementu
  const specs = technicalData[item.code as keyof typeof technicalData];
  
  if (!specs) {
    // Jeśli nie ma danych technicznych, wyświetl podstawowe informacje
    return (
      <div className="py-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Podstawowe informacje</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2"><span className="font-medium">Opis:</span> {item.description || 'Brak opisu'}</p>
            <p className="text-gray-700 mb-2"><span className="font-medium">Kategoria:</span> {item.category}</p>
            <p className="text-gray-700 mb-2"><span className="font-medium">Dostawca:</span> {item.supplier || 'Brak informacji'}</p>
            <p className="text-gray-700"><span className="font-medium">Jednostka miary:</span> {item.unit}</p>
          </div>
        </div>
        
        <div className="text-center py-4 px-6 bg-blue-50 text-blue-700 rounded-lg">
          <p>Szczegółowa specyfikacja techniczna dla tego elementu nie jest dostępna.</p>
        </div>
      </div>
    );
  }
  
  // Wyświetl dane techniczne
  return (
    <div className="py-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Podstawowe informacje</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 mb-2"><span className="font-medium">Opis:</span> {item.description || 'Brak opisu'}</p>
          <p className="text-gray-700 mb-2"><span className="font-medium">Kategoria:</span> {item.category}</p>
          <p className="text-gray-700 mb-2"><span className="font-medium">Dostawca:</span> {item.supplier || 'Brak informacji'}</p>
          <p className="text-gray-700"><span className="font-medium">Jednostka miary:</span> {item.unit}</p>
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">Specyfikacja techniczna</h3>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {Object.entries(specs).map(([key, value]) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechnicalSpec;
