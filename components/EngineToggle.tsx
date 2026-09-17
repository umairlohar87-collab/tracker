"use client";
import { Power, ShieldCheck, ShieldOff } from "lucide-react";
import type { Vehicle } from "@/lib/types";

interface Props {
  vehicle: Vehicle;
  onToggleEngine: (engineOn: boolean) => void;
  onToggleArm: (armed: boolean) => void;
  pending?: boolean;
}

export default function EngineToggle({
  vehicle,
  onToggleEngine,
  onToggleArm,
  pending,
}: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() => onToggleEngine(!vehicle.engineOn)}
        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold border transition ${
          vehicle.engineOn
            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
            : "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20"
        } ${pending ? "opacity-50 cursor-wait" : ""}`}
      >
        <Power className="h-3 w-3" />
        {vehicle.engineOn ? "On" : "Locked"}
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => onToggleArm(!vehicle.armed)}
        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold border transition ${
          vehicle.armed
            ? "bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20"
            : "bg-slate-500/10 text-slate-300 border-slate-500/30 hover:bg-slate-500/20"
        } ${pending ? "opacity-50 cursor-wait" : ""}`}
      >
        {vehicle.armed ? (
          <ShieldCheck className="h-3 w-3" />
        ) : (
          <ShieldOff className="h-3 w-3" />
        )}
        {vehicle.armed ? "Armed" : "Off"}
      </button>
    </div>
  );
}