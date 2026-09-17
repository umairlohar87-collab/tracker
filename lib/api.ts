import type { Vehicle, Alert, Trip } from "./types";
import { mockVehicles, mockAlerts, mockTrips } from "./mockData";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchVehicles(): Promise<Vehicle[]> {
  if (!API) {
    await delay(300);
    return mockVehicles.map((v) => {
      if (v.status !== "moving") return v;
      return {
        ...v,
        lat: v.lat + (Math.random() - 0.5) * 0.002,
        lng: v.lng + (Math.random() - 0.5) * 0.002,
        speed: Math.max(0, Math.round(v.speed + (Math.random() - 0.5) * 10)),
        lastUpdate: new Date().toISOString(),
      };
    });
  }
  const res = await fetch(`${API}/vehicles`);
  if (!res.ok) throw new Error("Failed to load vehicles");
  return res.json();
}

export async function fetchAlerts(): Promise<Alert[]> {
  if (!API) {
    await delay(200);
    return mockAlerts;
  }
  const res = await fetch(`${API}/alerts`);
  if (!res.ok) throw new Error("Failed to load alerts");
  return res.json();
}

export async function fetchTrips(): Promise<Trip[]> {
  if (!API) {
    await delay(200);
    return mockTrips;
  }
  const res = await fetch(`${API}/trips`);
  if (!res.ok) throw new Error("Failed to load trips");
  return res.json();
}

export async function setEngineLock(vehicleId: string, engineOn: boolean) {
  if (!API) {
    await delay(400);
    return { vehicleId, engineOn };
  }
  const res = await fetch(`${API}/vehicles/${vehicleId}/engine`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ engineOn }),
  });
  if (!res.ok) throw new Error("Failed to update engine");
  return res.json();
}

export async function setArm(vehicleId: string, armed: boolean) {
  if (!API) {
    await delay(300);
    return { vehicleId, armed };
  }
  const res = await fetch(`${API}/vehicles/${vehicleId}/arm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ armed }),
  });
  if (!res.ok) throw new Error("Failed to arm vehicle");
  return res.json();
}