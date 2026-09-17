"use client";
import { Bell, Search, Command, ChevronDown, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { requestNotificationPermission } from "@/lib/notifications";
import { toast } from "sonner";

export default function Topbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  const enableNotifications = async () => {
    const p = await requestNotificationPermission();
    if (p === "granted") toast.success("Notifications enabled");
    else if (p === "unsupported") toast.error("Browser does not support notifications");
    else toast.warning("Notification permission denied");
  };

  return (
    <header className="shrink-0 h-14 sm:h-16 flex items-center gap-2 sm:gap-3 border-b border-bg-border/60 bg-bg-soft/30 backdrop-blur-xl px-3 sm:px-4 md:px-6">
      {/* Mobile brand (shown only on mobile, since sidebar is hidden) */}
      <div className="md:hidden flex items-center gap-2 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-brand-gradient grid place-items-center shadow-glow-sm">
          <span className="text-[11px] font-bold text-white">FT</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-0 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <input
          placeholder="Search…"
          className="w-full h-9 sm:h-10 rounded-xl bg-bg-card/60 border border-bg-border/60 pl-9 sm:pl-10 pr-3 text-sm outline-none focus:border-brand/50 focus:bg-bg-card transition placeholder:text-slate-500"
        />
        <kbd className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 text-[10px] text-slate-500 bg-bg-soft border border-bg-border/60 rounded px-1.5 py-0.5">
          <Command className="h-2.5 w-2.5" /> K
        </kbd>
      </div>

      {/* Live clock (hidden on small phones) */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-bg-card/60 border border-bg-border/60 px-3 py-2 rounded-xl shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="font-mono tabular-nums">{time}</span>
      </div>

      {/* Notifications */}
      <button
        onClick={enableNotifications}
        aria-label="Enable notifications"
        className="h-9 sm:h-10 w-9 sm:w-auto sm:px-3 rounded-xl bg-bg-card/60 border border-bg-border/60 text-slate-200 hover:border-brand/50 hover:text-white flex items-center gap-2 transition shrink-0 active:scale-95"
      >
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Alerts</span>
      </button>

      {/* Profile */}
      <button className="flex items-center gap-2 h-9 sm:h-10 pl-1 pr-1 sm:pr-2 rounded-xl bg-bg-card/60 border border-bg-border/60 hover:border-brand/50 transition shrink-0 active:scale-95">
        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-brand-gradient grid place-items-center text-[11px] sm:text-xs font-bold text-white">
          AK
        </div>
        <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-slate-500" />
      </button>
    </header>
  );
}