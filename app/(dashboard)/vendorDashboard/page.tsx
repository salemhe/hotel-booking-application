"use client";

import { useState, useEffect } from 'react';
import { useRealtimeReservations } from '@/app/hooks/useRealtimeReservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';
import Link from 'next/link';
import { AuthService } from '@/app/lib/api/services/auth.service';

interface DashboardStats {
  reservationsToday: number;
  pendingReservations: number;
  expectedGuests: number;
  pendingPayments: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
}

export default function VendorDashboard() {
  const { reservations, loading, connected } = useRealtimeReservations();
  const [stats, setStats] = useState<DashboardStats>({
    reservationsToday: 0,
    pendingReservations: 0,
    expectedGuests: 0,
    pendingPayments: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0
  });
  
  const [user, setUser] = useState<{ profile: { businessName?: string; firstName?: string } } | null>(null);

  useEffect(() => {
    const userInfo = AuthService.getUser();
    setUser(userInfo);
  }, []);

  useEffect(() => {
    if (reservations.length > 0) {
      const todayReservations = reservations.filter(r => isToday(parseISO(r.date)));
      const pending = reservations.filter(r => r.status === 'pending');
      
      setStats({
        reservationsToday: todayReservations.length,
        pendingReservations: pending.length,
        expectedGuests: todayReservations.reduce((sum, r) => sum + r.guests, 0),
        pendingPayments: pending.length,
        weeklyRevenue: reservations.reduce((sum, r) => sum + r.totalPrice, 0),
        monthlyRevenue: reservations.reduce((sum, r) => sum + r.totalPrice, 0)
      });
    }
  }, [reservations]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, color = "text-blue-600", bgColor = "bg-blue-50", change }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
    bgColor?: string;
    change?: string;
  }) => (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {change} vs last week
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ReservationCard = ({ reservation, isCompact = false }: { reservation: { _id: string; customerName: string; date: string; time: string; guests: number; status: string; totalPrice: number }; isCompact?: boolean }) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    const paymentStatusColors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${reservation.customerName}`} />
              <AvatarFallback>{reservation.customerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{reservation.customerName}</p>
              <p className="text-xs text-gray-500">ID #{reservation._id.slice(-6)}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={statusColors[reservation.status as keyof typeof statusColors]}>
              {reservation.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {isToday(parseISO(reservation.date)) ? 'Today' : format(parseISO(reservation.date), 'MMM dd')}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {reservation.time}
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {reservation.guests} guests
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            {formatCurrency(reservation.totalPrice)}
          </div>
        </div>

        {!isCompact && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {reservation.reservationType === 'restaurant' ? 'Restaurant' : 'Hotel'}
              </Badge>
              <Badge className={`text-xs ${paymentStatusColors.paid}`}>
                Payment Status
              </Badge>
            </div>
            <Link href="/vendorDashboard/bookingManagement">
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const todayReservations = reservations.filter(r => isToday(parseISO(r.date))).slice(0, 6);
  const pendingReservations = reservations.filter(r => r.status === 'pending').slice(0, 3);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getTimeGreeting()}, {user?.profile?.businessName || user?.profile?.firstName || 'Joseph'}!
          </h1>
          <p className="text-gray-600 mt-1">Here&apos;s what is happening today.</p>
        </div>
        <div className="flex items-center space-x-3">
          {connected && (
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>3 reservations coming in the next 30 minutes</span>
            </div>
          )}
          <Link href="/vendorDashboard/bookingManagement">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Walk-In Reservation</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Reservations made today"
          value={stats.reservationsToday}
          icon={Calendar}
          color="text-blue-600"
          bgColor="bg-blue-50"
          change="12% vs last week"
        />
        <StatCard
          title="Prepaid Reservations"
          value={reservations.filter(r => r.status !== 'cancelled').length}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
          change="8% vs last week"
        />
        <StatCard
          title="Expected Guests Today"
          value={stats.expectedGuests}
          icon={Users}
          color="text-purple-600"
          bgColor="bg-purple-50"
          change="5% vs last week"
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={DollarSign}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          change="6% vs last week"
        />
      </div>

      {/* Today&apos;s Reservations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>Today&apos;s Reservation ({todayReservations.length})</span>
              {connected && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates" />
              )}
            </CardTitle>
          </div>
          <Link href="/vendorDashboard/bookingManagement">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <span>View All</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {todayReservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations for today</h3>
              <p className="text-gray-500">New reservations will appear here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3">Customer name</th>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3">No of Guests</th>
                    <th className="pb-3">Meal Preselected</th>
                    <th className="pb-3">Payment Status</th>
                    <th className="pb-3">Reservation Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todayReservations.map((reservation) => (
                    <tr key={reservation._id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${reservation.customerName}`} />
                            <AvatarFallback>{reservation.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{reservation.customerName}</p>
                            <p className="text-sm text-gray-500">ID #{reservation._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium">
                            {format(parseISO(reservation.date), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-sm text-gray-500">Time: {reservation.time}</p>
                        </div>
                      </td>
                      <td className="py-4">{reservation.guests}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          {reservation.meals && reservation.meals.length > 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className="text-sm">
                            {reservation.meals && reservation.meals.length > 0 ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </td>
                      <td className="py-4">
                        <Badge className={`${
                          reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reservation.status === 'confirmed' ? 'Upcoming' : 
                           reservation.status === 'pending' ? 'In 30 mins' : 'In 1 hour'}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Link href="/vendorDashboard/bookingManagement">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Actions */}
      {pendingReservations.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <span>Pending Actions ({pendingReservations.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReservations.map((reservation) => (
                <ReservationCard key={reservation._id} reservation={reservation} isCompact />
              ))}
            </div>
            {pendingReservations.length > 3 && (
              <div className="text-center mt-4">
                <Link href="/vendorDashboard/bookingManagement">
                  <Button variant="ghost" className="text-yellow-800">
                    View all pending reservations
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
