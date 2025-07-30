"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { useRealtimeBookings, UserBooking } from '@/app/hooks/useRealtimeBookings';

export default function BookingsPage() {
  const { bookings, loading, connected, cancelBooking } = useRealtimeBookings();
  const [filteredBookings, setFilteredBookings] = useState<UserBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, activeTab]);

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab
    switch (activeTab) {
      case 'upcoming':
        filtered = filtered.filter(booking => 
          !isPast(parseISO(booking.date)) && booking.status !== 'cancelled'
        );
        break;
      case 'past':
        filtered = filtered.filter(booking => 
          isPast(parseISO(booking.date)) || booking.status === 'completed'
        );
        break;
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const BookingCard = ({ booking }: { booking: UserBooking }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={booking.image || '/hero-bg.jpg'}
              alt={booking.businessName}
              fill
              className="object-cover rounded-l-lg"
            />
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{booking.businessName}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Badge variant="outline" className="mr-2">
                    {booking.reservationType === 'restaurant' ? 'Restaurant' : 'Hotels'}
                  </Badge>
                  <span>{booking.reservationType === 'hotel' ? 'Apartments' : ''}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  {booking.status === 'confirmed' && (
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Modify Booking
                    </DropdownMenuItem>
                  )}
                  {booking.status !== 'completed' && (
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">
                {booking.reservationType === 'hotel' 
                  ? `${getDateLabel(booking.date)} - ${format(parseISO(booking.date), 'MMM dd, yyyy')}` 
                  : getDateLabel(booking.date)
                }
              </span>
              <Clock className="h-4 w-4 mr-1" />
              <span className="mr-4">
                {booking.reservationType === 'hotel' ? booking.checkIn : `Time: ${booking.time}`}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="mr-4">{booking.location}</span>
              <Users className="h-4 w-4 mr-1" />
              <span>
                {booking.reservationType === 'hotel' 
                  ? booking.roomType || `${booking.guests} Guests, 1 Room`
                  : `${booking.guests} Guests`
                }
              </span>
            </div>

            <div className="flex justify-between items-center">
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <Button 
                size="sm" 
                className={booking.status === 'completed' ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                {booking.status === 'completed' ? 'Leave Review' : 'View Details'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const upcomingCount = bookings.filter(b => !isPast(parseISO(b.date)) && b.status !== 'cancelled').length;
  const pastCount = bookings.filter(b => isPast(parseISO(b.date)) || b.status === 'completed').length;

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings/Reservation</h1>
          <p className="text-gray-600">Manage your restaurant and hotel bookings</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm">
            {connected ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Live updates</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-600" />
                <span className="text-red-600">Offline</span>
              </>
            )}
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-gray-100 p-1 rounded-full">
            <TabsTrigger 
              value="upcoming" 
              className="rounded-full px-6 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="rounded-full px-6 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Reservations
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by guest name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {/* Upcoming Bookings */}
        <TabsContent value="upcoming">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Upcoming Bookings ({upcomingCount})</h2>
          </div>
          
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
              <p className="text-gray-500 mb-4">
                You don&apos;t have any upcoming reservations.
              </p>
              <Link href="/">
                <Button>Book a Table</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Past Bookings */}
        <TabsContent value="past">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Past Reservations ({pastCount})</h2>
          </div>
          
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No past reservations</h3>
              <p className="text-gray-500">Your completed bookings will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
