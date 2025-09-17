"use client";

import { RealtimeReservations } from "@/components/reservations/RealtimeReservations";

export default function VendorReservationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <RealtimeReservations />
      </div>
    </div>
  );
}
