"use client";

import { useEffect, useState, useCallback } from 'react';
import SocketService from '@/app/lib/socket';
import { AuthService } from '@/app/lib/api/services/auth.service';

export interface Reservation {
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
  createdAt: string;
  updatedAt: string;
}

export const useRealtimeReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const addReservation = useCallback((newReservation: Reservation) => {
    setReservations(prev => [newReservation, ...prev]);
  }, []);

  const updateReservation = useCallback((updatedReservation: Reservation) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation._id === updatedReservation._id ? updatedReservation : reservation
      )
    );
  }, []);

  const removeReservation = useCallback((reservationId: string) => {
    setReservations(prev => 
      prev.filter(reservation => reservation._id !== reservationId)
    );
  }, []);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const user = AuthService.getUser();
        if (!user || !user.profile) {
          setLoading(false);
          return;
        }

        // Connect to socket
        const socket = SocketService.connect(user.profile.id, 'vendor');
        
        // Join vendor room for real-time updates
        SocketService.joinVendorRoom(user.profile.id);
        
        setConnected(true);

        // Set up event listeners
        SocketService.onNewReservation((data) => {
          console.log('New reservation received:', data);
          addReservation(data.reservation);
        });

        SocketService.onReservationUpdate((data) => {
          console.log('Reservation updated:', data);
          updateReservation(data.reservation);
        });

        SocketService.onReservationCancelled((data) => {
          console.log('Reservation cancelled:', data);
          if (data.action === 'remove') {
            removeReservation(data.reservationId);
          } else {
            updateReservation(data.reservation);
          }
        });

        // Fetch initial reservations - add some mock data for development
        const mockReservations: Reservation[] = [
          {
            _id: '1',
            reservationType: 'restaurant',
            customerName: 'Emily Johnson',
            customerEmail: 'emily@example.com',
            date: new Date().toISOString(),
            time: '7:30 PM',
            guests: 4,
            status: 'pending',
            totalPrice: 45000,
            meals: [
              { id: '1', name: 'Jollof Rice', price: 15000, quantity: 2, specialRequest: 'No spice' },
              { id: '2', name: 'Chicken Wings', price: 8000, quantity: 3 }
            ],
            vendorId: user.profile.id,
            businessName: 'Kapadoccia Restaurant',
            location: 'Victoria Island, Lagos',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            reservationType: 'hotel',
            customerName: 'John Smith',
            customerEmail: 'john@example.com',
            date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            time: '2:00 PM',
            guests: 2,
            status: 'confirmed',
            totalPrice: 85000,
            rooms: [
              { id: '1', type: 'Deluxe Room', price: 85000, nights: 1 }
            ],
            vendorId: user.profile.id,
            businessName: 'Eko Hotel & Suites',
            location: 'Victoria Island, Lagos',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];

        setReservations(mockReservations);
        setLoading(false);

      } catch (error) {
        console.error('Error initializing socket:', error);
        setLoading(false);
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      const user = AuthService.getUser();
      if (user?.profile) {
        SocketService.leaveVendorRoom(user.profile.id);
      }
      SocketService.removeListener('new_reservation');
      SocketService.removeListener('reservation_updated');
      SocketService.removeListener('reservation_cancelled');
    };
  }, [addReservation, updateReservation, removeReservation]);

  const updateReservationStatus = useCallback(async (reservationId: string, status: string) => {
    // You would call your API here to update the reservation status
    // The socket will handle the real-time update to other clients
    try {
      // Example API call (implement according to your backend)
      // await API.patch(`/reservations/${reservationId}`, { status });
      console.log(`Updating reservation ${reservationId} to status: ${status}`);
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  }, []);

  return {
    reservations,
    loading,
    connected,
    addReservation,
    updateReservation,
    removeReservation,
    updateReservationStatus,
  };
};
