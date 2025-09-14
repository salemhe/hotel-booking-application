export type ReservationStatus = "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled";

export interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  status: ReservationStatus;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  totalPrice: number;
  createdAt: string;
}