// src/components/StatsPanel.tsx
'use client';

import { DashboardStats } from '@/lib/types';
import { Truck, Activity, PauseCircle, WifiOff } from 'lucide-react';

interface StatsPanelProps {
  stats: DashboardStats | null;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    { 
      label: 'Total', 
      value: stats.total_vehicles, 
      icon: Truck, 
      color: 'text-blue-600 bg-blue-50' 
    },
    { 
      label: 'Moving', 
      value: stats.active_vehicles, 
      icon: Activity, 
      color: 'text-green-600 bg-green-50' 
    },
    { 
      label: 'Idle', 
      value: stats.idle_vehicles, 
      icon: PauseCircle, 
      color: 'text-yellow-600 bg-yellow-50' 
    },
    { 
      label: 'Offline', 
      value: stats.offline_vehicles, 
      icon: WifiOff, 
      color: 'text-gray-600 bg-gray-50' 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}