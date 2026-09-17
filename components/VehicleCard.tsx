"use client";
import { MapPin, Gauge, Fuel, Battery, Clock } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import EngineToggle from "./EngineToggle";

const statusStyles: Record<Vehicle["status"], string> = {
  moving: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  idle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  parked: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  offline: "bg-red-500/15 text-red-300 border-red-500/30",
};

const statusDot: Record<Vehicle["status"], string> = {
  moving: "bg-emerald-400",
  idle: "bg-amber-400",
  parked: "bg-slate-400",
  offline: "bg-red-400",
};

interface Props {
  vehicle: Vehicle;
  selected?: boolean;
  onClick?: () => void;
  onToggleEngine: (engineOn: boolean) => void;
  onToggleArm: (armed: boolean) => void;
  pending?: boolean;
}

export default function VehicleCard({
  vehicle,
  selected,
  onClick,
  onToggleEngine,
  onToggleArm,
  pending,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl p-3.5 cursor-pointer transition-all duration-300 animate-fadeIn ${
        selected
          ? "bg-brand/[0.08] border border-brand/40 shadow-glow-sm"
          : "bg-bg-card/40 border border-bg-border/40 hover:bg-bg-card/70 hover:border-brand/20"
      }`}
    >
      {/* Selected accent bar */}
      {selected && (
        <span className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full bg-brand shadow-glow-sm" />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`h-9 w-9 shrink-0 rounded-xl grid place-items-center text-xs font-bold text-white ${
              vehicle.status === "moving"
                ? "bg-brand-gradient shadow-glow-sm"
                : "bg-bg-card border border-bg-border"
            }`}
          >
            {vehicle.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white text-sm truncate">
              {vehicle.name}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {vehicle.plate} · {vehicle.driver}
            </div>
          </div>
        </div>
        <span
          className={`shrink-0 flex items-center gap-1.5 text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 font-semibold ${statusStyles[vehicle.status]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot[vehicle.status]} ${vehicle.status === "moving" ? "animate-pulse" : ""}`} />
          {vehicle.status}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mt-3">
        <Stat icon={Gauge} label="km/h" value={`${vehicle.speed}`} />
        <Stat icon={Fuel} label="Fuel" value={`${vehicle.fuel}%`} />
        <Stat icon={Battery} label="Batt" value={`${vehicle.battery}%`} />
        <Stat icon={MapPin} label="Odo" value={`${(vehicle.odometer / 1000).toFixed(0)}k`} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t border-bg-border/40">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Clock className="h-3 w-3" /> {timeAgo(vehicle.lastUpdate)}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <EngineToggle
            vehicle={vehicle}
            onToggleEngine={onToggleEngine}
            onToggleArm={onToggleArm}
            pending={pending}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-bg-soft/60 border border-bg-border/40 px-2 py-1.5 hover:border-brand/20 transition">
      <div className="flex items-center gap-1 text-slate-500">
        <Icon className="h-2.5 w-2.5" />
        <span className="text-[9px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="text-white font-bold text-xs mt-0.5">{value}</div>
    </div>
  );
}