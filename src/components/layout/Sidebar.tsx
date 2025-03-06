"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronRight,
  Boxes,
  ClipboardList,
  Repeat,
  Tag,
  Database,
  ShoppingBag,
  Truck,
  CalendarDays,
  Factory,
  Clock,
  PieChart
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  name: string;
  icon: React.FC<any>;
  href: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'Magazyn': true, // Domyślnie rozwinięty moduł magazynu
    'Zamówienia': true // Domyślnie rozwinięty moduł zamówień
  });
  
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { 
      name: 'Zamówienia', 
      icon: ShoppingCart, 
      href: '/orders',
      children: [
        { name: 'Przegląd', icon: LayoutDashboard, href: '/orders' },
        { name: 'Zamówienia klientów', icon: ShoppingBag, href: '/orders/sales' },
        { name: 'Zamówienia do dostawców', icon: Truck, href: '/orders/purchase' },
        { name: 'Planowanie zakupów', icon: CalendarDays, href: '/orders/planning' },
        { name: 'Zlecenia produkcyjne', icon: Factory, href: '/orders/production' },
        { name: 'Historia zamówień', icon: Clock, href: '/orders/history' },
        { name: 'Raporty zamówień', icon: PieChart, href: '/orders/reports' },
      ]
    },
    { 
      name: 'Magazyn', 
      icon: Package, 
      href: '/inventory',
      children: [
        { name: 'Przegląd', icon: Boxes, href: '/inventory' },
        { name: 'Inwentaryzacja', icon: ClipboardList, href: '/inventory/inventory' },
        { name: 'Kategorie', icon: Tag, href: '/inventory/categories' },
        { name: 'Operacje', icon: Repeat, href: '/inventory/operations' },
        { name: 'Raporty magazynowe', icon: Database, href: '/inventory/reports' },
      ]
    },
    { name: 'Raporty', icon: BarChart2, href: '/reports' },
    { name: 'Ustawienia', icon: Settings, href: '/settings' },
  ];

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };
  
  const isChildActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div 
      className={`
        fixed left-0 top-0 bottom-0 bg-white shadow-md 
        transition-all duration-300 z-50
        ${isOpen ? 'w-64' : 'w-20'}
        overflow-y-auto overflow-x-hidden
      `}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && (
          <h2 className="text-xl font-bold text-gray-800">Chmurowy MRP</h2>
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
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`
                      w-full flex items-center p-3 
                      ${isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} 
                      hover:bg-blue-50 hover:text-blue-600
                      transition-colors
                    `}
                  >
                    <item.icon className={`mr-3 ${isOpen ? '' : 'mx-auto'}`} size={20} />
                    {isOpen && (
                      <>
                        <span className="flex-grow">{item.name}</span>
                        {expandedItems[item.name] ? 
                          <ChevronDown size={16} /> : 
                          <ChevronRight size={16} />
                        }
                      </>
                    )}
                  </button>
                  
                  {isOpen && expandedItems[item.name] && (
                    <ul className="pl-8 bg-gray-50">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link 
                            href={child.href}
                            className={`
                              flex items-center p-2 my-1 rounded
                              ${isChildActive(child.href) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'} 
                              hover:bg-blue-100 hover:text-blue-700
                              transition-colors
                              text-sm
                            `}
                          >
                            <child.icon size={16} className="mr-2" />
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link 
                  href={item.href}
                  className={`
                    flex items-center p-3 
                    ${isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} 
                    hover:bg-blue-50 hover:text-blue-600
                    transition-colors
                  `}
                >
                  <item.icon className={`mr-3 ${isOpen ? '' : 'mx-auto'}`} size={20} />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;