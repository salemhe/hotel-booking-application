"use client";

import { useEffect, useState, useCallback } from 'react';
import SocketService from '@/app/lib/socket';
import { AuthService } from '@/app/lib/api/services/userAuth.service';

export interface UserBooking {
  _id: string;
  reservationType: 'restaurant' | 'hotel';
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  meals?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    specialRequest?: string;
  }>;
  rooms?: Array<{
    id: string;
    type: string;
    price: number;
    nights: number;
  }>;
  seatingPreference?: string;
  specialOccasion?: string;
  specialRequest?: string;
  vendorId: string;
  businessName: string;
  location: string;
  image?: string;
  checkIn?: string;
  checkOut?: string;
  roomType?: string;
  createdAt: string;
  updatedAt: string;
}

export const useRealtimeBookings = () => {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const addBooking = useCallback((newBooking: UserBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  }, []);

  const updateBooking = useCallback((updatedBooking: UserBooking) => {
    setBookings(prev => 
      prev.map(booking => 
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
  }, []);

  const removeBooking = useCallback((bookingId: string) => {
    setBookings(prev => 
      prev.filter(booking => booking._id !== bookingId)
    );
  }, []);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const userId = await AuthService.getId();
        if (!userId) {
          setLoading(false);
          return;
        }

        // Connect to socket
        const socket = SocketService.connect(userId, 'user');

        // Set up connection status monitoring
        const checkConnection = () => {
          const isConnected = SocketService.isConnected();
          setConnected(isConnected);

          if (isConnected) {
            // Join user room for real-time updates
            SocketService.joinUserRoom(userId);
          }
        };

        // Check connection immediately
        checkConnection();

        // Monitor connection status
        socket.on('connect', checkConnection);
        socket.on('disconnect', () => setConnected(false));

        // Set up event listeners for booking updates
        SocketService.onNewReservation((data) => {
          console.log('New booking received:', data);
          addBooking(data.booking as UserBooking);
        });

        SocketService.onReservationUpdate((data) => {
          console.log('Booking updated:', data);
          updateBooking(data.booking as UserBooking);
        });

        SocketService.onReservationCancelled((data) => {
          console.log('Booking cancelled:', data);
          if (data.action === 'remove') {
            if (data.bookingId) {
              removeBooking(data.bookingId);
            } else {
              console.warn('No bookingId provided for removal:', data);
            }
          } else {
            updateBooking(data.booking as UserBooking);
          }
        });

        // Listen for vendor confirmations
        socket.on('booking_confirmed', (data) => {
          console.log('Booking confirmed by vendor:', data);
          updateBooking(data.booking);
        });

        // Listen for vendor rejections
        socket.on('booking_rejected', (data) => {
          console.log('Booking rejected by vendor:', data);
          updateBooking(data.booking);
        });

        // Listen for payment confirmations
        socket.on('payment_confirmed', (data) => {
          console.log('Payment confirmed:', data);
          updateBooking(data.booking);
        });

        // Add some mock data for development
        const mockBookings: UserBooking[] = [
          {
            _id: '1',
            reservationType: 'restaurant',
            customerName: 'Emily Johnson',
            customerEmail: 'emily@example.com',
            date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            time: '7:30 PM',
            guests: 4,
            status: 'confirmed',
            totalPrice: 45000,
            meals: [
              { id: '1', name: 'Jollof Rice', price: 15000, quantity: 2, specialRequest: 'No spice' }
            ],
            vendorId: 'vendor1',
            businessName: 'Kapadoccia',
            location: 'Victoria Island, Lagos State',
            image: '/hero-bg.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            reservationType: 'hotel',
            customerName: 'Emily Johnson',
            customerEmail: 'emily@example.com',
            date: '2025-06-05',
            time: '12:00 PM',
            guests: 2,
            status: 'pending',
            totalPrice: 85000,
            rooms: [
              { id: '1', type: 'Deluxe Room', price: 85000, nights: 1 }
            ],
            vendorId: 'vendor2',
            businessName: 'Eko Hotel & Suites',
            location: 'Victoria Island, Lagos State',
            image: '/hero-bg.jpg',
            checkIn: '12:00 PM',
            checkOut: '12:00 PM',
            roomType: '2 Guests, 1 Room',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];

        setBookings(mockBookings);
        setLoading(false);

      } catch (error) {
        console.error('Error initializing socket:', error);
        setLoading(false);
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      const cleanup = async () => {
        const userId = await AuthService.getId();
        if (userId) {
          SocketService.leaveUserRoom(userId);
        }
        SocketService.removeListener('new_reservation');
        SocketService.removeListener('reservation_updated');
        SocketService.removeListener('reservation_cancelled');
        SocketService.removeListener('booking_confirmed');
        SocketService.removeListener('booking_rejected');
        SocketService.removeListener('payment_confirmed');
      };
      cleanup();
    };
  }, [addBooking, updateBooking, removeBooking]);

  const createBooking = useCallback(async (bookingData: Partial<UserBooking>) => {
    try {
      // Create booking via API
      // const response = await API.post('/users/bookings', bookingData);
      
      // For now, simulate creating a booking
      const newBooking: UserBooking = {
        _id: Date.now().toString(),
        reservationType: bookingData.reservationType || 'restaurant',
        customerName: bookingData.customerName || '',
        customerEmail: bookingData.customerEmail || '',
        date: bookingData.date || '',
        time: bookingData.time || '',
        guests: bookingData.guests || 1,
        status: 'pending',
        totalPrice: bookingData.totalPrice || 0,
        meals: bookingData.meals || [],
        rooms: bookingData.rooms || [],
        seatingPreference: bookingData.seatingPreference,
        specialOccasion: bookingData.specialOccasion,
        specialRequest: bookingData.specialRequest,
        vendorId: bookingData.vendorId || '',
        businessName: bookingData.businessName || '',
        location: bookingData.location || '',
        image: bookingData.image,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        roomType: bookingData.roomType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Emit to socket for real-time updates
      const socket = SocketService.getSocket();
      if (socket) {
        socket.emit('create_booking', { booking: newBooking });
      }

      addBooking(newBooking);
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }, [addBooking]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    try {
      // Cancel booking via API
      // await API.patch(`/users/bookings/${bookingId}`, { status: 'cancelled' });
      
      // Emit to socket for real-time updates
      const socket = SocketService.getSocket();
      if (socket) {
        socket.emit('cancel_booking', { bookingId });
      }

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }, []);

  const updateBookingStatus = useCallback(async (bookingId: string, status: string) => {
    try {
      // Update booking status via API
      // await API.patch(`/users/bookings/${bookingId}`, { status });
      
      console.log(`Updating booking ${bookingId} to status: ${status}`);
      
      setBookings(prev => 
        prev.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: status as UserBooking['status'] }
            : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }, []);

  return {
    bookings,
    loading,
    connected,
    addBooking,
    updateBooking,
    removeBooking,
    createBooking,
    cancelBooking,
    updateBookingStatus,
  };
};
