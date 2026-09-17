import type { Vehicle, Alert, Trip } from "./types";

export const mockVehicles: Vehicle[] = [
  {
    id: "v1", name: "Ford Transit", plate: "ABC-1234", driver: "Ali Khan",
    status: "moving", lat: 24.8607, lng: 67.0011, speed: 62, heading: 90,
    fuel: 74, battery: 88, odometer: 45230, engineOn: true, armed: true,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "v2", name: "Toyota Hilux", plate: "XYZ-7788", driver: "Sara Ahmed",
    status: "idle", lat: 24.875, lng: 67.05, speed: 0, heading: 0,
    fuel: 42, battery: 71, odometer: 78900, engineOn: false, armed: true,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "v3", name: "Honda Civic", plate: "LMN-0099", driver: "Bilal Raza",
    status: "parked", lat: 24.82, lng: 67.03, speed: 0, heading: 210,
    fuel: 12, battery: 45, odometer: 23110, engineOn: false, armed: false,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "v4", name: "Suzuki Bolan", plate: "DEF-3344", driver: "Hina Iqbal",
    status: "offline", lat: 24.9, lng: 67.12, speed: 0, heading: 0,
    fuel: 0, battery: 0, odometer: 112340, engineOn: false, armed: false,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "a1", vehicleId: "v3", type: "engine_start", severity: "critical",
    message: "Engine start attempt detected while parked.",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), read: false,
  },
  {
    id: "a2", vehicleId: "v1", type: "overspeed", severity: "warning",
    message: "Speed exceeded 120 km/h on Super Highway.",
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(), read: false,
  },
];

export const mockTrips: Trip[] = [
  {
    id: "t1", vehicleId: "v1",
    startTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    distance: 42.5, avgSpeed: 48, maxSpeed: 96,
    startLocation: "Clifton, Karachi", endLocation: "Gulshan, Karachi",
  },
];