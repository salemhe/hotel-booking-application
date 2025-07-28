"use client";

import { RealtimeReservations } from '@/app/components/reservations/RealtimeReservations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useState, useEffect } from 'react';
import { AuthService } from '@/app/lib/api/services/auth.service';
import API from '@/app/lib/api/axios';
import {
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  RefreshCw
} from 'lucide-react';

interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  todayTotal: number;
  tomorrowTotal: number;
  revenue: number;
}

export default function BookingManagementPage() {
  const [stats, setStats] = useState<ReservationStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    todayTotal: 0,
    tomorrowTotal: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const user = AuthService.getUser();
      if (!user?.profile?.id) return;

      // Fetch reservation statistics
      const response = await API.get(`/vendors/reservations/stats?vendorId=${user.profile.id}`);
      setStats(response.data.stats || {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        todayTotal: 0,
        tomorrowTotal: 0,
        revenue: 0
      });
    } catch (error) {
      console.error('Error fetching reservation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon: Icon, color = "text-blue-600", bgColor = "bg-blue-50" }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
    bgColor?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant and hotel reservations in real-time</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshStats}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Reservation
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reservations"
          value={loading ? "..." : stats.total}
          icon={Calendar}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Pending"
          value={loading ? "..." : stats.pending}
          icon={AlertCircle}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
        />
        <StatCard
          title="Confirmed"
          value={loading ? "..." : stats.confirmed}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Today's Bookings"
          value={loading ? "..." : stats.todayTotal}
          icon={Clock}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Completed"
          value={loading ? "..." : stats.completed}
          icon={CheckCircle}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Tomorrow's Bookings"
          value={loading ? "..." : stats.tomorrowTotal}
          icon={Calendar}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
        />
        <StatCard
          title="Total Revenue"
          value={loading ? "..." : `₦${stats.revenue.toLocaleString()}`}
          icon={TrendingUp}
          color="text-green-600"
          bgColor="bg-green-50"
        />
      </div>

      {/* Reservation Management Tabs */}
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">Live Reservations</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Real-time Reservations
              </CardTitle>
              <CardDescription>
                Monitor and manage all incoming reservations in real-time. Updates automatically when new bookings arrive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealtimeReservations />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                View your reservations in a calendar format for better planning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Calendar view coming soon...</p>
                <p className="text-sm">This will show all reservations in a monthly calendar format</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Analytics</CardTitle>
              <CardDescription>
                Analyze your booking patterns and performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard coming soon...</p>
                <p className="text-sm">This will show booking trends, peak hours, and revenue analytics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
