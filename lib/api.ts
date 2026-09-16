// src/lib/api.ts

import { VehicleLocation, DashboardStats } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 🔧 Set to true to force mock data (useful while Rails isn't running)
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// -------------------- MOCK DATA --------------------
const mockLocations: VehicleLocation[] = [
  {
    id: 1,
    device_id: 'CAR001',
    latitude: 24.8607,
    longitude: 67.0011,
    speed: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    device_id: 'CAR002',
    latitude: 24.8820,
    longitude: 67.0650,
    speed: 0,
    created_at: new Date(Date.now() - 60_000).toISOString(),
    updated_at: new Date(Date.now() - 60_000).toISOString(),
  },
  {
    id: 3,
    device_id: 'BIKE003',
    latitude: 24.8320,
    longitude: 67.0330,
    speed: 22,
    created_at: new Date(Date.now() - 120_000).toISOString(),
    updated_at: new Date(Date.now() - 120_000).toISOString(),
  },
  {
    id: 4,
    device_id: 'TRUCK004',
    latitude: 24.9130,
    longitude: 67.0820,
    speed: 65,
    created_at: new Date(Date.now() - 30_000).toISOString(),
    updated_at: new Date(Date.now() - 30_000).toISOString(),
  },
];

const mockStats: DashboardStats = {
  total_vehicles: mockLocations.length,
  active_vehicles: mockLocations.filter(l => (l.speed ?? 0) > 0).length,
  idle_vehicles: mockLocations.filter(l => (l.speed ?? 0) === 0).length,
  offline_vehicles: 0,
};

// -------------------- HELPERS --------------------
async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  if (USE_MOCK_DATA) {
    console.log(`[MOCK] Returning mock data for ${url}`);
    return fallback;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[API] ${url} returned ${res.status}. Using mock data.`);
      return fallback;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[API] Failed to reach ${url}. Using mock data.`, error);
    return fallback;
  }
}

// -------------------- EXPORTS --------------------
export async function fetchLatestLocations(): Promise<VehicleLocation[]> {
  return safeFetch(`${API_BASE}/api/locations/latest`, mockLocations);
}

export async function fetchVehicleHistory(
  deviceId: string,
  limit: number = 50
): Promise<VehicleLocation[]> {
  const url = `${API_BASE}/api/locations/history?device_id=${deviceId}&limit=${limit}`;
  const fallback = mockLocations.filter(l => l.device_id === deviceId);
  return safeFetch(url, fallback);
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return safeFetch(`${API_BASE}/api/locations/stats`, mockStats);
}