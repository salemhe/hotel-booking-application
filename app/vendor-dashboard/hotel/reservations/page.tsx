"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, Plus } from 'lucide-react';
import { BookingTable } from './components/booking-table';
import { BookingFilters } from './components/booking-filters';
import { BookingStatus, PaymentStatus } from '@/types/booking';
import API from '@/app/lib/api/axios';
import { AuthService } from '@/app/lib/api/services/auth.service';
import { formatDate } from '@/utils/constant';

interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  // Added fields for more reservation details
  confirmationCode?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  roomType?: string;
  guests?: number;
  adults?: number;
  children?: number;
  specialRequest?: string;
  paymentMethod?: string;
  paymentStatus?: 'Fully Paid' | 'Partly paid' | 'Pending';
  totalPrice?: number;
  _id?: string;
  reservationStatus?: string;
  businessName?: string;
  location?: string;
  nights?: number;
  room?: {
    roomNumber?: string;
    roomType?: string;
    roomPrice?: number;
    hotelId?: string;
  };
}

// Helper function to transform API data to match component expectations
interface ApiRoom {
  roomNumber?: string;
  roomType?: string;
  roomPrice?: number;
  hotelId?: string;
}

interface ApiReservation {
  _id?: string;
  id?: string;
  guestName?: string;
  customerName?: string;
  roomNumber?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  reservationStatus?: string;
  totalAmount?: number;
  totalPrice?: number;
  confirmationCode?: string;
  customerEmail?: string;
  customerPhone?: string;
  roomType?: string;
  guests?: number;
  adults?: number;
  children?: number;
  specialRequest?: string;
  paymentMethod?: string;
  paymentStatus?: 'Fully Paid' | 'Partly paid' | 'Pending';
  businessName?: string;
  location?: string;
  nights?: number;
  room?: ApiRoom;
}

const transformReservationData = (reservation: ApiReservation): Reservation => {
  return {
    id: reservation._id || reservation.id || '',
    guestName: reservation.customerName || 'Unknown Guest',
    roomNumber: reservation.room?.roomNumber || 'N/A',
    checkIn: reservation.checkIn || '',
    checkOut: reservation.checkOut || '',
    status: mapReservationStatus(reservation.reservationStatus || 'pending'),
    totalAmount: reservation.totalPrice || 0,
    confirmationCode: reservation.confirmationCode,
    customerName: reservation.customerName,
    customerEmail: reservation.customerEmail,
    customerPhone: reservation.customerPhone,
    roomType: reservation.room?.roomType,
    guests: reservation.guests,
    adults: reservation.adults,
    children: reservation.children,
    specialRequest: reservation.specialRequest,
    paymentMethod: reservation.paymentMethod,
    paymentStatus: reservation.paymentStatus,
    totalPrice: reservation.totalPrice,
    _id: reservation._id,
    reservationStatus: reservation.reservationStatus,
    businessName: reservation.businessName,
    location: reservation.location,
    nights: reservation.nights,
    room: reservation.room
  };
};

// Helper function to map API status to component status
const mapReservationStatus = (apiStatus: string): 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' => {
  switch (apiStatus?.toLowerCase()) {
    case 'confirmed':
      return 'confirmed';
    case 'checked-in':
    case 'checkedin':
      return 'checked-in';
    case 'checked-out':
    case 'checkedout':
      return 'checked-out';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

export default function Home() {
  const [activeStatus, setActiveStatus] = useState<BookingStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('All');

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // Get the user data from AuthService
      const user = AuthService.getUser();
      if (!user) {
        console.warn("No user found in storage");
        setLoading(false);
        return;
      }
      
      // Get the token
      const token = AuthService.getToken();
      if (!token) {
        console.warn("No token found");
        setLoading(false);
        return;
      }
      
      // Fetch reservations data
      const response = await API.get(`/api/vendors/reservations?vendorId=${user.id}`);
      console.log(response.data, "response.data");
      
      if (response.data && Array.isArray(response.data)) {
        // Transform the API data to match component expectations
        const transformedReservations = response.data.map(transformReservationData);
        setReservations(transformedReservations);
      } else {
        console.warn("Invalid reservation data format");
        setApiError("Invalid data format received from server");
      }
    } catch (error: unknown) {
      console.error("Failed to fetch reservation data:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response: { status: number; data: unknown } };
        console.error("Error response:", apiError.response.status, apiError.response.data);
        setApiError(`Failed to fetch reservations: ${apiError.response.status}`);
      } else {
        setApiError("Failed to fetch reservations");
      }
    } finally {
      setLoading(false);
    }
  };

  console.log("reservations", reservations);

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter bookings based on current filters - NOW USES FETCHED DATA
  const filteredBookings = useMemo(() => {
    let filtered = reservations; // Changed from sampleBookings to reservations

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(booking => 
        booking.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.confirmationCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.guestName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (activeStatus !== 'All') {
      filtered = filtered.filter(booking => booking.status === activeStatus.toLowerCase());
    }

    // Filter by payment status
    if (paymentStatus !== 'All') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentStatus.toLowerCase());
    }

    return filtered;
  }, [reservations, searchQuery, paymentStatus, activeStatus]); // Added reservations and activeStatus to dependencies

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
          
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Show tabs
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2 bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700">Loading reservations...</p>
          </div>
        )}

        {/* Error State */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <p className="text-red-700">{apiError}</p>
            <Button
              onClick={fetchReservations} 
              variant="ghost" 
              size="sm" 
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <BookingFilters
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            paymentStatus={paymentStatus}
            onPaymentStatusChange={setPaymentStatus}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredBookings.length} of {reservations.length} bookings
          </p>
        </div>

        {/* Bookings Table - NOW DISPLAYS FETCHED DATA */}
        <BookingTable
          bookings={filteredBookings.map((reservation) => ({
            // Map Reservation to Booking type
            id: reservation.id,
            customer: {
              userId: reservation.id, // Fallback, update if you have a real userId
              customerName: reservation.customerName || reservation.guestName || 'N/A',
              avatar: undefined, // Add avatar if available
            },
            checkInDate: formatDate(reservation.checkIn),
            checkOutDate: formatDate(reservation.checkOut),
            roomType: reservation.room?.roomType || reservation.roomType || 'Standard', // Ensure roomType is always present
            numberOfGuests: reservation.guests ?? reservation.adults ?? 1,
            paymentStatus: reservation.paymentStatus || 'Pending',
          }))}
        />

        {/* No Data State */}
        {!loading && reservations.length === 0 && !apiError && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No bookings found</p>
            <p className="text-gray-400">Bookings will appear here once they are made.</p>
          </div>
        )}
      </div>
    </div>
  );
}
