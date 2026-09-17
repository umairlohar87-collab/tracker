"use client";
import { useEffect, useRef } from "react";
import type { Vehicle } from "@/lib/types";

/**
 * Simulates realtime intrusion detection on armed vehicles.
 * Replace with socket.io / SSE when your Rails backend is ready.
 */
export function useRealtime(
  vehicles: Vehicle[],
  onIntrusion: (v: Vehicle) => void
) {
  const vehiclesRef = useRef(vehicles);
  vehiclesRef.current = vehicles;

  useEffect(() => {
    const interval = setInterval(() => {
      const armed = vehiclesRef.current.filter((v) => v.armed);
      if (armed.length === 0) return;
      if (Math.random() < 0.25) {
        const target = armed[Math.floor(Math.random() * armed.length)];
        onIntrusion(target);
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [onIntrusion]);
}