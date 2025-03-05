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
  TagsIcon,
  Repeat,
  DatabaseIcon
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
    'Magazyn': true // Domyślnie rozwinięty moduł magazynu
  });
  
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Zamówienia', icon: ShoppingCart, href: '/orders' },
    { 
      name: 'Magazyn', 
      icon: Package, 
      href: '/inventory',
      children: [
        { name: 'Przegląd', icon: Boxes, href: '/inventory' },
        { name: 'Inwentaryzacja', icon: ClipboardList, href: '/inventory/inventory' },
        { name: 'Kategorie', icon: TagsIcon, href: '/inventory/categories' },
        { name: 'Operacje', icon: Repeat, href: '/inventory/operations' },
        { name: 'Raporty magazynowe', icon: DatabaseIcon, href: '/inventory/reports' },
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

// Dodanie brakujących ikon
const TagsIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z" />
    <path d="M6 9.01V9" />
    <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" />
  </svg>
);

const DatabaseIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

export default Sidebar;