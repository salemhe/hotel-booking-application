"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, MapPin, Star, Clock, Users } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  cuisine: string;
  location: string;
  priceRange: string;
  openTimes: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Kapadoccia Restaurant",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center",
    rating: 4.8,
    reviews: 1000,
    cuisine: "Mediterranean",
    location: "Victoria Island, Lagos",
    priceRange: "₦₦₦",
    openTimes: "10:00 AM - 11:00 PM",
  },
  {
    id: "2",
    name: "Spice Route",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center",
    rating: 4.6,
    reviews: 750,
    cuisine: "Indian",
    location: "Ikoyi, Lagos",
    priceRange: "₦₦",
    openTimes: "11:00 AM - 10:00 PM",
  },
  {
    id: "3",
    name: "Ocean Breeze",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center",
    rating: 4.7,
    reviews: 850,
    cuisine: "Seafood",
    location: "Lekki, Lagos",
    priceRange: "₦₦₦₦",
    openTimes: "12:00 PM - 12:00 AM",
  },
];

export default function RestaurantReservationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [guests, setGuests] = useState("2");

  useEffect(() => {
    // Get search parameters if coming from search
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const guestCount = searchParams.get("guests");

    if (date) setSelectedDate(date);
    if (time) setSelectedTime(time);
    if (guestCount) setGuests(guestCount);
  }, [searchParams]);

  const handleRestaurantSelect = (restaurantId: string) => {
    const queryParams = new URLSearchParams();
    if (selectedDate) queryParams.set("date", selectedDate);
    if (selectedTime) queryParams.set("time", selectedTime);
    if (guests) queryParams.set("guests", guests);

    router.push(
      `/restaurants/${restaurantId}/reservations?${queryParams.toString()}`,
    );
  };

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <Card
      className="mb-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleRestaurantSelect(restaurant.id)}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-4 p-6">
          <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {restaurant.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>{restaurant.cuisine}</span>
                  <span>•</span>
                  <span>{restaurant.priceRange}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-sm text-gray-500">
                    ({restaurant.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.openTimes}</span>
              </div>
            </div>

            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleRestaurantSelect(restaurant.id);
              }}
            >
              Make Reservation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Restaurant Reservations</h1>
              <p className="text-sm text-gray-500">
                Choose a restaurant to make your reservation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Details Bar */}
      {(selectedDate || selectedTime || guests !== "2") && (
        <div className="bg-teal-50 border-b px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-6 text-sm">
              {selectedDate && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Date:</span>
                  <span>{selectedDate}</span>
                </div>
              )}
              {selectedTime && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Time:</span>
                  <span>{selectedTime}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="font-medium">{guests} guests</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Available Restaurants</h2>
          <p className="text-gray-600">
            Select a restaurant to proceed with your reservation
          </p>
        </div>

        <div className="space-y-4">
          {mockRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {mockRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No restaurants available for your selected criteria
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/restaurants")}
            >
              Browse All Restaurants
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
