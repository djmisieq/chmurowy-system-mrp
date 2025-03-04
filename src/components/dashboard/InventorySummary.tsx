import React from 'react';

export default function InventorySummary() {
  // Przykładowe dane
  const inventoryItems = [
    { id: 1, name: 'Silnik podwieszany 40KM', stock: 12, threshold: 5, status: 'good' },
    { id: 2, name: 'Kadłub 18ft Classic', stock: 3, threshold: 5, status: 'warning' },
    { id: 3, name: 'Konsola sterowa Standard', stock: 8, threshold: 10, status: 'warning' },
    { id: 4, name: 'Zbiornik paliwa 100L', stock: 2, threshold: 8, status: 'critical' },
    { id: 5, name: 'Zestaw tapicerski Premium', stock: 15, threshold: 5, status: 'good' },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Stan magazynu</h3>
        <button
          type="button"
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Szczegóły
        </button>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nazwa
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.stock} / {item.threshold}+
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'good'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status === 'good'
                        ? 'Dobry'
                        : item.status === 'warning'
                        ? 'Niski stan'
                        : 'Krytyczny'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
