"use client";

import React, { useState } from "react";
import {
  Heart,
  Share,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Users,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

const timeSlots = ["01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM", "09:00 PM"];

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [specialRequest, setSpecialRequest] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);

  const restaurantImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop&crop=center",
  ];

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
                  className="text-teal-600 font-medium border-b-2 border-teal-600 pb-4"
                >
                  Bookings / Reservations
                </a>
                <a href="/deals" className="text-gray-600 hover:text-gray-900">
                  Promotions
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <span className="w-5 h-5 flex items-center justify-center">
                  🔍
                </span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <img
                  src={restaurantImages[0]}
                  alt="Restaurant main"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {restaurantImages.slice(1).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Restaurant ${index + 2}`}
                      className="w-full h-[120px] object-cover rounded-lg"
                    />
                    {index === 2 && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <Button variant="ghost" className="text-white">
                          See more photos
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      Kapadoccia - Lagos, Nigeria
                    </h1>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Opened
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-gray-500">(1,000 reviews)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Share className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
                    />
                    Save
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="menu">Menu</TabsTrigger>
                  <TabsTrigger value="slots">
                    Available Reservation Slots
                  </TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          Opening Hours
                        </span>
                      </div>
                      <p className="text-green-700">
                        12:00 PM - 11:00 PM Daily
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        Check out available reservation slots for today
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {timeSlots.map((time) => (
                          <Badge
                            key={time}
                            variant="outline"
                            className="px-3 py-1"
                          >
                            🚇 {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="menu" className="mt-6">
                  <p className="text-gray-600">
                    Menu content will be displayed here
                  </p>
                </TabsContent>

                <TabsContent value="slots" className="mt-6">
                  <p className="text-gray-600">
                    Available slots will be displayed here
                  </p>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <p className="text-gray-600">
                    Reviews will be displayed here
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Reservation Form */}
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Reserve your Table
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        placeholder="Select date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Time
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="">Select Time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guest
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="1">1 guest</option>
                      <option value="2">2 guests</option>
                      <option value="3">3 guests</option>
                      <option value="4">4 guests</option>
                      <option value="5">5+ guests</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special request
                    </label>
                    <Textarea
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="Any special requests?"
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
                    disabled={!selectedDate || !selectedTime}
                  >
                    Reserve Table
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="p-4">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=200&fit=crop&crop=center"
                    alt="Map"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-green-100/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm font-medium">Kapadoccia</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Location
                    </h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">
                        16, Idowu Taylor Street, Victoria Island 101241 Nigeria
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <a
                          href="tel:+2341234567"
                          className="text-gray-700 hover:underline"
                        >
                          +23412345678
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <a
                          href="mailto:kapadoccia@gmail.com"
                          className="text-gray-700 hover:underline"
                        >
                          Kapadoccia@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <a
                      href="#"
                      className="text-teal-600 font-medium underline hover:text-teal-700"
                    >
                      Restaurant website
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="font-semibold text-lg">Bookies</span>
              </div>
              <p className="text-gray-600 text-sm">
                Making restaurant reservations simple and enjoyable
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Restaurants
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Hotels
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Top Restaurants
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Help center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>+23412345678</li>
                <li>Kapadoccia@gmail.com</li>
                <li>16, Idowu Taylor Street, Victoria Island 101241 Nigeria</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 mt-8 flex items-center justify-between text-sm text-gray-600">
            <p>© 2025 Bookies . All Rights Reserved</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-900">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
