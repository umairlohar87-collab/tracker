"use client";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Vehicle } from "@/lib/types";

// Fix default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ---------- Helpers ----------

function isValidCoord(lat: any, lng: any): boolean {
  const nLat = Number(lat);
  const nLng = Number(lng);
  return (
    Number.isFinite(nLat) &&
    Number.isFinite(nLng) &&
    nLat >= -90 && nLat <= 90 &&
    nLng >= -180 && nLng <= 180
  );
}

function colorFor(status: Vehicle["status"]) {
  switch (status) {
    case "moving":  return "#10b981";
    case "idle":    return "#f59e0b";
    case "parked":  return "#94a3b8";
    case "offline": return "#ef4444";
    default:        return "#94a3b8";
  }
}

function vehicleIcon(v: Vehicle) {
  const color = colorFor(v.status);
  const pulse = v.status === "moving";
  const initial = (v.name?.charAt(0) ?? "?").toUpperCase();

  return L.divIcon({
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14],
    html: `
      <div style="position:relative;width:32px;height:32px;">
        ${
          pulse
            ? `<span class="radar-pulse" style="position:absolute;inset:0;color:${color};border-radius:9999px;"></span>`
            : ""
        }
        <span style="
          position:absolute;inset:0;border-radius:9999px;
          background: radial-gradient(circle at 30% 30%, ${color}, ${color}cc);
          box-shadow: 0 0 0 2px rgba(255,255,255,.18), 0 0 16px ${color}99;
          display:grid;place-items:center;color:#ffffff;font-weight:800;font-size:12px;
          font-family: ui-sans-serif, system-ui;
          backdrop-filter: blur(4px);
          border: 1.5px solid rgba(255,255,255,.35);
        ">${initial}</span>
      </div>`,
  });
}

// ---------- Recenter (guarded) ----------

function Recenter({ vehicle }: { vehicle?: Vehicle }) {
  const map = useMap();

  useEffect(() => {
    if (!vehicle) return;
    if (!isValidCoord(vehicle.lat, vehicle.lng)) return;
    if (!map) return;

    const lat = Number(vehicle.lat);
    const lng = Number(vehicle.lng);

    // Delay one tick to ensure the map container is fully measured
    const t = setTimeout(() => {
      try {
        if (!map.getContainer() || !map.getContainer().offsetParent) return;
        map.flyTo([lat, lng], Math.max(map.getZoom() ?? 13, 13), {
          duration: 0.8,
        });
      } catch (err) {
        console.warn("Recenter skipped:", err);
      }
    }, 100);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle?.id, vehicle?.lat, vehicle?.lng, map]);

  return null;
}

// ---------- Map ----------

interface Props {
  vehicles: Vehicle[];
  selected?: Vehicle;
  onSelect: (v: Vehicle) => void;
}

export default function VehicleMap({ vehicles, selected, onSelect }: Props) {
  // Compute a safe initial center
  const center = useMemo<[number, number]>(() => {
    if (selected && isValidCoord(selected.lat, selected.lng)) {
      return [Number(selected.lat), Number(selected.lng)];
    }
    if (vehicles[0] && isValidCoord(vehicles[0].lat, vehicles[0].lng)) {
      return [Number(vehicles[0].lat), Number(vehicles[0].lng)];
    }
    return [24.8607, 67.0011];
  }, [selected, vehicles]);

  // Filter out vehicles with bad coords (don't render markers for them)
  const safeVehicles = useMemo(
    () => vehicles.filter((v) => isValidCoord(v.lat, v.lng)),
    [vehicles]
  );

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-bg-border/60 relative">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
          subdomains="abcd"
          maxZoom={20}
        />

        {safeVehicles.map((v) => (
          <Marker
            key={v.id}
            position={[Number(v.lat), Number(v.lng)]}
            icon={vehicleIcon(v)}
            eventHandlers={{ click: () => onSelect(v) }}
          >
            <Popup>
              <div style={{ minWidth: 200, fontFamily: "ui-sans-serif, system-ui" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: `radial-gradient(circle at 30% 30%, ${colorFor(v.status)}, ${colorFor(v.status)}cc)`,
                      display: "grid", placeItems: "center",
                      color: "#fff", fontWeight: 800, fontSize: 12,
                    }}
                  >
                    {v.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      {v.plate} · {v.driver}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 10, fontWeight: 600, textTransform: "uppercase",
                      letterSpacing: "0.05em", padding: "3px 8px", borderRadius: 999,
                      background: `${colorFor(v.status)}1a`,
                      color: colorFor(v.status),
                      border: `1px solid ${colorFor(v.status)}40`,
                    }}
                  >
                    <span
                      style={{
                        width: 6, height: 6, borderRadius: 999,
                        background: colorFor(v.status),
                      }}
                    />
                    {v.status}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: 6, fontSize: 11,
                  }}
                >
                  <PopupStat label="Speed" value={`${v.speed} km/h`} />
                  <PopupStat label="Heading" value={`${v.heading}°`} />
                  <PopupStat label="Fuel" value={`${v.fuel}%`} />
                  <PopupStat label="Battery" value={`${v.battery}%`} />
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <Recenter vehicle={selected} />
      </MapContainer>
    </div>
  );
}

function PopupStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(15,22,48,0.6)",
        border: "1px solid #1a2344",
        borderRadius: 8,
        padding: "5px 8px",
      }}
    >
      <div
        style={{
          fontSize: 9, textTransform: "uppercase",
          letterSpacing: "0.05em", color: "#64748b", fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, marginTop: 2 }}>
        {value}
      </div>
    </div>
  );
}