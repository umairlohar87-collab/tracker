"use client";
import { Car, Activity, AlertTriangle, Fuel, TrendingUp, TrendingDown } from "lucide-react";
import type { Vehicle } from "@/lib/types";

export default function StatsPanel({ vehicles }: { vehicles: Vehicle[] }) {
  const total = vehicles.length;
  const moving = vehicles.filter((v) => v.status === "moving").length;
  const unarmed = vehicles.filter((v) => !v.armed).length;
  const avgFuel = total
    ? Math.round(vehicles.reduce((s, v) => s + v.fuel, 0) / total)
    : 0;

  const cards = [
    {
      label: "Total fleet",
      value: total,
      icon: Car,
      tint: "from-blue-500/20 to-blue-500/0",
      iconColor: "text-blue-400",
      trend: "+2",
      trendUp: true,
    },
    {
      label: "Moving now",
      value: moving,
      icon: Activity,
      tint: "from-emerald-500/20 to-emerald-500/0",
      iconColor: "text-emerald-400",
      trend: `${moving > 0 ? "LIVE" : "—"}`,
      trendUp: moving > 0,
    },
    {
      label: "Unarmed",
      value: unarmed,
      icon: AlertTriangle,
      tint: "from-amber-500/20 to-amber-500/0",
      iconColor: "text-amber-400",
      trend: unarmed > 0 ? "risk" : "safe",
      trendUp: unarmed === 0,
    },
    {
      label: "Avg fuel",
      value: `${avgFuel}%`,
      icon: Fuel,
      tint: "from-purple-500/20 to-purple-500/0",
      iconColor: "text-purple-400",
      trend: avgFuel > 50 ? "healthy" : "low",
      trendUp: avgFuel > 50,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="group relative rounded-2xl bg-bg-soft/60 backdrop-blur border border-bg-border/60 p-3.5 overflow-hidden hover:border-brand/30 transition"
        >
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${c.tint}`}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-8 w-8 rounded-lg bg-bg-card border border-bg-border/60 grid place-items-center ${c.iconColor}`}>
                <c.icon className="h-4 w-4" />
              </div>
              <div
                className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                  c.trendUp ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {c.trendUp ? (
                  <TrendingUp className="h-2.5 w-2.5" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5" />
                )}
                {c.trend}
              </div>
            </div>
            <div className="text-2xl font-bold text-white leading-none tracking-tight">
              {c.value}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}