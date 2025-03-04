import React from 'react';

export default function ProductionSchedule() {
  // Przykładowe dane
  const scheduleItems = [
    { id: 1, product: 'Classic 180', quantity: 2, status: 'In Progress', startDate: '2025-03-05', endDate: '2025-03-15' },
    { id: 2, product: 'Sport 210', quantity: 1, status: 'Scheduled', startDate: '2025-03-18', endDate: '2025-03-28' },
    { id: 3, product: 'Luxury 250', quantity: 1, status: 'Scheduled', startDate: '2025-04-01', endDate: '2025-04-18' },
    { id: 4, product: 'Fishing Pro 190', quantity: 3, status: 'Pending', startDate: '2025-04-20', endDate: '2025-05-10' },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Harmonogram produkcji</h3>
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
                  Produkt
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ilość
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduleItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'Scheduled'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.status === 'In Progress'
                        ? 'W trakcie'
                        : item.status === 'Scheduled'
                        ? 'Zaplanowano'
                        : 'Oczekuje'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.startDate} - {item.endDate}
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
