"use client";
import { Route, Clock, Gauge } from "lucide-react";
import type { Trip } from "@/lib/types";

export default function TripHistory({ trips }: { trips: Trip[] }) {
  if (!trips.length) return <div className="text-sm text-slate-500 text-center py-8">No trips yet.</div>;

  return (
    <div className="space-y-3">
      {trips.map((t) => (
        <div key={t.id} className="rounded-xl border border-bg-border bg-bg-soft p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Route className="h-4 w-4 text-brand" /> {t.startLocation} → {t.endLocation}
            </div>
            <span className="text-xs text-slate-400">{new Date(t.startTime).toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-bg-card border border-bg-border p-2">
              <div className="text-slate-500 flex items-center gap-1"><Route className="h-3 w-3" />Distance</div>
              <div className="text-white font-semibold">{t.distance} km</div>
            </div>
            <div className="rounded-lg bg-bg-card border border-bg-border p-2">
              <div className="text-slate-500 flex items-center gap-1"><Gauge className="h-3 w-3" />Avg / Max</div>
              <div className="text-white font-semibold">{t.avgSpeed} / {t.maxSpeed} km/h</div>
            </div>
            <div className="rounded-lg bg-bg-card border border-bg-border p-2">
              <div className="text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" />Duration</div>
              <div className="text-white font-semibold">
                {Math.round((new Date(t.endTime).getTime() - new Date(t.startTime).getTime()) / 60000)} min
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}