// src/components/VehicleCard.tsx
'use client';

import { VehicleLocation } from '@/lib/types';
import { MapPin, Gauge, Clock } from 'lucide-react';

interface VehicleCardProps {
  location: VehicleLocation;
  isSelected: boolean;
  onClick: () => void;
}

export default function VehicleCard({ location, isSelected, onClick }: VehicleCardProps) {
  const lastUpdate = new Date(location.created_at);
  const timeAgo = getTimeAgo(lastUpdate);
  const isMoving = location.speed && location.speed > 0;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-lg border transition-all
        ${isSelected 
          ? 'bg-blue-50 border-blue-500 shadow-md' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">{location.device_id}</span>
        <span className={`
          px-2 py-0.5 rounded-full text-xs font-medium
          ${isMoving 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
          }
        `}>
          {isMoving ? 'Moving' : 'Idle'}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span className="truncate">
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Gauge size={14} />
          <span>{location.speed ?? 'N/A'} km/h</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{timeAgo}</span>
        </div>
      </div>
    </button>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}