// src/app/dashboard/DashboardClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import VehicleMap from '@/components/VehicleMap';
import VehicleCard from '@/components/VehicleCard';
import StatsPanel from '@/components/StatsPanel';
import { VehicleLocation, DashboardStats } from '@/lib/types';
import { fetchLatestLocations, fetchDashboardStats } from '@/lib/api';

interface DashboardClientProps {
  initialLocations: VehicleLocation[];
  initialStats: DashboardStats;
}

export default function DashboardClient({ 
  initialLocations, 
  initialStats 
}: DashboardClientProps) {
  const [locations, setLocations] = useState<VehicleLocation[]>(initialLocations);
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll for updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsRefreshing(true);
        const [newLocations, newStats] = await Promise.all([
          fetchLatestLocations(),
          fetchDashboardStats(),
        ]);
        setLocations(newLocations);
        setStats(newStats);
      } catch (error) {
        console.error('Failed to refresh data:', error);
      } finally {
        setIsRefreshing(false);
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSelectDevice = useCallback((deviceId: string) => {
    setSelectedDeviceId(prev => prev === deviceId ? undefined : deviceId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Tracker</h1>
            <p className="text-sm text-gray-600">Real-time fleet monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            {isRefreshing && (
              <span className="text-sm text-gray-500">Refreshing...</span>
            )}
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        <StatsPanel stats={stats} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '500px' }}>
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Vehicles ({locations.length})
              </h2>
              {selectedDeviceId && (
                <button
                  onClick={() => setSelectedDeviceId(undefined)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear selection
                </button>
              )}
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {locations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No vehicles reporting</p>
                  <p className="text-sm">Waiting for device data...</p>
                </div>
              ) : (
                locations.map((location) => (
                  <VehicleCard
                    key={location.device_id}
                    location={location}
                    isSelected={location.device_id === selectedDeviceId}
                    onClick={() => handleSelectDevice(location.device_id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow h-full" style={{ minHeight: '500px' }}>
              <VehicleMap
                locations={locations}
                selectedDeviceId={selectedDeviceId}
                onSelectDevice={handleSelectDevice}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}