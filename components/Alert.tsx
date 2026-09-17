"use client";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import type { Alert } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface Props {
  alerts: Alert[];
}

const styles: Record<
  Alert["severity"],
  { cls: string; icon: React.ComponentType<{ className?: string }> }
> = {
  info: {
    cls: "border-blue-500/25 bg-blue-500/[0.06] text-blue-200",
    icon: Info,
  },
  warning: {
    cls: "border-amber-500/25 bg-amber-500/[0.06] text-amber-200",
    icon: AlertTriangle,
  },
  critical: {
    cls: "border-rose-500/30 bg-rose-500/[0.08] text-rose-200",
    icon: ShieldAlert,
  },
};

export default function AlertList({ alerts }: Props) {
  if (!alerts.length) {
    return (
      <div className="text-xs text-slate-500 text-center py-6 flex flex-col items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 grid place-items-center">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        All clear — no alerts
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((a) => {
        const s = styles[a.severity];
        const Icon = s.icon;
        return (
          <div
            key={a.id}
            className={`rounded-xl border p-2.5 flex items-start gap-2.5 animate-fadeIn ${s.cls}`}
          >
            <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium leading-snug">{a.message}</div>
              <div className="text-[10px] opacity-60 mt-0.5 uppercase tracking-wider">
                {a.type.replace(/_/g, " ")} · {timeAgo(a.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}