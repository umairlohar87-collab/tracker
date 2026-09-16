// src/lib/types.ts

export interface VehicleLocation {
  id: number;
  device_id: string;
  latitude: number;
  longitude: number;
  speed: number | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  device_id: string;
  name: string;
  status: 'moving' | 'idle' | 'offline';
  last_location: VehicleLocation | null;
}

export interface DashboardStats {
  total_vehicles: number;
  active_vehicles: number;
  idle_vehicles: number;
  offline_vehicles: number;
}