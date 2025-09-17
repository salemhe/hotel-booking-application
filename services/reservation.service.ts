import API from "../lib/api";
import SocketService from "../lib/socket";

export interface ReservationMeal {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialRequest?: string;
  category: string;
}

export interface CreateReservationData {
  reservationType: "restaurant" | "hotel";
  customerEmail: string;
  customerName: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference?: string;
  specialOccasion?: string;
  specialRequest?: string;
  additionalNote?: string;
  meals?: ReservationMeal[];
  rooms?: Array<{
    id: string;
    type: string;
    price: number;
    nights: number;
  }>;
  totalPrice: number;
  vendorId: string;
  businessName: string;
  location: string;
  image?: string;
}

export interface ReservationResponse {
  _id: string;
  reservationType: "restaurant" | "hotel";
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  paymentStatus?: string;
  meals?: ReservationMeal[];
  rooms?: Array<{
    id: string;
    type: string;
    price: number;
    nights: number;
  }>;
  seatingPreference?: string;
  specialOccasion?: string;
  specialRequest?: string;
  additionalNote?: string;
  vendorId: string;
  businessName: string;
  location: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReservationData {
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  date?: string;
  time?: string;
  guests?: number;
  meals?: ReservationMeal[];
  specialRequest?: string;
  additionalNote?: string;
}

export class ReservationService {
  /**
   * Create a new reservation
   * @param reservationData - Reservation data to create
   * @returns Promise with created reservation response
   */
  static async createReservation(reservationData: CreateReservationData): Promise<ReservationResponse> {
    try {
      console.log("Creating reservation with data:", reservationData);
      
      const response = await API.post("/users/reservations", reservationData);
      
      const createdReservation = response.data.reservation || response.data;

      // Emit real-time event to vendor
      if (reservationData.vendorId) {
        SocketService.safeEmit("new_reservation", {
          vendorId: reservationData.vendorId,
          reservation: createdReservation,
          action: "create",
          customerName: reservationData.customerName,
          businessName: reservationData.businessName
        });

        console.log("✅ Emitted new_reservation event to vendor:", reservationData.vendorId);
      }

      // Also emit to user for confirmation
      if (createdReservation.customerEmail) {
        SocketService.safeEmit("reservation_created", {
          reservation: createdReservation,
          customerEmail: reservationData.customerEmail
        });
      }
      
      return response.data.reservation || response.data;
    } catch (error: unknown) {
      console.error("Error creating reservation:", error);
      
      // If the endpoint doesn't exist, fallback to existing booking endpoint
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        console.log("Fallback to existing booking endpoint");
        return await this.createBookingFallback(reservationData);
      }
      
      throw error;
    }
  }

  /**
   * Fallback method using existing booking endpoint
   * @param reservationData - Reservation data
   * @returns Promise with booking response formatted as reservation
   */
  private static async createBookingFallback(reservationData: CreateReservationData): Promise<ReservationResponse> {
    try {
      const bookingData = {
        reservationType: reservationData.reservationType,
        customerEmail: reservationData.customerEmail,
        customerName: reservationData.customerName,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests,
        seatingPreference: reservationData.seatingPreference,
        specialOccasion: reservationData.specialOccasion,
        specialRequest: reservationData.specialRequest,
        additionalNote: reservationData.additionalNote,
        meals: reservationData.meals,
        totalPrice: reservationData.totalPrice,
        vendorId: reservationData.vendorId,
        businessName: reservationData.businessName,
        location: reservationData.location,
        image: reservationData.image,
      };

      const response = await API.post("/users/bookings", bookingData);
      
      // Transform booking response to reservation format
      const bookingResult = response.data.booking || response.data;
      
      const reservationResult: ReservationResponse = {
        _id: bookingResult._id,
        reservationType: reservationData.reservationType,
        customerName: reservationData.customerName,
        customerEmail: reservationData.customerEmail,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests,
        status: "pending",
        totalPrice: reservationData.totalPrice,
        meals: reservationData.meals,
        seatingPreference: reservationData.seatingPreference,
        specialOccasion: reservationData.specialOccasion,
        specialRequest: reservationData.specialRequest,
        additionalNote: reservationData.additionalNote,
        vendorId: reservationData.vendorId,
        businessName: reservationData.businessName,
        location: reservationData.location,
        image: reservationData.image,
        createdAt: bookingResult.createdAt || new Date().toISOString(),
        updatedAt: bookingResult.updatedAt || new Date().toISOString(),
      };

      // Emit real-time event to vendor
      if (reservationData.vendorId) {
        SocketService.safeEmit("new_reservation", {
          vendorId: reservationData.vendorId,
          reservation: reservationResult,
          action: "create",
          customerName: reservationData.customerName,
          businessName: reservationData.businessName
        });

        console.log("✅ Emitted new_reservation event (fallback) to vendor:", reservationData.vendorId);
      }

      // Also emit to user for confirmation
      if (reservationData.customerEmail) {
        SocketService.safeEmit("reservation_created", {
          reservation: reservationResult,
          customerEmail: reservationData.customerEmail
        });
      }

      return reservationResult;
    } catch (error) {
      console.error("Error creating booking fallback:", error);
      throw error;
    }
  }

