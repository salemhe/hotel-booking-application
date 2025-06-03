// UserRestaurantList.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface Restaurant {
  _id: string;
  location: string;
  cuisine: string;
  openingTime: string;
  closingTime: string;
  priceRange: string;
  images: string[];
}

export default function UserRestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurant/all");
        const data = await res.json();
        if (data.success) {
          setRestaurants(data.restaurants);
        }
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
      {restaurants.map((r) => (
        <Card key={r._id} className="rounded-2xl shadow-md">
          {r.images?.[0] && (
            <Image
              src={`http://localhost:5000${r.images[0]}`}
              alt="Restaurant image"
              width={400}
              height={250}
              className="rounded-t-2xl object-cover w-full h-60"
            />
          )}
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-2">{r.cuisine}</h3>
            <p className="text-sm text-gray-700 mb-1">📍 {r.location}</p>
            <p className="text-sm text-gray-700 mb-1">
              🕒 {r.openingTime} - {r.closingTime}
            </p>
            <p className="text-sm text-gray-700">💵 {r.priceRange}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
