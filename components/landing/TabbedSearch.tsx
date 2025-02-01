"use client";

import { useState } from "react";
import { HotelSearch } from "@/components/landing/HoteslSearch";
import { RestaurantSearch } from "@/components/landing/RestaurantSearch";
import { Bed, Utensils } from "lucide-react";
import { Button } from "../ui/button";

export function TabbedSearch() {
  const [activeTab, setActiveTab] = useState("hotels");

  return (
    <div className="w-full">
      <div className="flex gap-2 bg-muted rounded-lg p-1 max-w-[400px] items-center justify-center mx-auto">
        <Button
          variant={activeTab === "hotels" ? "default" : "ghost"}
          className="flex-1 rounded-md flex flex-col h-[50px]"
          onClick={() => setActiveTab("hotels")}
        >
          <Bed className="h-4 w-4" /> Hotels
        </Button>
        <Button
          variant={activeTab === "restaurants" ? "default" : "ghost"}
          className="flex-1 rounded-md flex flex-col h-[50px]"
          onClick={() => setActiveTab("restaurants")}
        >
          <Utensils className="h-4 w-4" /> Restaurants
        </Button>
      </div>
      <div>
        {
          activeTab === "hotels" && (
         <div className="mt-0">
            <HotelSearch />
          </div>
          )
        }
        {
          activeTab === "restaurants" && (
         <div className="mt-0">
            <RestaurantSearch />
          </div>
          )
        }
      </div>
    </div>
  );
}