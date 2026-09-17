"use client";
import useSWR from "swr";
import { fetchAlerts } from "@/lib/api";

export function useAlerts(refreshMs = 8000) {
  const { data, error, isLoading, mutate } = useSWR("alerts", fetchAlerts, {
    refreshInterval: refreshMs,
  });
  return { alerts: data ?? [], error, isLoading, mutate };
}