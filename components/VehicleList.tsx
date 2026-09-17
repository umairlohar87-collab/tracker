"use client";
import VehicleCard from "./VehicleCard";
import type { Vehicle } from "@/lib/types";

interface Props {
  vehicles: Vehicle[];
  selectedId?: string;
  onSelect: (v: Vehicle) => void;
  onToggleEngine: (v: Vehicle, engineOn: boolean) => void;
  onToggleArm: (v: Vehicle, armed: boolean) => void;
  pending: Record<string, boolean>;
}

export default function VehicleList({
  vehicles,
  selectedId,
  onSelect,
  onToggleEngine,
  onToggleArm,
  pending,
}: Props) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center text-slate-500 text-sm py-10 flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-bg-card border border-bg-border grid place-items-center">
          <span className="text-xl">🚗</span>
        </div>
        No vehicles found
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-1 space-y-2.5">
      {vehicles.map((v) => (
        <VehicleCard
          key={v.id}
          vehicle={v}
          selected={v.id === selectedId}
          onClick={() => onSelect(v)}
          onToggleEngine={(on) => onToggleEngine(v, on)}
          onToggleArm={(arm) => onToggleArm(v, arm)}
          pending={pending[v.id]}
        />
      ))}
    </div>
  );
}