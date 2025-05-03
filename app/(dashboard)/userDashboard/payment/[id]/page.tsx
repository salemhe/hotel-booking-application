"use client";

import PaymentMethodSelection from "@/components/paymentMethodSelection";
// import { useParams } from "next/navigation";

export default function Page() {
  // const params = useParams();
  // const bookingId = params.bookingId as string;
  // console.log(bookingId)
  return (
    <div className="container mx-auto py-8 px-4">
      <PaymentMethodSelection  />
    </div>
  );
}

