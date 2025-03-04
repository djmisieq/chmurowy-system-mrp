"use client";

import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  Search, 
  LogOut, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

const Topbar: React.FC = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nowe zamówienie #4567', type: 'info' },
    { id: 2, message: 'Stan magazynowy surowca X niski', type: 'warning' }
  ]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      {/* Wyszukiwanie */}
      <div className="relative flex-grow max-w-md mr-6">
        <input 
          type="text" 
          placeholder="Szukaj zamówień, produktów..." 
          className="
            w-full pl-10 pr-4 py-2 
            border rounded-lg 
            focus:outline-none focus:ring-2 
            focus:ring-blue-500
          "
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={20} 
        />
      </div>

      {/* Ikony nawigacyjne */}
      <div className="flex items-center space-x-4">
        {/* Powiadomienia */}
        <div className="relative">
          <Bell 
            className="text-gray-600 hover:text-blue-600 cursor-pointer" 
            size={24} 
          />
          {notifications.length > 0 && (
            <span className="
              absolute -top-2 -right-2 
              bg-red-500 text-white 
              text-xs rounded-full 
              px-1.5 py-0.5
            ">
              {notifications.length}
            </span>
          )}
        </div>

        {/* Profil użytkownika */}
        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
          >
            <User className="text-gray-600" size={24} />
            <span className="text-sm font-medium">Jan Kowalski</span>
          </button>

          {isUserMenuOpen && (
            <div className="
              absolute right-0 top-full mt-2 
              bg-white border rounded-lg shadow-lg 
              w-48 py-2
            ">
              <ul>
                <li>
                  <a 
                    href="/profile" 
                    className="
                      flex items-center px-4 py-2 
                      hover:bg-gray-100 
                      text-gray-700
                    "
                  >
                    <User className="mr-2" size={16} />
                    Profil
                  </a>
                </li>
                <li>
                  <a 
                    href="/settings" 
                    className="
                      flex items-center px-4 py-2 
                      hover:bg-gray-100 
                      text-gray-700
                    "
                  >
                    <Settings className="mr-2" size={16} />
                    Ustawienia
                  </a>
                </li>
                <li>
                  <a 
                    href="/help" 
                    className="
                      flex items-center px-4 py-2 
                      hover:bg-gray-100 
                      text-gray-700
                    "
                  >
                    <HelpCircle className="mr-2" size={16} />
                    Pomoc
                  </a>
                </li>
                <li>
                  <button 
                    className="
                      w-full text-left flex items-center 
                      px-4 py-2 hover:bg-gray-100 
                      text-red-600
                    "
                  >
                    <LogOut className="mr-2" size={16} />
                    Wyloguj
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
