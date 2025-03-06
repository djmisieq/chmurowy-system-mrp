"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  User, 
  Search, 
  LogOut, 
  Settings, 
  HelpCircle,
  ChevronDown,
  Info,
  AlertTriangle,
  CheckCircle,
  Menu
} from 'lucide-react';
import Badge from '../ui/Badge';

interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nowe zamówienie #4567', type: 'info', timestamp: '2025-03-06T09:32:00Z' },
    { id: 2, message: 'Stan magazynowy materiału X niski', type: 'warning', timestamp: '2025-03-06T08:15:00Z' },
    { id: 3, message: 'Zakończono produkcję Classic 180', type: 'success', timestamp: '2025-03-05T15:40:00Z' }
  ]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info size={18} className="text-primary-500" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-warning-500" />;
      case 'success':
        return <CheckCircle size={18} className="text-success-500" />;
      default:
        return <Info size={18} className="text-primary-500" />;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
      {/* Mobile menu toggle */}
      <button 
        className="md:hidden text-gray-600 focus:outline-none"
        onClick={onMobileMenuToggle}
      >
        <Menu size={24} />
      </button>
      
      {/* Search */}
      <div className="relative hidden sm:flex flex-grow max-w-md mr-6">
        <input 
          type="text" 
          placeholder="Szukaj zamówień, produktów..." 
          className="
            w-full pl-10 pr-4 py-2 
            border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            text-sm
          "
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={18} 
        />
      </div>

      {/* Navigation icons */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="
                absolute -top-1 -right-1 
                bg-danger-500 text-white 
                text-xs rounded-full 
                min-w-[18px] h-[18px]
                flex items-center justify-center
                px-1
              ">
                {notifications.length}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="
              absolute right-0 top-full mt-2 
              bg-white border rounded-lg shadow-lg 
              w-80 py-2 z-50
            ">
              <div className="px-4 py-2 border-b">
                <h3 className="font-medium text-gray-900">Powiadomienia</h3>
              </div>
              
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">
                  <p>Brak nowych powiadomień</p>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 flex">
                      <div className="flex-shrink-0 mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString('pl-PL')}
                        </p>
                      </div>
                      <button 
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <span className="sr-only">Usuń</span>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="px-4 py-2 border-t text-center">
                <a href="/notifications" className="text-sm text-primary-600 hover:text-primary-800">
                  Zobacz wszystkie powiadomienia
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center text-primary-700 font-semibold">
              JK
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">Jan Kowalski</span>
            <ChevronDown className="text-gray-500" size={16} />
          </button>

          {isUserMenuOpen && (
            <div className="
              absolute right-0 top-full mt-2 
              bg-white border rounded-lg shadow-lg 
              w-56 py-2 z-50
            ">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">Jan Kowalski</p>
                <p className="text-xs text-gray-500 mt-1">jan.kowalski@example.com</p>
              </div>
              <ul>
                <li>
                  <a 
                    href="/profile" 
                    className="
                      flex items-center px-4 py-2 
                      hover:bg-gray-100 
                      text-gray-700 text-sm
                    "
                  >
                    <User className="mr-3" size={16} />
                    Mój profil
                  </a>
                </li>
                <li>
                  <a 
                    href="/settings" 
                    className="
                      flex items-center px-4 py-2 
                      hover:bg-gray-100 
                      text-gray-700 text-sm
                    "
                  >
                    <Settings className="mr-3" size={16} />
                    Ustawienia
                  </a>
                </li>
                <li>
                  <a 
                    href="/help" 
                    className="
                      flex items-center px-4 py-2 
                      hover:bg-gray-100 
                      text-gray-700 text-sm
                    "
                  >
                    <HelpCircle className="mr-3" size={16} />
                    Pomoc i wsparcie
                  </a>
                </li>
                <li className="border-t mt-2 pt-2">
                  <button 
                    className="
                      w-full text-left flex items-center 
                      px-4 py-2 hover:bg-gray-100 
                      text-red-600 text-sm
                    "
                  >
                    <LogOut className="mr-3" size={16} />
                    Wyloguj się
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