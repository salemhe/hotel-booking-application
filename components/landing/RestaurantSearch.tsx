"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RestaurantSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) {
      return;
    }
    const searchParams = new URLSearchParams({
      search,
      location,
    });
    router.push(`/restaurants?${searchParams.toString()}`);
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
      >
        <div>
          <Label htmlFor="restaurant-location">Restaurant</Label>
          <div className="mt-1 relative rounded-md shadow-xs">
            <UtensilsCrossed
              className="absolute top-1/2 left-3 -mt-2 text-gray-400"
              size={16}
            />
            <Input
              id="restaurant-location"
              placeholder="Enter a Restaurant"
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="restaurant-location">Location</Label>
          <div className="mt-1 relative rounded-md shadow-xs">
            <MapPin
              className="absolute top-1/2 left-3 -mt-2 text-gray-400"
              size={16}
            />
            <Input
              id="restaurant-location"
              placeholder="Enter a location"
              className="pl-10"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search Restaurants
          </Button>
        </div>
      </form>
    </>
  );
}
