"use client";

import React from 'react';
import { useRealtimeReservations, Reservation } from '@/app/hooks/useRealtimeReservations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  Eye,
  ArrowRight,
  Wifi,
  WifiOff
} from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';
import Link from 'next/link';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const RealtimeReservationsWidget = () => {
  const { reservations, loading, connected } = useRealtimeReservations();
  
  // Get recent reservations (last 5)
  const recentReservations = reservations
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 5);

  // Get today's reservations
  const todayReservations = reservations.filter(r => isToday(parseISO(r.date)));
  
  // Get pending reservations
  const pendingReservations = reservations.filter(r => r.status === 'pending');

  const ReservationItem = ({ reservation }: { reservation: Reservation }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-sm truncate">{reservation.customerName}</p>
          <Badge className={`text-xs ${statusColors[reservation.status]}`}>
            {reservation.status}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {isToday(parseISO(reservation.date)) ? 'Today' : format(parseISO(reservation.date), 'MMM dd')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {reservation.time}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {reservation.guests}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm text-green-600">
          ₦{reservation.totalPrice.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">
          {reservation.reservationType}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Reservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connection Status</p>
                <p className="text-lg font-bold flex items-center gap-2">
                  {connected ? (
                    <>
                      <Wifi className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Live</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">Offline</span>
                    </>
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${connected ? 'bg-green-50' : 'bg-red-50'}`}>
                {connected ? (
                  <Wifi className="h-6 w-6 text-green-600" />
                ) : (
                  <WifiOff className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today&apos;s Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{todayReservations.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingReservations.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Reservations
                {connected && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates" />
                )}
              </CardTitle>
              <CardDescription>
                Latest bookings and reservations in real-time
              </CardDescription>
            </div>
            <Link href="/vendorDashboard/bookingManagement">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentReservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations yet</h3>
              <p className="text-gray-500">
                New reservations will appear here in real-time once customers start booking.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReservations.map((reservation) => (
                <ReservationItem key={reservation._id} reservation={reservation} />
              ))}
              {reservations.length > 5 && (
                <div className="text-center pt-4 border-t">
                  <Link href="/vendorDashboard/bookingManagement">
                    <Button variant="ghost" className="flex items-center gap-2">
                      View {reservations.length - 5} more reservations
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Actions */}
      {pendingReservations.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Pending Actions ({pendingReservations.length})
            </CardTitle>
            <CardDescription className="text-yellow-700">
              These reservations need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReservations.slice(0, 3).map((reservation) => (
                <div 
                  key={reservation._id}
                  className="flex items-center justify-between p-3 bg-white border border-yellow-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{reservation.customerName}</p>
                    <p className="text-xs text-gray-600">
                      {format(parseISO(reservation.date), 'MMM dd')} at {reservation.time} • {reservation.guests} guests
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/vendorDashboard/bookingManagement">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {pendingReservations.length > 3 && (
                <div className="text-center pt-2">
                  <Link href="/vendorDashboard/bookingManagement">
                    <Button variant="ghost" size="sm" className="text-yellow-800">
                      View {pendingReservations.length - 3} more pending
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
