"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';

interface NavCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

const NavCard: React.FC<NavCardProps> = ({ title, description, icon, href }) => {
  return (
    <Link 
      href={href}
      className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 truncate">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NavCard;
