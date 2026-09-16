// src/app/dashboard/page.tsx
import { fetchLatestLocations, fetchDashboardStats } from '@/lib/api';
import DashboardClient from '@/app/dashboard/DashboardClient';
export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function DashboardPage() {
  // Fetch initial data on the server
  const [locations, stats] = await Promise.all([
    fetchLatestLocations(),
    fetchDashboardStats(),
  ]);

  return (
    <DashboardClient 
      initialLocations={locations} 
      initialStats={stats} 
    />
  );
}