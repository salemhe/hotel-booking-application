"use client";

import React, { useState } from "react";
import {
  Search,
  Heart,
  Star,
  ChevronDown,
  Wifi,
  Car,
  Utensils,
  TreePine,
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Slider } from "@/app/components/ui/slider";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  location: string;
  rating: number;
  reviews: number;
  priceRange: number;
  features: string[];
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Kapadoccia",
    image: "/placeholder-restaurant.jpg",
    cuisine: ["International", "Turkish", "Contemporary"],
    location: "Lagos, Ikeja",
    rating: 4.8,
    reviews: 1000,
    priceRange: 50000,
    features: ["Outdoor seating", "WiFi", "Vegan options"],
  },
  {
    id: "2",
    name: "Kapadoccia",
    image: "/placeholder-restaurant.jpg",
    cuisine: ["International", "Turkish", "Contemporary"],
    location: "Lagos, Ikeja",
    rating: 4.8,
    reviews: 1000,
    priceRange: 45000,
    features: ["Indoor seating", "WiFi"],
  },
  {
    id: "3",
    name: "Kapadoccia",
    image: "/placeholder-restaurant.jpg",
    cuisine: ["International", "Turkish", "Contemporary"],
    location: "Lagos, Ikeja",
    rating: 4.8,
    reviews: 1000,
    priceRange: 60000,
    features: ["Outdoor seating", "Vegan options"],
  },
];

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center`;
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart
            className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </Button>
        <div className="absolute top-2 left-2">
          <Badge className="bg-purple-100 text-purple-800">
            Guest's favorite
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          <p className="text-sm text-gray-600">
            {restaurant.cuisine.join(", ")}
          </p>
          <p className="text-sm text-gray-500">{restaurant.location}</p>

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{restaurant.rating}</span>
            <span className="text-sm text-gray-500">
              ({restaurant.reviews.toLocaleString()} reviews)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([
    "International",
  ]);
  const [selectedLocation, setSelectedLocation] = useState("Lagos Island");
  const [priceRange, setPriceRange] = useState([15000, 70000]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState("any");

  const cuisineTypes = ["International", "Nigerian", "Italian", "Indian"];

  const features = [
    "Outdoor seating",
    "Indoor seating",
    "Vegan options",
    "Free WiFi",
  ];

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine],
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="font-semibold text-lg">Bookies</span>
              </div>
              <nav className="flex space-x-8">
                <a href="/home" className="text-gray-600 hover:text-gray-900">
                  Home
                </a>
                <a
                  href="/bookings"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Bookings/Reservation
                </a>
                <a href="/deals" className="text-gray-600 hover:text-gray-900">
                  Offers
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <span className="w-5 h-5 flex items-center justify-center">
                  🔔
                </span>
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                International Restaurant
              </span>
              <span className="text-sm text-gray-500">May 23, 2025</span>
              <span className="text-sm text-gray-500">7:30 pm</span>
              <span className="text-sm text-gray-500">2 Guests</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>

              {/* Cuisine Type */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Cuisine Type</h4>
                <div className="space-y-2">
                  {cuisineTypes.map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={cuisine}
                        checked={selectedCuisines.includes(cuisine)}
                        onCheckedChange={() => toggleCuisine(cuisine)}
                      />
                      <label htmlFor={cuisine} className="text-sm">
                        {cuisine}
                      </label>
                    </div>
                  ))}
                  <Button variant="link" className="p-0 h-auto text-teal-600">
                    Show more
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Location</h4>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="Lagos Island">Lagos Island</option>
                    <option value="Victoria Island">Victoria Island</option>
                    <option value="Ikeja">Ikeja</option>
                    <option value="Lekki">Lekki</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    min={10000}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Minimum: ₦{priceRange[0].toLocaleString()}</span>
                    <span>Maximum: ₦{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Features</h4>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                      <label htmlFor={feature} className="text-sm">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Ratings</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="any-rating"
                      name="rating"
                      value="any"
                      checked={selectedRating === "any"}
                      onChange={(e) => setSelectedRating(e.target.value)}
                    />
                    <label htmlFor="any-rating" className="text-sm">
                      Any ratings
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="3plus"
                      name="rating"
                      value="3plus"
                      checked={selectedRating === "3plus"}
                      onChange={(e) => setSelectedRating(e.target.value)}
                    />
                    <label
                      htmlFor="3plus"
                      className="text-sm flex items-center"
                    >
                      3.0+
                      <div className="flex ml-2">
                        {[1, 2, 3].map((i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="4plus"
                      name="rating"
                      value="4plus"
                      checked={selectedRating === "4plus"}
                      onChange={(e) => setSelectedRating(e.target.value)}
                    />
                    <label
                      htmlFor="4plus"
                      className="text-sm flex items-center"
                    >
                      4.0+
                      <div className="flex ml-2">
                        {[1, 2, 3, 4].map((i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                24 International Restaurants in Lagos
              </h2>
              <Button variant="link" className="text-teal-600">
                Show more ↓
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
              {mockRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={`${restaurant.id}-2`}
                  restaurant={restaurant}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button variant="link" className="text-teal-600">
                Show more ↓
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
