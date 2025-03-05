"use client";

import React from 'react';
import { Anchor } from 'lucide-react';
import { Product } from './mockOperations';

interface RelatedProductsProps {
  products: Product[];
  itemId: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, itemId }) => {
  return (
    <div>
      {products.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Ten element nie jest używany w żadnym produkcie
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => {
            // Znajdź, ile sztuk danego elementu jest używanych w produkcie
            const usage = product.usedItems.find(item => item.itemId === itemId);
            const quantity = usage ? usage.quantity : 0;
            
            return (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Model:</span> {product.modelNumber} | <span className="font-medium">Kategoria:</span> {product.category}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Anchor size={16} className="mr-1" />
                      Użyto: {quantity} szt.
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Inne elementy użyte w tym produkcie:</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {product.usedItems
                          .filter(item => item.itemId !== itemId) // Pomiń bieżący element
                          .map((item, index) => (
                            <li key={index} className="text-sm text-gray-700">
                              • Element ID: {item.itemId} ({item.quantity} szt.)
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <a 
                      href={`/products/${product.id}`}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Szczegóły produktu
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
