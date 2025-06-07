import { Calendar, Clock } from "lucide-react";
import React from "react";

export default function RestauranAvalableSlot() {
  const reservationSlots = [
    "01:00 PM",
    "03:00 PM",
    "05:00 PM",
    "07:00 PM",
    "09:00 PM",
  ];
  return (
    <div className="flex flex-col font-[var(--font-inter)] gap-6">
      <div className="bg-[#E8FFE1] px-4 py-2 rounded-xl border w-fit border-[#72E94E] flex items-center gap-4">
        <div>
          <Clock className="text-[#068D33]" />
        </div>
        <div className="space-y-1">
          <p className="text-xs">Opening Hours</p>
          <p className="font-semibold text-sm">12:00 PM - 11:00 PM Daily</p>
        </div>
      </div>
      <div className="max-w-4xl w-full">
        <h2 className="text-gray-800 mb-6">
          Check out available reservation slots for today
        </h2>

        <div className="flex flex-wrap gap-4">
          {reservationSlots.map((slot) => (
            <button
              key={slot}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 bg-white border-[#0A6C6D] text-[#0A6C6D] hover:bg-slate-50 hover:border-[#0A6C6D]
              `}
            >
              <Calendar className="size-4" />
              <span className="font-medium">{slot}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
