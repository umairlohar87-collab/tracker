"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AppShell from "@/components/AppShell";
import StatsPanel from "@/components/StatsPanel";
import VehicleList from "@/components/VehicleList";
import AlertList from "@/components/Alert";
import { useVehicles } from "@/hooks/useVehicles";
import { useAlerts } from "@/hooks/useAlerts";
import { useEngineLock } from "@/hooks/useEngineLock";
import type { Vehicle } from "@/lib/types";
import { Activity, ChevronRight, Map as MapIcon, X } from "lucide-react";

const VehicleMap = dynamic(() => import("@/components/VehicleMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full grid place-items-center rounded-2xl bg-bg-card/40 border border-bg-border">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        <span className="text-xs text-slate-500">Initializing map…</span>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  const { vehicles, isLoading } = useVehicles(5000);
  const { alerts } = useAlerts(8000);
  const { pending, toggleEngine, toggleArm, triggerIntrusion } = useEngineLock();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [mobileMapOpen, setMobileMapOpen] = useState(false);

  useEffect(() => {
    if (!selectedId && vehicles[0]) setSelectedId(vehicles[0].id);
  }, [vehicles, selectedId]);

  const selected = useMemo(
    () => vehicles.find((v) => v.id === selectedId),
    [vehicles, selectedId]
  );

  useEffect(() => {
    const t = setInterval(() => {
      const armed = vehicles.filter((v) => v.armed);
      if (!armed.length) return;
      if (Math.random() < 0.35) {
        const target = armed[Math.floor(Math.random() * armed.length)];
        triggerIntrusion(target);
      }
    }, 25000);
    return () => clearInterval(t);
  }, [vehicles, triggerIntrusion]);

  // Open map sheet when a vehicle is selected on mobile
  const handleSelect = (v: Vehicle) => {
    setSelectedId(v.id);
    if (window.innerWidth < 1024) setMobileMapOpen(true);
  };

  return (
    <AppShell>
      <div className="h-full flex flex-col">
        {/* Page header */}
        <div className="shrink-0 px-4 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-slate-500 font-medium">
              <Activity className="h-3 w-3 text-brand" /> Live operations
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
              Fleet Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">
              {vehicles.length} vehicles tracked in real-time
            </p>
          </div>

          {/* Mobile "view map" button */}
          <button
            onClick={() => setMobileMapOpen(true)}
            className="lg:hidden shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-xl bg-brand/15 border border-brand/30 text-brand text-xs font-semibold active:scale-95 transition"
          >
            <MapIcon className="h-3.5 w-3.5" />
            Map
          </button>
        </div>

        {/* Main grid — responsive */}
        <div className="flex-1 min-h-0 px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto lg:overflow-hidden">
          <div className="lg:h-full lg:grid lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] lg:gap-5 lg:min-h-0">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-3 sm:gap-4 lg:min-h-0 lg:h-full">
              <StatsPanel vehicles={vehicles} />

              {/* Vehicles list panel */}
              <div className="lg:flex-1 lg:min-h-0 rounded-2xl bg-bg-soft/60 backdrop-blur border border-bg-border/60 flex flex-col overflow-hidden shadow-soft">
                <div className="shrink-0 px-3 sm:px-4 py-3 flex items-center justify-between border-b border-bg-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Vehicles</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand/15 text-brand border border-brand/20">
                      {vehicles.length}
                    </span>
                  </div>
                  <button className="text-[11px] text-slate-400 hover:text-brand transition flex items-center gap-1">
                    View all <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 p-2 sm:p-3 overflow-hidden">
                  {isLoading && vehicles.length === 0 ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-28 rounded-xl" />
                      ))}
                    </div>
                  ) : (
                    <VehicleList
                      vehicles={vehicles}
                      selectedId={selectedId}
                      onSelect={handleSelect}
                      onToggleEngine={toggleEngine}
                      onToggleArm={toggleArm}
                      pending={pending}
                    />
                  )}
                </div>
              </div>

              {/* Recent alerts (desktop only — mobile has dedicated page) */}
              <div className="hidden lg:block shrink-0 rounded-2xl bg-bg-soft/60 backdrop-blur border border-bg-border/60 p-4 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Recent alerts</span>
                    {alerts.length > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent-rose/15 text-accent-rose border border-accent-rose/20">
                        {alerts.length}
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto pr-1">
                  <AlertList alerts={alerts.slice(0, 3)} />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — desktop only inline map */}
            <div className="hidden lg:flex flex-col min-h-0 gap-4">
              <div className="relative flex-1 min-h-[400px] rounded-2xl overflow-hidden border border-bg-border/60 shadow-soft">
                <VehicleMap
                  vehicles={vehicles}
                  selected={selected}
                  onSelect={(v) => setSelectedId(v.id)}
                />
                <MapOverlays vehicles={vehicles} />
              </div>

              {selected && <VehicleDetailsStrip selected={selected} />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet map sheet */}
      {mobileMapOpen && (
        <div className="lg:hidden fixed inset-0 z-[999] bg-bg animate-fadeIn">
          <div className="h-full flex flex-col">
            {/* Sheet header */}
            <div className="shrink-0 h-14 flex items-center justify-between px-4 border-b border-bg-border/60 bg-bg-soft/70 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-gradient grid place-items-center">
                  <MapIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Live map</div>
                  <div className="text-[10px] text-slate-500">
                    {vehicles.filter((v) => v.status === "moving").length} moving
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileMapOpen(false)}
                className="h-9 w-9 rounded-xl bg-bg-card border border-bg-border grid place-items-center active:scale-95 transition"
                aria-label="Close map"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Map */}
            <div className="flex-1 min-h-0 relative">
              <VehicleMap
                vehicles={vehicles}
                selected={selected}
                onSelect={(v) => setSelectedId(v.id)}
              />
              <MapOverlays vehicles={vehicles} />
            </div>

            {/* Selected vehicle details strip */}
            {selected && <VehicleDetailsStrip selected={selected} />}
          </div>
        </div>
      )}
    </AppShell>
  );
}

