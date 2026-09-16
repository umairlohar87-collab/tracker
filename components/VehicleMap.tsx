// src/components/VehicleMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VehicleLocation } from '@/lib/types';

// Fix for Leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface VehicleMapProps {
  locations: VehicleLocation[];
  selectedDeviceId?: string;
  onSelectDevice?: (deviceId: string) => void;
}

export default function VehicleMap({ 
  locations, 
  selectedDeviceId,
  onSelectDevice 
}: VehicleMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('vehicle-map').setView([24.8607, 67.0011], 12); // Karachi center
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    const currentDeviceIds = new Set(locations.map(l => l.device_id));

    // Remove markers for devices no longer present
    markersRef.current.forEach((marker, deviceId) => {
      if (!currentDeviceIds.has(deviceId)) {
        marker.remove();
        markersRef.current.delete(deviceId);
      }
    });

    // Add or update markers
    locations.forEach((location) => {
      const existingMarker = markersRef.current.get(location.device_id);
      const isSelected = location.device_id === selectedDeviceId;

      // Create custom icon (you can customize this further)
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${isSelected ? '#3b82f6' : '#10b981'};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s;
          "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      if (existingMarker) {
        // Update existing marker
        existingMarker.setLatLng([location.latitude, location.longitude]);
        existingMarker.setIcon(icon);
        existingMarker.setPopupContent(createPopupContent(location));
      } else {
        // Create new marker
        const marker = L.marker([location.latitude, location.longitude], { icon })
          .addTo(mapRef.current!)
          .bindPopup(createPopupContent(location));

        marker.on('click', () => {
          onSelectDevice?.(location.device_id);
        });

        markersRef.current.set(location.device_id, marker);
      }
    });

    // Fit bounds to show all markers if there are any
    if (locations.length > 0 && !selectedDeviceId) {
      const bounds = L.latLngBounds(
        locations.map(l => [l.latitude, l.longitude] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Center on selected device
    if (selectedDeviceId) {
      const selectedLocation = locations.find(l => l.device_id === selectedDeviceId);
      if (selectedLocation) {
        mapRef.current.setView(
          [selectedLocation.latitude, selectedLocation.longitude],
          15
        );
      }
    }
  }, [locations, selectedDeviceId, onSelectDevice]);

  return (
    <div 
      id="vehicle-map" 
      className="w-full h-full rounded-lg shadow-lg"
      style={{ minHeight: '400px' }}
    />
  );
}

function createPopupContent(location: VehicleLocation): string {
  return `
    <div class="p-2">
      <h3 class="font-bold text-sm">${location.device_id}</h3>
      <p class="text-xs text-gray-600">
        Speed: ${location.speed ?? 'N/A'} km/h
      </p>
      <p class="text-xs text-gray-500">
        ${new Date(location.created_at).toLocaleTimeString()}
      </p>
    </div>
  `;
}