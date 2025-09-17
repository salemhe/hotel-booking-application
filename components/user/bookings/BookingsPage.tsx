"use client";
import React, { Suspense } from "react";
import Loading from "../../loading";
import { useBookings } from "@/contexts/BookingsContext";
import BookingsTab from "./BookingsTab";
const tabs: { name: string; tab: "bookings" | "reservations" }[] = [
  { name: "Bookings", tab: "bookings" },
  { name: "Reservations", tab: "reservations" },
];

const BookingsPage = () => {
   const { setActiveTab, activeTab } = useBookings();

  return (
    <div className="max-w-7xl px-4 sm:px-8 flex flex-col gap-8 mb-8 mx-auto w-full mt-6 sm:mt-28">
      <div className="flex justify-center w-full">
        <div className="flex bg-white border border-[#E5E7EB] p-2 rounded-full">
          {tabs.map((tab, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(tab.tab)}
              className={`${
                activeTab === tab.tab
                  ? "text-[#111827] bg-[#D1E1F5] border-[#60A5FA]"
                  : "text-[#606368] border-transparent"
              } rounded-full p-4 text-sm border cursor-pointer font-medium`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <BookingsTab type={activeTab} />
      </Suspense>
    </div>
  );
};

export default BookingsPage;
