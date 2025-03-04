import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatProps {
  stat: {
    name: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
  };
}

export default function StatsCard({ stat }: StatProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {/* Placeholder for icon - could be customized per stat */}
            <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-xl font-semibold">
                {stat.name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              <div
                className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}
              >
                {stat.changeType === 'increase' ? (
                  <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                )}
                <span className="ml-1 sr-only">
                  {stat.changeType === 'increase' ? 'Wzrost' : 'Spadek'}
                </span>
                {stat.change}
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
