import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Otwórz menu boczne</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 ml-2 md:ml-0">Chmurowy System MRP</h1>
          </div>
          
          <div className="flex items-center">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="sr-only">Zobacz powiadomienia</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-600">
                  <span className="text-sm font-medium leading-none text-white">MG</span>
                </span>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">User</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