  /**
   * Get reservations for a user
   * @param userId - User ID
   * @returns Promise with user reservations
   */
  static async getUserReservations(userId: string): Promise<ReservationResponse[]> {
    try {
      const response = await API.get(`/users/reservations?userId=${userId}`);
      return response.data.reservations || response.data || [];
    } catch (error: unknown) {
      console.error("Error fetching user reservations:", error);
      
      // Fallback to booking service
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        try {
          const response = await API.get(`/users/bookings?userId=${userId}&type=restaurant`);
          return response.data.bookings || response.data || [];
        } catch (fallbackError) {
          console.error("Fallback booking fetch failed:", fallbackError);
          return [];
        }
      }
      
      return [];
    }
  }

  /**
   * Get reservations for a vendor
   * @param vendorId - Vendor ID
   * @returns Promise with vendor reservations
   */
  static async getVendorReservations(vendorId: string): Promise<ReservationResponse[]> {
    try {
      const response = await API.get(`/vendors/reservations?vendorId=${vendorId}`);
      return response.data.reservations || response.data || [];
    } catch (error: unknown) {
      console.error("Error fetching vendor reservations:", error);
      
      // Fallback to booking service
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        try {
          const response = await API.get(`/users/bookings?vendorId=${vendorId}&type=restaurant`);
          return response.data.bookings || response.data || [];
        } catch (fallbackError) {
          console.error("Fallback vendor booking fetch failed:", fallbackError);
          return [];
        }
      }
      
      return [];
    }
  }

  /**
   * Update a reservation
   * @param reservationId - Reservation ID
   * @param updateData - Data to update
   * @returns Promise with updated reservation
   */
  static async updateReservation(reservationId: string, updateData: UpdateReservationData): Promise<ReservationResponse> {
    try {
      const response = await API.patch(`/users/reservations/${reservationId}`, updateData);
      
      const updatedReservation = response.data.reservation || response.data;
      
      // Emit real-time event
      if (updatedReservation.vendorId) {
        SocketService.safeEmit("reservation_updated", {
          vendorId: updatedReservation.vendorId,
          reservation: updatedReservation,
          action: "update"
        });
      }
      
      return updatedReservation;
    } catch (error: unknown) {
      console.error("Error updating reservation:", error);
      
      // Fallback to booking service
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        try {
          const response = await API.patch(`/users/bookings/update/${reservationId}`, updateData);
          return response.data.booking || response.data;
        } catch (fallbackError) {
          console.error("Fallback booking update failed:", fallbackError);
          throw fallbackError;
        }
      }
      
      throw error;
    }
  }

  /**
   * Cancel a reservation
   * @param reservationId - Reservation ID
   * @returns Promise with cancelled reservation
   */
  static async cancelReservation(reservationId: string): Promise<ReservationResponse> {
    try {
      const response = await API.patch(`/users/reservations/${reservationId}/cancel`);
      
      const cancelledReservation = response.data.reservation || response.data;
      
      // Emit real-time event
      if (cancelledReservation.vendorId) {
        SocketService.safeEmit("reservation_cancelled", {
          vendorId: cancelledReservation.vendorId,
          reservation: cancelledReservation,
          reservationId,
          action: "cancel"
        });
      }
      
      return cancelledReservation;
    } catch (error: unknown) {
      console.error("Error cancelling reservation:", error);
      
      // Fallback to booking service
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        try {
          const response = await API.patch(`/users/bookings/cancel/${reservationId}`);
          const result = response.data.booking || response.data;
          
          // Emit real-time event for fallback
          if (result.vendor) {
            SocketService.safeEmit("reservation_cancelled", {
              vendorId: result.vendor,
              reservation: result,
              reservationId,
              action: "cancel"
            });
          }
          
          return result;
        } catch (fallbackError) {
          console.error("Fallback booking cancel failed:", fallbackError);
          throw fallbackError;
        }
      }
      
      throw error;
    }
  }

  /**
   * Get reservation by ID
   * @param reservationId - Reservation ID
   * @returns Promise with reservation details
   */
  static async getReservationById(reservationId: string): Promise<ReservationResponse> {
    try {
      const response = await API.get(`/users/reservations/${reservationId}`);
      return response.data.reservation || response.data;
    } catch (error: unknown) {
      console.error("Error fetching reservation:", error);
      
      // Fallback to booking service
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        try {
          const response = await API.get(`/users/bookings?bookingId=${reservationId}`);
          const bookings = response.data.bookings || response.data || [];
          if (bookings.length > 0) {
            return bookings[0];
          }
          throw new Error("Reservation not found");
        } catch (fallbackError) {
          console.error("Fallback booking fetch failed:", fallbackError);
          throw fallbackError;
        }
      }
      
      throw error;
    }
  }

  /**
   * Check availability for a specific date and time
   * @param vendorId - Vendor ID
   * @param date - Date string
   * @param time - Time string
   * @param guests - Number of guests
   * @returns Promise with availability status
   */
  static async checkAvailability(vendorId: string, date: string, time: string, guests: number): Promise<{ available: boolean; message?: string }> {
    try {
      const response = await API.get(`/vendors/availability?vendorId=${vendorId}&date=${date}&time=${time}&guests=${guests}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error checking availability:", error);
      
      // Default to available if endpoint doesn't exist
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return { available: true, message: "Availability check not implemented" };
      }
      
      return { available: false, message: "Unable to check availability" };
    }
  }
}
