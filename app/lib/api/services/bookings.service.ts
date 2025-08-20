
// src/services/booking.services.js
// import API from "@/utils/axios";

import API from "../userAxios";
// Debug utilities inline since module path issue
const debugAPI = {
  logRequest: (method: string, url: string, params?: any) => {
    console.log(`🔍 API Request: ${method} ${url}`, params ? { params } : '');
  },
  
  logResponse: (method: string, url: string, status: number, data?: any) => {
    console.log(`✅ API Response: ${method} ${url} - Status: ${status}`, data ? { data } : '');
  },
  
  logError: (method: string, url: string, error: any) => {
    console.error(`❌ API Error: ${method} ${url}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
  }
};

export interface BookingResponse {
  _id: string;
  user: string;
  type: string;
  vendor: string;
  roomNumber: number | null;
  tableNumber: number | null;
  checkIn: Date;
  checkOut: Date;
  status: string;
  bookingDate: string;

  guests: number;
}

export interface BookingData {
    _id: string;
    user: string;
    type: string;
    vendor: string;
    menuId: string;
    roomNumber: number | null;
    tableNumber: number | null;
    guests: number | null;
    checkIn: Date | null;
    checkOut: Date | null;
    status: string;
    bookingDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: 0;
}

export class BookingService {
  /**
   * Get all bookings or filter by type, vendorId, or userId
   * @param {Object} params - Query parameters (optional)
   * @param {string} params.type - Filter by booking type (hotel, restaurant)
   * @param {string} params.vendorId - Filter by vendor ID
   * @param {string} params.userId - Filter by user ID
   * @returns {Promise} - Promise with bookings data
   */
  static async getBookings(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString
        ? `bookings?${queryString}`
        : "bookings";
      
      console.log("Fetching bookings from endpoint:", endpoint);
      const response = await API.get(endpoint);
      console.log("Bookings response:", response);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        console.error("Bookings endpoint not found:", error.response?.data);
        // Return empty array instead of throwing for 404
        return [];
      }
      
      if (error.response?.status === 403) {
        console.error("Access denied to bookings:", error.response?.data);
        throw new Error("You don't have permission to view bookings");
      }
      
      throw error;
    }
  }

  /**
   * Cancel a booking by ID
   * @param {string} bookingId - ID of the booking to cancel
   * @returns {Promise} - Promise with updated booking data
   */
  static async cancelBooking(bookingId: BookingResponse["_id"]) {
    try {
      const response = await API.patch<BookingResponse>(
        `users/bookings/cancel/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error canceling booking:", error);
      throw error;
    }
  }

  /**
   * Update a booking by ID
   * @param {string} bookingId - ID of the booking to update
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise} - Promise with updated booking data
   */
  static async updateBooking(
    bookingId: BookingResponse["_id"],
    bookingData: BookingData
  ) {
    try {
      const response = await API.patch(
        `users/bookings/update/${bookingId}`,
        bookingData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  }
}
