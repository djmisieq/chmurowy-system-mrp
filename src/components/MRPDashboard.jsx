import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  Bell, 
  User 
} from 'lucide-react';

// Główny komponent Dashboard
const MRPDashboard = () => {
  // Stan dla powiadomień i alertów
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Stan surowca X spadł poniżej minimum', type: 'warning' },
    { id: 2, message: 'Zamówienie #1234 wymaga akceptacji', type: 'info' }
  ]);

  // Dane KPI - do późniejszej wymiany na dynamiczne
  const kpiData = [
    { 
      title: 'Zamówienia', 
      value: 42, 
      icon: <ShoppingCart className="text-blue-500" />,
      trend: 'up'
    },
    { 
      title: 'Stan Magazynu', 
      value: '89%', 
      icon: <Package className="text-green-500" />,
      trend: 'stable'
    },
    { 
      title: 'Produkcja', 
      value: '75%', 
      icon: <BarChart2 className="text-purple-500" />,
      trend: 'down'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-5 border-b">
          <h1 className="text-2xl font-bold text-gray-800">MRP System</h1>
        </div>
        <nav className="p-4">
          <ul>
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Zamówienia', icon: ShoppingCart },
              { name: 'Magazyn', icon: Package },
              { name: 'Raporty', icon: BarChart2 },
              { name: 'Ustawienia', icon: Settings }
            ].map((item) => (
              <li 
                key={item.name} 
                className="mb-2 hover:bg-blue-50 rounded-md transition-colors"
              >
                <a 
                  href="#" 
                  className="flex items-center p-3 text-gray-700 hover:text-blue-600"
                >
                  <item.icon className="mr-3" size={20} />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Główna treść */}
      <div className="flex-1 p-10">
        {/* Pasek górny */}
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="text-gray-600 hover:text-blue-600 cursor-pointer" />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {notifications.length}
                </span>
              )}
            </div>
            <User className="text-gray-600 hover:text-blue-600 cursor-pointer" />
          </div>
        </header>

        {/* Sekcja KPI */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {kpiData.map((kpi) => (
            <div 
              key={kpi.title} 
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-500 mb-2">{kpi.title}</h3>
                  <p className="text-3xl font-bold text-gray-800">{kpi.value}</p>
                </div>
                {kpi.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Sekcja powiadomień */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Powiadomienia</h3>
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`
                p-4 mb-2 rounded-md 
                ${notification.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'}
              `}
            >
              {notification.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MRPDashboard;
