export type VehicleStatus = "moving" | "idle" | "parked" | "offline";

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  driver: string;
  status: VehicleStatus;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  fuel: number;
  battery: number;
  odometer: number;
  engineOn: boolean;
  armed: boolean;
  lastUpdate: string;
}

export type AlertType =
  | "engine_start"
  | "engine_stop"
  | "geofence_exit"
  | "geofence_enter"
  | "overspeed"
  | "low_fuel"
  | "tamper"
  | "sos";

export interface Alert {
  id: string;
  vehicleId: string;
  type: AlertType;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Trip {
  id: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  distance: number;
  avgSpeed: number;
  maxSpeed: number;
  startLocation: string;
  endLocation: string;
}