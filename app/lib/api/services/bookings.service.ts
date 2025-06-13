import API from "../axios";


export interface BookingResponse {
  id: { _id: string; user: string; type: string; vendor: string; menuId: string; roomNumber: number | null; tableNumber: number | null; guests: number | null; checkIn: Date; checkOut: Date; status: string; bookingDate: Date; createdAt: Date; updatedAt: Date; __v: 0; };
   _id: string,
      user: string,
      type: string,
      vendor: string,
      roomNumber: number |  null,
      tableNumber: number | null,
      checkIn: Date | undefined,
      checkOut: Date | undefined,
      status: string,
      bookingDate: string
      
  guests:number;
}

export interface BookingData {
   "booking":{
      "_id":string,
      "user":string,
      "type":string,
      "vendor":string,
      "menuId":string,
      "roomNumber":number | null,
      "tableNumber":number | null,
      "guests":number | null,
      "checkIn":Date,
      "checkOut":Date,
      "status":string,
      "bookingDate":Date,
      "createdAt":Date,
      "updatedAt":Date,
      "__v":0
    }
  
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
      const endpoint = queryString ? `users/bookings?${queryString}` : 'users/bookings';
      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  /**
   * Cancel a booking by ID
   * @param {string} bookingId - ID of the booking to cancel
   * @returns {Promise} - Promise with updated booking data
   */
static async cancelBooking(bookingId: BookingResponse['_id']) {
   try {
      const response = await API.patch<BookingResponse>(`users/bookings/cancel/${bookingId}`);
      return response.data;
   } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
   }
}

  /**
   * Update a booking by ID
   * @param {string} bookingId - ID of the booking to update
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise} - Promise with updated booking data
   */
  static async updateBooking(bookingId: BookingResponse['_id'], bookingData: BookingData) {
    try {
      const response = await API.patch(`users/bookings/update/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }
}