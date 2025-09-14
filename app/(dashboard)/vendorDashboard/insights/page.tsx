"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Chart from '@/components/chart';
import { useRealtimeReservations } from '@/hooks/useRealtimeReservations';
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from 'date-fns';

function InsightsPage() {
  const { reservations, loading, connected } = useRealtimeReservations();

  const dailyRevenueData = useMemo(() => {
    if (loading || !reservations) return [];

    const revenueMap = new Map<string, number>();
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 6); // Data for the last 7 days

    // Initialize map with last 7 days, set revenue to 0
    eachDayOfInterval({ start: sevenDaysAgo, end: today }).forEach(day => {
      revenueMap.set(format(day, 'yyyy-MM-dd'), 0);
    });

    reservations.forEach(reservation => {
      const reservationDate = startOfDay(parseISO(reservation.date));
      const formattedDate = format(reservationDate, 'yyyy-MM-dd');

      // Only include reservations within the last 7 days
      if (reservationDate >= sevenDaysAgo && reservationDate <= today) {
        revenueMap.set(formattedDate, (revenueMap.get(formattedDate) || 0) + reservation.totalPrice);
      }
    });

    return Array.from(revenueMap.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, total]) => ({
        day: format(parseISO(date), 'MMM dd'),
        total: total,
      }));
  }, [reservations, loading]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
        </div>
        <div className="min-h-[100vh] animate-pulse flex-1 rounded-xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Vendor Insights</h1>
      <p className="text-gray-600">Real-time data and analytics for your restaurant.</p>

      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyRevenueData.length > 0 ? (
            <Chart data={dailyRevenueData} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No revenue data available for the last 7 days.
            </div>
          )}
        </CardContent>
      </Card>

      {/* You can add more cards and charts here for other insights */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>WebSocket Connection: {connected ? 'Connected' : 'Disconnected'}</p>
          <p>Total Reservations: {reservations.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default InsightsPage;
