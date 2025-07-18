"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReservationsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to bookings page with reservations tab active
    router.replace("/bookings?tab=reservations");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>
  );
}
