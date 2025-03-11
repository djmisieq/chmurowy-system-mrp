"use client";

import React, { useState, useEffect } from 'react';
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
  PieChart,
  X,
  FileText,
  Palette,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobileView?: boolean;
}

interface MenuItem {
  name: string;
  icon: React.FC<any>;
  href: string;
  children?: MenuItem[];
  devOnly?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isMobileView = false }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'Magazyn': true, // Rozwinięty domyślnie
    'Zamówienia': true, // Rozwinięty domyślnie
    'Produkcja': true, // Rozwinięty domyślnie
    'Dokumentacja': false, // Zwinięty domyślnie
  });
  
  // Reset expanded items when sidebar is closed (for desktop view)
  useEffect(() => {
    if (!isOpen && !isMobileView) {
      setExpandedItems({});
    }
  }, [isOpen, isMobileView]);
  
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
        { name: 'Historia zamówień', icon: Clock, href: '/orders/history' },
        { name: 'Raporty zamówień', icon: PieChart, href: '/orders/reports' },
      ]
    },
    { 
      name: 'Produkcja', 
      icon: Factory, 
      href: '/production',
      children: [
        { name: 'Przegląd', icon: LayoutDashboard, href: '/production' },
        { name: 'Zlecenia produkcyjne', icon: FileText, href: '/production/orders' },
        { name: 'Planowanie produkcji', icon: CalendarDays, href: '/production/planning' },
        { name: 'Stany zasobów', icon: Package, href: '/production/resources' },
        { name: 'Historia produkcji', icon: Clock, href: '/production/history' },
        { name: 'Wydajność produkcji', icon: PieChart, href: '/production/performance' },
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
    { 
      name: 'Dokumentacja', 
      icon: BookOpen, 
      href: '/ui-system',
      devOnly: true,
      children: [
        { name: 'System UI', icon: Palette, href: '/ui-system' },
        { name: 'Uproszczona dokumentacja', icon: FileText, href: '/ui-system/page-simple' },
      ]
    },
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

  // Filter out dev-only items in production
  const filteredMenuItems = process.env.NODE_ENV === 'production'
    ? menuItems.filter(item => !item.devOnly)
    : menuItems;

  // Classes for sidebar positioning
  const sidebarClasses = `
    fixed top-0 bottom-0 bg-white shadow-lg
    transition-all duration-300 z-50
    ${isOpen ? (isMobileView ? 'left-0' : 'w-64 left-0') : (isMobileView ? '-left-full' : 'w-20 left-0')}
    ${isMobileView ? 'w-[280px]' : ''}
    overflow-y-auto overflow-x-hidden
  `;

  return (
    <div className={sidebarClasses}>
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && (
          <h2 className="text-xl font-bold text-gray-800 md:block">Chmurowy MRP</h2>
        )}
        <button 
          onClick={toggleSidebar} 
          className="ml-auto p-2 rounded-full hover:bg-gray-100 text-gray-600"
          aria-label={isOpen ? 'Zwiń menu' : 'Rozwiń menu'}
        >
          {isMobileView ? 
            (isOpen ? <X size={20} /> : <ChevronsRight size={20} />) : 
            (isOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />)
          }
        </button>
      </div>
      
      <nav className="mt-4">
        <ul>
          {filteredMenuItems.map((item) => (
            <li key={item.name} className="mb-1">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`
                      w-full flex items-center p-3 
                      ${isActive(item.href) ? 'bg-primary-50 text-primary-600' : 'text-gray-700'} 
                      hover:bg-primary-50 hover:text-primary-600
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
                              ${isChildActive(child.href) ? 'bg-primary-100 text-primary-700' : 'text-gray-700'} 
                              hover:bg-primary-100 hover:text-primary-700
                              transition-colors
                              text-sm
                            `}
                            onClick={isMobileView ? toggleSidebar : undefined}
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
                    ${isActive(item.href) ? 'bg-primary-50 text-primary-600' : 'text-gray-700'} 
                    hover:bg-primary-50 hover:text-primary-600
                    transition-colors
                  `}
                  onClick={isMobileView ? toggleSidebar : undefined}
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