"use client";
import React, { useState } from "react";

const RestaurantInfo = () => {
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
      <div className="border-gray-100 border-b  overflow-auto w-full">
        <div className="w-max flex-nowrap flex">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(tab.tab)}
              className={`p-2 w-max cursor-pointer font-semibold text-[#606368] ${
                activeTab === tab.tab &&
                "border-b-2 border-green-800 text-green-800"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8">
        {activeTab === "overview" && <p>Overview</p>}
        {activeTab === "menu" && <p>Menu</p>}
        {activeTab === "available" && <p>Available</p>}
        {activeTab === "reviews" && <p>Reviews</p>}
      </div>
    </div>
  );
};

export default RestaurantInfo;
