"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bell, Route, Settings, Car, Zap } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/trips", label: "Trips", icon: Route },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="hidden md:flex w-[76px] lg:w-64 xl:w-72 flex-col border-r border-bg-border/60 bg-bg-soft/40 backdrop-blur-xl p-3 lg:p-4 gap-1 shrink-0 transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 lg:px-3 py-2 mb-2">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-gradient grid place-items-center shadow-glow-sm">
          <Car className="h-5 w-5 text-white" />
        </div>
        <div className="hidden lg:block">
          <div className="text-sm font-bold text-white tracking-tight">FleetTrack</div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
            Realtime ops
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all justify-center lg:justify-start ${
                active
                  ? "bg-brand/10 text-white"
                  : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full bg-brand shadow-glow-sm" />
              )}
              <Icon
                className={`h-[18px] w-[18px] shrink-0 transition ${
                  active ? "text-brand" : "group-hover:text-brand"
                }`}
              />
              <span className="hidden lg:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="mt-auto hidden lg:block pt-4">
        <div className="relative rounded-2xl overflow-hidden p-4 bg-gradient-to-br from-brand/15 to-accent-violet/10 border border-brand/20">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-brand/25 blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-3.5 w-3.5 text-brand" />
              <span className="text-xs font-bold text-white">Pro features</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Geofencing, analytics & driver scores.
            </p>
            <button className="mt-3 w-full text-[11px] font-semibold rounded-lg py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white transition">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}