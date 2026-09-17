"use client";
import useSWR from "swr";
import AppShell from "@/components/AppShell";
import TripHistory from "@/components/TripHistory";
import { fetchTrips } from "@/lib/api";
import type { Trip } from "@/lib/types";

export default function TripsPage() {
  const { data, isLoading, error } = useSWR<Trip[]>("trips", fetchTrips);

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Trip history</h1>
        <p className="text-slate-400 text-sm mb-4">
          Completed trips across your fleet.
        </p>

        {error ? (
          <div className="text-red-400 text-sm">Failed to load trips.</div>
        ) : isLoading ? (
          <div className="text-slate-500 text-sm">Loading…</div>
        ) : (
          <TripHistory trips={data ?? []} />
        )}
      </div>
    </AppShell>
  );
}