/* Overlay HUD on the map (status pill, counter, legend) */
function MapOverlays({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <>
      {/* Top-left live pill */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 rounded-full bg-bg-soft/85 backdrop-blur-xl border border-bg-border/60 px-3 py-1.5 shadow-soft">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[11px] font-medium text-white">Live</span>
        <span className="text-[10px] text-slate-400 border-l border-bg-border/60 pl-2">
          {vehicles.filter((v) => v.status === "moving").length} moving
        </span>
      </div>

      {/* Bottom-right legend (hidden on very small screens) */}
      <div className="hidden xs:flex absolute bottom-3 right-3 z-[400] rounded-xl bg-bg-soft/85 backdrop-blur-xl border border-bg-border/60 px-3 py-2 shadow-soft items-center gap-3 text-[10px]">
        <LegendDot color="#10b981" label="Moving" />
        <LegendDot color="#f59e0b" label="Idle" />
        <LegendDot color="#94a3b8" label="Parked" />
        <LegendDot color="#ef4444" label="Offline" />
      </div>
    </>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-slate-300">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      {label}
    </span>
  );
}
/* Selected vehicle detail strip */
function VehicleDetailsStrip({ selected }: { selected: Vehicle }) {
  return (
    <div className="shrink-0 lg:rounded-2xl bg-bg-soft/60 backdrop-blur border-t lg:border border-bg-border/60 p-4 lg:shadow-soft animate-slideUp">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-brand-gradient grid place-items-center text-sm font-bold text-white shadow-glow-sm">
            {selected.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white leading-tight truncate">
              {selected.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {selected.plate} · {selected.driver}
            </div>
          </div>
        </div>
        <StatusChip status={selected.status} />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <Info label="Speed" value={`${selected.speed}`} unit="km/h" />
        <Info label="Heading" value={`${selected.heading}`} unit="°" />
        <Info label="Fuel" value={`${selected.fuel}`} unit="%" />
        <Info label="Battery" value={`${selected.battery}`} unit="%" />
        <Info
          label="Odo"
          value={`${(selected.odometer / 1000).toFixed(1)}`}
          unit="k"
        />
        <Info
          label="Engine"
          value={selected.engineOn ? "On" : "Locked"}
          highlight={selected.engineOn ? "emerald" : "rose"}
        />
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: Vehicle["status"] }) {
  const map: Record<Vehicle["status"], string> = {
    moving: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    idle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    parked: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    offline: "bg-red-500/15 text-red-300 border-red-500/30",
  };

  return (
    <span
      className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider rounded-full border px-2.5 py-1 ${map[status]}`}
    >
      {status}
    </span>
  );
}

function Info({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit?: string;
  highlight?: "emerald" | "rose";
}) {
  const valueColor =
    highlight === "emerald"
      ? "text-emerald-400"
      : highlight === "rose"
      ? "text-rose-400"
      : "text-white";

  return (
    <div className="rounded-xl bg-bg-card/60 border border-bg-border/60 p-2.5 hover:border-brand/30 transition">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
        {label}
      </div>
      <div className={`mt-0.5 font-bold text-base leading-none ${valueColor}`}>
        {value}
        {unit && (
          <span className="text-[10px] text-slate-500 ml-1 font-medium">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}