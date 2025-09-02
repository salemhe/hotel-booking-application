"use client";

import { useEffect, useState, useCallback } from 'react';
import SocketService from '@/app/lib/socket';
import { AuthService } from '@/app/lib/api/services/auth.service';
import { ReservationService, ReservationResponse } from '@/app/lib/api/services/reservation.service';
import { toast } from 'sonner';

// Re-export the Reservation interface from the service for consistency
export type Reservation = ReservationResponse;

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

        // Set up connection status monitoring
        const checkConnection = () => {
          const isConnected = SocketService.isConnected();
          setConnected(isConnected);

          if (isConnected) {
            // Join vendor room for real-time updates
            SocketService.joinVendorRoom(user.profile.id);
          }
        };

        // Check connection immediately
        checkConnection();

        // Monitor connection status
        socket.on('connect', checkConnection);
        socket.on('disconnect', () => setConnected(false));

        // Set up event listeners
        SocketService.onNewReservation((data) => {
          console.log('New reservation received:', data);
          addReservation(data.reservation as Reservation);
        });

        SocketService.onReservationUpdate((data) => {
          console.log('Reservation updated:', data);
          updateReservation(data.reservation as Reservation);
        });

        SocketService.onReservationCancelled((data) => {
          console.log('Reservation cancelled:', data);
          if (data.action === 'remove') {
            removeReservation(data.reservationId as Reservation['_id']);
          } else {
            updateReservation(data.reservation as Reservation);
          }
        });

        // Fetch initial reservations using ReservationService
        try {
          const reservations = await ReservationService.getVendorReservations(user.profile.id);
          setReservations(reservations);

          if (reservations.length === 0) {
            console.log("No reservations found for vendor:", user.profile.id);
          } else {
            console.log(`Loaded ${reservations.length} reservations for vendor`);
          }
        } catch (error) {
          console.error('Error fetching reservations:', error);

          // Show user-friendly message about connection issues
          if (process.env.NODE_ENV === 'development') {
            // Create sample reservations for development if API fails
            const sampleReservations: Reservation[] = [
              {
                _id: 'sample-1',
                reservationType: 'restaurant',
                customerName: 'Sample Customer',
                customerEmail: 'sample@example.com',
                date: new Date().toISOString(),
                time: '7:30 PM',
                guests: 4,
                status: 'pending',
                totalPrice: 45000,
                meals: [
                  { id: '1', name: 'Sample Dish', price: 15000, quantity: 2, category: 'Main Course' }
                ],
                vendorId: user.profile.id,
                businessName: user.profile.businessName || 'Your Restaurant',
                location: user.profile.address || 'Lagos, Nigeria',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ];

            setReservations(sampleReservations);
            toast.info("Using demo data - Backend server not available");
          } else {
            // Production environment - show empty state
            setReservations([]);
            toast.error("Unable to load reservations. Please check your connection.");
          }
        }

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
    try {
      // Update reservation status using ReservationService
      const updatedReservation = await ReservationService.updateReservation(reservationId, {
        status: status as Reservation['status']
      });

      // Update local state with the response
      setReservations(prev =>
        prev.map(reservation =>
          reservation._id === reservationId ? updatedReservation : reservation
        )
      );

      toast.success(`Reservation ${status} successfully`);

    } catch (error: unknown) {
      console.error('Error updating reservation status:', error);

      // Show specific error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to update reservation status';
      toast.error(errorMessage);

      // Revert optimistic update if any
      setReservations(prev =>
        prev.map(reservation =>
          reservation._id === reservationId ? reservation : reservation
        )
      );
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
