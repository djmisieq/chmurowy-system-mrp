"use client";

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Zamówienia', icon: ShoppingCart, href: '/orders' },
    { name: 'Magazyn', icon: Package, href: '/inventory' },
    { name: 'Raporty', icon: BarChart2, href: '/reports' },
    { name: 'Ustawienia', icon: Settings, href: '/settings' },
  ];

  return (
    <div 
      className={`
        fixed left-0 top-0 bottom-0 bg-white shadow-md 
        transition-all duration-300 z-50
        ${isOpen ? 'w-64' : 'w-20'}
        overflow-hidden
      `}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && (
          <h2 className="text-xl font-bold text-gray-800">MRP System</h2>
        )}
        <button 
          onClick={toggleSidebar} 
          className="ml-auto hover:bg-gray-100 p-2 rounded-full"
        >
          {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </button>
      </div>
      
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-1">
              <Link 
                href={item.href}
                className="
                  flex items-center p-3 
                  hover:bg-blue-50 
                  text-gray-700 
                  hover:text-blue-600
                  transition-colors
                "
              >
                <item.icon className={`mr-3 ${isOpen ? '' : 'mx-auto'}`} size={20} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
