import { useBookings } from "@/contexts/BookingsContext";
import React from "react";

const tabs: { name: string; tab: "bookings" | "reservations" }[] = [
  { name: "Bookings", tab: "bookings" },
  { name: "Reservations", tab: "reservations" },
];

const TabButton = () => {
    const { setActiveTab, activeTab } = useBookings();
  return (
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
  );
};

export default TabButton;
