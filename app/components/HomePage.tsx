"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  Users,
  Heart,
  Star,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface HomePageProps {
  onSearch: (searchData: any) => void;
}

export default function HomePage({ onSearch }: HomePageProps) {
  const [searchData, setSearchData] = useState({
    restaurant: "",
    date: "",
    time: "",
    guests: "Select Number",
  });

  const restaurants = [
    {
      id: 1,
      name: "Kapadoccia",
      cuisine: "International, Turkish, Contemporary",
      location: "Lagos, Ikeja",
      rating: 4.8,
      reviews: 1000,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
      badges: ["Guest's Top-rated"],
    },
    {
      id: 2,
      name: "Kapadoccia",
      cuisine: "International, Turkish, Contemporary",
      location: "Lagos, Ikeja",
      rating: 4.8,
      reviews: 1000,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
      badges: ["Most Visited"],
    },
    {
      id: 3,
      name: "Kapadoccia",
      cuisine: "International, Turkish, Contemporary",
      location: "Lagos, Ikeja",
      rating: 4.8,
      reviews: 1000,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
      badges: ["Most Visited"],
    },
    {
      id: 4,
      name: "Kapadoccia",
      cuisine: "International, Turkish, Contemporary",
      location: "Lagos, Ikeja",
      rating: 4.8,
      reviews: 1000,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
      badges: ["Guest's Top-rated"],
    },
  ];

  const handleSearch = () => {
    onSearch(searchData);
  };

  const RestaurantCard = ({ restaurant }: { restaurant: any }) => (
    <Card className="overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
      <CardHeader className="p-0">
        <div className="relative h-48">
          {/* Badge */}
          {restaurant.badges.map((badge: string, idx: number) => (
            <Badge
              key={idx}
              className="absolute top-3 left-3 bg-purple-600 text-white z-10"
            >
              {badge}
            </Badge>
          ))}

          {/* Heart icon */}
          <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md z-10 group-hover:bg-red-50">
            <Heart className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
          </button>

          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="font-medium text-sm">{restaurant.rating}</span>
          <span className="text-gray-500 text-sm ml-1">
            ({restaurant.reviews.toLocaleString()} reviews)
          </span>
        </div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {restaurant.name}
        </h3>
        <p className="text-sm text-gray-600 mb-1">{restaurant.cuisine}</p>
        <p className="text-sm text-gray-500">{restaurant.location}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Bookies
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-teal-600 font-medium border-b-2 border-teal-600 pb-1">
                Home
              </span>
              <span className="text-gray-600">Bookings / Reservations</span>
              <span className="text-gray-600">Offers</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2">
                <div className="w-5 h-5 text-gray-600">🔔</div>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative min-h-[600px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fe8cb23c5a5874749865107d41d9f5ecf?format=webp&width=800')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Find your Perfect Table</h1>
            <p className="text-xl mb-8 text-gray-200">
              Discover and reserve the best restaurants in your city
            </p>

            {/* Search Form */}
            <Card className="bg-white text-gray-900 max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Button variant="ghost" className="bg-gray-100 text-gray-900">
                    🍽️ Restaurant
                  </Button>
                  <Button variant="ghost" className="text-gray-600">
                    🏨 Hotels
                  </Button>
                  <Button variant="ghost" className="text-gray-600">
                    🎪 Clubs
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Enter Restaurant or Cuisine"
                      value={searchData.restaurant}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          restaurant: e.target.value,
                        })
                      }
                      className="pl-10"
                    />
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={searchData.date}
                      onChange={(e) =>
                        setSearchData({ ...searchData, date: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>

                  <Select
                    value={searchData.time}
                    onValueChange={(value) =>
                      setSearchData({ ...searchData, time: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                      <SelectItem value="19:00">7:00 PM</SelectItem>
                      <SelectItem value="20:00">8:00 PM</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={searchData.guests}
                    onValueChange={(value) =>
                      setSearchData({ ...searchData, guests: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Guest{num !== 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSearch}
                  className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                  size="lg"
                >
                  Search
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Restaurant Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Popular Restaurants */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Popular Restaurants
            </h2>
            <Button variant="ghost" className="text-teal-600">
              View all <ChevronDown className="w-4 h-4 ml-1 rotate-90" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="text-teal-600 border-teal-600">
              Show more <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Top Rated Restaurants */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Top Rated Restaurants
            </h2>
            <Button variant="ghost" className="text-teal-600">
              View all <ChevronDown className="w-4 h-4 ml-1 rotate-90" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={`top-${restaurant.id}`}
                restaurant={restaurant}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="text-teal-600 border-teal-600">
              Show more <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Fine Dining */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fine Dining</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={`fine-${restaurant.id}`}
                restaurant={restaurant}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Bookies
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Making restaurant reservations simple and enjoyable
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Restaurants</li>
                <li>Hotels</li>
                <li>Top Restaurants</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About us</li>
                <li>Contact</li>
                <li>FAQs</li>
                <li>Help center</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>+2341234567</li>
                <li>Kapadoccia@gmail.com</li>
                <li>16, Idowu Taylor Street, Victoria Island 101241 Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 Bookies . All Rights Reserved
            </p>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
