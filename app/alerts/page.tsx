"use client";
import AppShell from "@/components/AppShell";
// import AlertList from "@/components/Alert";
import { useAlerts } from "@/hooks/useAlerts";

export default function AlertsPage() {
  const { alerts, isLoading } = useAlerts(5000);

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Alerts</h1>
        <p className="text-slate-400 text-sm mb-4">
          All system &amp; security notifications.
        </p>

        {/* {isLoading ? (
          <div className="text-slate-500 text-sm">Loading alerts…</div>
        ) : 
        //   <AlertList alerts={alerts} />
        } */}
      </div>
    </AppShell>
  );
}