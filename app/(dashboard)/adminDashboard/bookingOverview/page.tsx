"use client";

import { RealtimeReservationsWidget } from "@/app/components/dashboard/RealtimeReservationsWidget";

export default function Page() {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <h1 className="text-2xl font-semibold mb-4">Reservations</h1>
      <RealtimeReservationsWidget />
    </div>
  );
}
