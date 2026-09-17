"use client";
import { useCallback, useState } from "react";
import { setEngineLock, setArm } from "@/lib/api";
import { toast } from "sonner";
import { playAlarm, sendNotification } from "@/lib/notifications";
import type { Vehicle } from "@/lib/types";

export function useEngineLock() {
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const toggleEngine = useCallback(async (vehicle: Vehicle, engineOn: boolean) => {
    setPending((p) => ({ ...p, [vehicle.id]: true }));
    try {
      await setEngineLock(vehicle.id, engineOn);
      if (engineOn) {
        toast.success(`${vehicle.name} engine UNLOCKED`, {
          description: "Vehicle can now be started.",
        });
      } else {
        toast.warning(`${vehicle.name} engine LOCKED`, {
          description: "Ignition is disabled.",
        });
        sendNotification(
          "Engine locked",
          `${vehicle.name} (${vehicle.plate}) ignition disabled.`
        );
      }
    } catch {
      toast.error("Failed to update engine state");
    } finally {
      setPending((p) => ({ ...p, [vehicle.id]: false }));
    }
  }, []);

  const toggleArm = useCallback(async (vehicle: Vehicle, armed: boolean) => {
    setPending((p) => ({ ...p, [vehicle.id]: true }));
    try {
      await setArm(vehicle.id, armed);
      if (armed) {
        toast.success(`${vehicle.name} armed`, {
          description: "You'll be alerted on motion.",
        });
        sendNotification(
          "Vehicle armed",
          `${vehicle.name} is now under watch.`
        );
      } else {
        toast(`${vehicle.name} disarmed`);
      }
    } catch {
      toast.error("Failed to update arm state");
    } finally {
      setPending((p) => ({ ...p, [vehicle.id]: false }));
    }
  }, []);

  const triggerIntrusion = useCallback((vehicle: Vehicle) => {
    playAlarm();
    sendNotification(
      "🚨 Intrusion detected!",
      `${vehicle.name} (${vehicle.plate}) is being started!`,
      { requireInteraction: true }
    );
    toast.error("🚨 Intrusion detected!", {
      description: `Someone is trying to start ${vehicle.name}.`,
      duration: 8000,
    });
  }, []);

  return { pending, toggleEngine, toggleArm, triggerIntrusion };
}