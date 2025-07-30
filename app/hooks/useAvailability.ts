"use client";

import { useState, useEffect, useCallback } from 'react';
import API from '@/app/lib/api/axios';
import SocketService from '@/app/lib/socket';
import { toast } from 'sonner';

export interface TimeSlot {
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
  remaining: number;
}

export interface AvailabilityData {
  date: string;
  restaurantId: string;
  timeSlots: TimeSlot[];
  maxCapacity: number;
  minAdvanceBooking: number; // hours
  maxAdvanceBooking: number; // days
}

export const useAvailability = (restaurantId: string) => {
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate time slots for a day
  const generateTimeSlots = useCallback((startHour = 11, endHour = 22, interval = 30): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        if (hour === endHour && minute > 0) break;
        
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        // Simulate availability (in real app, this would come from API)
        const capacity = 20;
        const booked = Math.floor(Math.random() * capacity);
        const remaining = capacity - booked;
        
        slots.push({
          time: displayTime,
          available: remaining > 0,
          capacity,
          booked,
          remaining
        });
      }
    }
    
    return slots;
  }, []);

  // Check availability for a specific date
  const checkAvailability = useCallback(async (date: string) => {
    if (!restaurantId || !date) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First try to get real availability data from API
      const response = await API.get(`/restaurants/${restaurantId}/availability?date=${date}`);
      
      if (response.data) {
        setAvailability(response.data);
      } else {
        // Fallback to generated slots if API doesn't return data
        const fallbackData: AvailabilityData = {
          date,
          restaurantId,
          timeSlots: generateTimeSlots(),
          maxCapacity: 20,
          minAdvanceBooking: 2,
          maxAdvanceBooking: 30
        };
        setAvailability(fallbackData);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
      
      // Generate fallback availability data
      const fallbackData: AvailabilityData = {
        date,
        restaurantId,
        timeSlots: generateTimeSlots(),
        maxCapacity: 20,
        minAdvanceBooking: 2,
        maxAdvanceBooking: 30
      };
      setAvailability(fallbackData);
      
      setError('Unable to fetch real-time availability. Showing estimated availability.');
    } finally {
      setLoading(false);
    }
  }, [restaurantId, generateTimeSlots]);

  // Real-time availability updates
  useEffect(() => {
    if (!restaurantId) return;

    // Connect to socket for real-time updates
    const socket = SocketService.connect();
    
    // Join restaurant room for availability updates
    socket.emit('join_restaurant_room', { restaurantId });
    
    // Listen for availability updates
    const handleAvailabilityUpdate = (data: any) => {
      if (data.restaurantId === restaurantId) {
        setAvailability(prev => {
          if (!prev || prev.date !== data.date) return prev;
          
          return {
            ...prev,
            timeSlots: prev.timeSlots.map(slot => {
              const update = data.timeSlots?.find((ts: any) => ts.time === slot.time);
              return update ? { ...slot, ...update } : slot;
            })
          };
        });
        
        toast.info('Availability updated in real-time');
      }
    };
    
    socket.on('availability_updated', handleAvailabilityUpdate);
    
    return () => {
      socket.off('availability_updated', handleAvailabilityUpdate);
      socket.emit('leave_restaurant_room', { restaurantId });
    };
  }, [restaurantId]);

  // Book a time slot (optimistic update)
  const bookTimeSlot = useCallback(async (time: string, guests: number) => {
    if (!availability) return false;
    
    try {
      // Optimistic update
      setAvailability(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          timeSlots: prev.timeSlots.map(slot => {
            if (slot.time === time) {
              const newBooked = slot.booked + guests;
              return {
                ...slot,
                booked: newBooked,
                remaining: slot.capacity - newBooked,
                available: (slot.capacity - newBooked) > 0
              };
            }
            return slot;
          })
        };
      });
      
      // Make API call to book
      await API.post(`/restaurants/${restaurantId}/book-slot`, {
        date: availability.date,
        time,
        guests
      });
      
      // Emit socket event for real-time updates
      const socket = SocketService.getSocket();
      if (socket) {
        socket.emit('slot_booked', {
          restaurantId,
          date: availability.date,
          time,
          guests
        });
      }
      
      return true;
    } catch (err) {
      console.error('Error booking slot:', err);
      
      // Revert optimistic update on error
      checkAvailability(availability.date);
      
      setError('Failed to book time slot. Please try again.');
      return false;
    }
  }, [availability, restaurantId, checkAvailability]);

  // Validate booking time
  const validateBookingTime = useCallback((date: string, time: string): {
    valid: boolean;
    reason?: string;
  } => {
    if (!availability) return { valid: false, reason: 'Availability data not loaded' };
    
    const now = new Date();
    const bookingDateTime = new Date(`${date}T${time}`);
    const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Check minimum advance booking
    if (hoursDiff < availability.minAdvanceBooking) {
      return {
        valid: false,
        reason: `Reservations must be made at least ${availability.minAdvanceBooking} hours in advance`
      };
    }
    
    // Check maximum advance booking
    const daysDiff = hoursDiff / 24;
    if (daysDiff > availability.maxAdvanceBooking) {
      return {
        valid: false,
        reason: `Reservations can only be made up to ${availability.maxAdvanceBooking} days in advance`
      };
    }
    
    // Check if time slot is available
    const slot = availability.timeSlots.find(s => s.time === time);
    if (!slot || !slot.available) {
      return {
        valid: false,
        reason: 'This time slot is not available'
      };
    }
    
    return { valid: true };
  }, [availability]);

  return {
    availability,
    loading,
    error,
    checkAvailability,
    bookTimeSlot,
    validateBookingTime,
    clearError: () => setError(null)
  };
};
