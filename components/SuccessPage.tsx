"use client";
import React from "react";
import { useRouter } from "next/navigation";

const SuccessPage = ({ id }: { id: string }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-green-100 mb-6">
        <svg
          className="w-20 h-20 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={2.5}
            fill="none"
          />
          <path
            d="M16 24l7 7 9-13"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Booking Successful!
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Your booking has been confirmed. Thank you for choosing us!
      </p>
      <div className="flex gap-4">
        <button
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => router.push("/userDashboard/search")}
        >
          Search More Restaurants
        </button>
        <button
          className="px-6 py-2 bg-white border border-green-600 text-green-700 rounded hover:bg-green-50 transition"
          onClick={() => router.push(`userDashboard/booking/${id}`)}
        >
          View Booking Details
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
