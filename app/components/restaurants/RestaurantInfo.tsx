"use client";
import React, { useState } from "react";
import RestaurantOverview from "./RestaurantOverview";
import { Restaurant } from "../../lib/types/restaurant";
import RestaurantMenu from "./RestaurantMenu";
import RestauranAvalableSlot from "./RestaurantAvailableSlot";

const RestaurantInfo = ({ data }: { data: Restaurant}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "menu" | "available" | "reviews"
  >("overview");

  const tabs: {
    name: string;
    tab: "overview" | "menu" | "available" | "reviews";
  }[] = [
    {
      name: "Overview",
      tab: "overview",
    },
    {
      name: "Menu",
      tab: "menu",
    },
    {
      name: "Availale Reservation Slots",
      tab: "available",
    },
    {
      name: "Reviews",
      tab: "reviews",
    },
  ];
  return (
    <div>
      <div className="border-[#E5E7EB] border-b  overflow-auto w-full">
        <div className="w-max flex-nowrap flex">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(tab.tab)}
              className={`p-3 w-max cursor-pointer font-semibold ${
                activeTab === tab.tab ?
                "border-b-2 text-[#0A6C6D] border-[#0A6C6D]" : "text-[#606368]"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8">
        {activeTab === "overview" && <RestaurantOverview address={data.address} openingTime={data.openingTime} closingTime={data.closingTime} cuisines={data.cuisines} desc={data.businessDescription} />}
        {activeTab === "menu" && <RestaurantMenu id={data._id} />}
        {activeTab === "available" && <RestauranAvalableSlot openingTime={data.openingTime} closingTime={data.closingTime} availableSlots={data.availableSlots} />}
        {activeTab === "reviews" && <p>Reviews</p>}
      </div>
    </div>
  );
};

export default RestaurantInfo;
