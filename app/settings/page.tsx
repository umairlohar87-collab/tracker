"use client";
import AppShell from "@/components/AppShell";
import { requestNotificationPermission } from "@/lib/notifications";
import { toast } from "sonner";

export default function SettingsPage() {
  const enable = async () => {
    const p = await requestNotificationPermission();
    if (p === "granted") toast.success("Notifications enabled");
    else if (p === "unsupported") toast.error("Browser doesn't support notifications");
    else toast.warning("Permission denied");
  };
  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="rounded-2xl border border-bg-border bg-bg-soft p-5">
          <div className="font-semibold mb-1">Browser notifications</div>
          <p className="text-sm text-slate-400 mb-3">
            Get desktop alerts when someone tries to start an armed vehicle.
          </p>
          <button onClick={enable} className="h-10 px-4 rounded-xl bg-brand hover:bg-brand-soft transition font-medium text-white">
            Enable notifications
          </button>
        </div>
      </div>
    </AppShell>
  );
}