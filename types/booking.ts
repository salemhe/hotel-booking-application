export interface Customer {
  id: string;
  name: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  customer: Customer;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  numberOfGuests: number;
  paymentStatus: 'Fully Paid' | 'Partly paid' | 'Pending';
}

export type BookingStatus = 'All' | 'Upcoming' | 'Completed' | 'Canceled' | 'No shows';
export type PaymentStatus = 'All' | 'Fully Paid' | 'Partly paid' | 'Pending';