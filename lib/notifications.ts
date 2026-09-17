"use client";

export async function requestNotificationPermission(): Promise<string> {
  if (typeof window === "undefined") return "default";
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  return await Notification.requestPermission();
}

export function sendNotification(
  title: string,
  body: string,
  options?: NotificationOptions
) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, ...options });
  } catch {}
}

export function playAlarm() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.value = 880;
    g.gain.value = 0.15;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.9);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    o.stop(ctx.currentTime + 1);
  } catch {}
}