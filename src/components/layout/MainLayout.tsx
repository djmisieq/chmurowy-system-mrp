"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    checkMobileView();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobileView);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Overlay for mobile when sidebar is open
  const overlay = isMobileView && isSidebarOpen ? (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      onClick={toggleSidebar}
    />
  ) : null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobileView={isMobileView} />
      
      {/* Overlay */}
      {overlay}
      
      {/* Main content */}
      <div 
        className={`
          flex flex-col flex-1 transition-all duration-300 
          ${isSidebarOpen && !isMobileView ? 'md:ml-64' : 'ml-0'}
        `}
      >
        <Topbar onMobileMenuToggle={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;