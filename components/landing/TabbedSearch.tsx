"use client";

import { useState } from "react";
import { HotelSearch } from "@/components/landing/HoteslSearch";
import { RestaurantSearch } from "@/components/landing/RestaurantSearch";
import { Hotel, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

export function TabbedSearch() {
  const [activeTab, setActiveTab] = useState("hotels");

  const tabs = [
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "restaurants", label: "Restaurants", icon: Utensils },
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border-2 border-dashed p-6 max-w-[300px] mx-auto flex gap-8 justify-center items-center mb-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={cn(
              "flex flex-col items-center text-gray-700 transition-all duration-300 relative",
              activeTab === id ? "text-blue-500 font-medium" : "opacity-80"
            )}
            onClick={() => setActiveTab(id)}
          >
            <Icon
              className={cn(
                "h-10 w-10 mb-1 transition-all duration-300",
                activeTab === id ? "text-blue-500" : "text-black"
              )}
              strokeWidth={1.5}
            />
            <span className="text-sm">{label}</span>
            {activeTab === id && (
              <div className="w-12 h-[3px] bg-blue-500 absolute -bottom-2 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "hotels" && (
          <div className="mt-0">
            <HotelSearch />
          </div>
        )}
        {activeTab === "restaurants" && (
          <div className="mt-0">
            <RestaurantSearch />
          </div>
        )}
      </div>
    </div>
  );
}
