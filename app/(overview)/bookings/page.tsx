import BookingsPage from "@/app/components/bookings/BookingsPage";
import { BookingsProvider } from "@/app/contexts/BookingsContext";
import React from "react";

const page = async () => {
  return (
    <BookingsProvider>
      <BookingsPage />
    </BookingsProvider>
  );
};

export default page;
