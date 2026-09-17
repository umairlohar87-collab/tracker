"use client";
import useSWR from "swr";
import { fetchVehicles } from "@/lib/api";

export function useVehicles(refreshMs = 5000) {
  const { data, error, isLoading, mutate } = useSWR("vehicles", fetchVehicles, {
    refreshInterval: refreshMs,
    revalidateOnFocus: true,
  });
  return { vehicles: data ?? [], error, isLoading, mutate };
}