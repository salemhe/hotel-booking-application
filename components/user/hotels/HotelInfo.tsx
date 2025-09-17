"use client";
import React from "react";
import { Restaurant } from "../../../types/user/restaurant";
import HotelAvalableSlot from "./HotelAvailableSlot";
import HotelOverview from "./HotelOverview";

const HotelInfo = ({
  data,
  activeTab,
  setActiveTab,
  id,
}: {
  id: string;
  data: Restaurant;
  activeTab: "property_details" | "rooms" | "policies" | "reviews" | "messages";
  setActiveTab: (tab: "property_details" | "rooms" | "policies" | "reviews" | "messages") => void;
}) => {
  const tabs: {
    name: string;
    tab: "property_details" | "rooms" | "policies" | "reviews" | "messages";
  }[] = [
    {
      name: "Property Details",
      tab: "property_details",
    },
    {
      name: "Rooms",
      tab: "rooms",
    },
    {
      name: "Policies",
      tab: "policies",
    },
    {
      name: "Reviews",
      tab: "reviews",
    },
    {
      name: "Messages",
      tab: "messages"
    }
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
        {activeTab === "property_details" && <HotelOverview address={data.address} openingTime={data.openingTime} closingTime={data.closingTime} cuisines={data.cuisines} desc={data.businessDescription} />}
        {/* {activeTab === "menu" && <HotelMenu id={data._id} />} */}
        {activeTab === "rooms" && <HotelAvalableSlot id={id} />}
        {activeTab === "reviews" && <p>Reviews</p>}
      </div>
    </div>
  );
};

export default HotelInfo;
