"use client";
import React, { useState } from "react";

import { Restaurant } from "../../lib/types/restaurant";
import HotelImages from "./HotelImages";
import HotelSaveCopy from "./HotelSaveCopy";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import HotelInfo from "./HotelInfo";
import MapComponent from "../MapComponent";
import Link from "next/link"; // Changed from react-router-dom to next/link
import HotelBookingForm from "../HotelBookingForm";
// import BookingProgress from "./BookingProgress";

export const HotelsPageClient = ({
  id,
  restaurant,
}: {
  id: string;
  restaurant: Restaurant;
}) => {
  const [activeTab, setActiveTab] = useState<
    "property_details" | "rooms" | "policies" | "reviews" | "messages"
  >("property_details");

  return (
    <main className="mx-auto mt-[85px] py-8 px-4 max-w-7xl sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="w-full space-y-8">
          <div className="col-span-2">
            <div className="w-full space-y-6">
             <div className="flex gap-2">
                <HotelImages
                images={restaurant?.profileImages ?? []}
                name={restaurant.businessName}
              />
              {activeTab === "rooms" && (
             
              <HotelBookingForm id={id} restaurant={restaurant} />
              
               )}
             </div>
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-cente w-full gap-4">
                  <div className="flex gap-2 items-center">
                    <h1 className="text-2xl text-[#111827] font-semibold">
                      {restaurant.businessName}{" "}
                    </h1>{" "}
                    <span className="px-2 py-0.5 rounded-full border border-[#37703F] bg-[#D1FAE5] text-xs text-[#37703F]">
                      {" "}
                      Opened
                    </span>
                  </div>
                  <HotelSaveCopy id={id} />
                </div>
                <div className="flex gap-1 items-center text-xs">
                  <Star className="fill-[#F0AE02] text-[#F0AE02] h-4" />{" "}
                  {restaurant.rating} <span className="text-[#6B7280]">({restaurant.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          <div className={activeTab === "rooms" ? "w-full" : "col-span-2"}>
            {/* Pass activeTab and setActiveTab to HotelInfo */}
            <HotelInfo id={id} data={restaurant} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
        {/* Hide the right column when activeTab is "rooms" */}
      
             
        {activeTab !== "rooms" && (
         
          <div className="space-y-8">
            {/* Show booking progress if user has started booking */}
            {/* <BookingProgress hotelId={id} /> */}
            
              <HotelBookingForm id={id} restaurant={restaurant} />
          
            <div className="rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] p-1">
              <MapComponent address={restaurant.address} />
            </div>
            <div className="max-w-sm w-full p-4 rounded-2xl bg-white space-y-4 text-sm text-gray-800">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-black mt-1" />
                  <p>{restaurant.address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Contact Information
                </h3>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-black mt-1" />
                  <a href={`tel:${restaurant.phone}`} className="hover:underline">
                    {restaurant.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="w-5 h-5 text-black mt-1" />
                  <a
                    href={`mailto:${restaurant.email}`}
                    className="hover:underline"
                  >
                    {restaurant.email}
                  </a>
                </div>
              </div>

              <div>
                <Link
                  href="#" // Changed from 'to' to 'href' for Next.js Link
                  className="text-green-700 font-medium underline hover:text-green-900"
                >
                  Restaurant room
                </Link>
              </div>
            </div>
         </div>
        )}
      </div>
    </main>
  );
};