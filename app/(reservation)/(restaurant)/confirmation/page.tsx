"use client";

import { Check, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import API from "../../../../lib/api";
import { BookingDetails } from "../../../../types/user/restaurant";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationPage />
    </Suspense>
  );
};

function ConfirmationPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [booking, setBooking] = useState<BookingDetails>();
  const [isLoading, setIsLoading] = useState(false);
  const [paidAt, setPaidAt] = useState<Date>();
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) return;

      try {
        setIsLoading(true);
        const res = await API.post("/users/verify-payment", { reference });

        const data = await res.data;
        setBooking(data.booking);
        setStatus("success");
        setPaidAt(new Date(data.paid_at));
      } catch (err) {
        console.error(err);
        setStatus("failed");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [reference]);

  const handleDoneClick = () => {
    router.push(`/bookings/${booking?._id}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-[#0A6C6D] mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-gray-700 text-lg font-medium">
            Verifying your payment...
          </span>
        </div>
      </div>
    );
  }

  if (status !== "success") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Payment Verification Failed
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            We couldn&apos;t verify your payment or reservation.
            <br />
            Please check your payment status or try again later.
          </p>
          <Button
            className="bg-[#0A6C6D] hover:bg-teal-800 text-white px-6 py-2 rounded-xl"
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#37703F1A] rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-[#37703F] rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-[22px] font-bold text-[#111827] mb-2">
            Your reservation is confirmed & your meal has been paid
          </h1>
          <p className="text-gray-600">
            Your pre-selected meals have been confirmed for your upcoming
            reservation
          </p>
        </div>

        {/* Reservation Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Reservation Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                <p className="text-base font-medium text-gray-900 mb-1">
                  {booking?.businessName}
                </p>
                <p className="text-sm text-gray-600">{booking?.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Reservation ID</p>
                <p className="font-medium text-gray-900">
                  #{booking?._id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {new Date(booking?.date || "").toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  •{" "}
                  {new Date(`1970-01-01T${booking?.time}`).toLocaleTimeString(
                    undefined,
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Guests</p>
                <p className="font-medium text-gray-900">
                  {booking?.guests} {booking?.guests === 1 ? "Guest" : "Guests"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Space between Reservation Details and Your Selection */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Selection ({booking?.meals.length}{" "}
              {booking?.meals.length === 1 ? "item" : "items"})
            </h2>

            <div className="space-y-3 mb-6">
              {booking?.meals.map((meal, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">
                    {meal.quantity}x {meal.name}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₦{meal.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Space/padding/margin before Amount paid */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Amount paid
                </span>
                <span className="text-lg font-semibold text-[#37703F]">
                  ₦{booking?.totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#37703F] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-[#37703F]">Paid</span>
                <span className="text-gray-600 text-sm">
                  {paidAt &&
                    paidAt.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  ,{" "}
                  {paidAt &&
                    paidAt.toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards - Changed to green background */}
        <div className="bg-[#E9EBF3] border border-[#B9C2DB] rounded-lg p-4 mb-8">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
              <p className=" text-sm">
                You will receive a confirmation email with your reservation and
                meal details
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
              <p className=" text-sm">Please, arrive 10 mins early</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-10 text-sm font-medium rounded-xl px-6 border-gray-300"
          >
            Get Direction
          </Button>
          <Button
            className="flex-1 h-10 text-sm font-medium px-6 rounded-xl bg-[#0A6C6D] hover:bg-teal-800"
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default page