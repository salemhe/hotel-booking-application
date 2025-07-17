"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Star,
  Share2,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Users,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";

interface RestaurantDetailProps {
  restaurant: {
    name: string;
    location: string;
    rating: number;
    reviews: number;
    images: string[];
    description: string;
    phone: string;
    email: string;
    website: string;
    openingHours: string;
  };
  onBack: () => void;
  onReserveTable: (reservationData: any) => void;
}

export default function RestaurantDetail({
  restaurant,
  onBack,
  onReserveTable,
}: RestaurantDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: 2,
    specialRequest: "",
  });

  const availableSlots = [
    "01:00 PM",
    "03:00 PM",
    "05:00 PM",
    "07:00 PM",
    "09:00 PM",
  ];

  const handleReservation = () => {
    onReserveTable(reservationData);
  };

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
              <span className="text-gray-600">Home</span>
              <span className="text-teal-600 font-medium border-b-2 border-teal-600 pb-1">
                Bookings / Reservations
              </span>
              <span className="text-gray-600">Promotions</span>
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Restaurant Images */}
            <div className="relative mb-6">
              <div className="grid grid-cols-2 gap-2 h-96">
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800"
                    alt="Restaurant main"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src="https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2F4312127934034d3d9966a28c38d976cd?format=webp&width=800"
                      alt="Restaurant"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src="https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Ffdf4fd0df6c84a6f98bb56a822f3de5f?format=webp&width=800"
                      alt="Restaurant"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-gray-900 text-white flex items-center justify-center">
                    <button className="text-sm font-medium">
                      See more photos
                    </button>
                  </div>
                </div>
              </div>
              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button variant="secondary" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button variant="secondary" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {restaurant.name}
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  Opened
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="ml-1">
                    ({restaurant.reviews.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{restaurant.location}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="slots">
                  Available Reservation Slots
                </TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Opening Hours
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-6">
                      <Clock className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {restaurant.openingHours}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-4">
                      Check out available reservation slots for today
                    </h3>

                    <div className="flex space-x-3 mb-6">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant="outline"
                          size="sm"
                          className="text-teal-600 border-teal-600"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="menu" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      Menu content would go here...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="slots" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      Available slots content would go here...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      Reviews content would go here...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Reservation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Reserve your Table
                  </h3>

                  <div className="space-y-4">
                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <Input
                          type="date"
                          value={reservationData.date}
                          onChange={(e) =>
                            setReservationData({
                              ...reservationData,
                              date: e.target.value,
                            })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Available Time
                        </label>
                        <Select
                          value={reservationData.time}
                          onValueChange={(value) =>
                            setReservationData({
                              ...reservationData,
                              time: value,
                            })
                          }
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Guest Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guest
                      </label>
                      <Select
                        value={reservationData.guests.toString()}
                        onValueChange={(value) =>
                          setReservationData({
                            ...reservationData,
                            guests: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} guest{num !== 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Special Request */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special request
                      </label>
                      <Textarea
                        placeholder=""
                        value={reservationData.specialRequest}
                        onChange={(e) =>
                          setReservationData({
                            ...reservationData,
                            specialRequest: e.target.value,
                          })
                        }
                        className="resize-none text-sm"
                        rows={3}
                      />
                    </div>

                    {/* Reserve Button */}
                    <Button
                      onClick={handleReservation}
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      disabled={!reservationData.date || !reservationData.time}
                    >
                      Reserve Table
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-500">Map View</span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Location</h4>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                      <span>{restaurant.location}</span>
                    </div>

                    <h4 className="font-medium text-gray-900">
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{restaurant.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{restaurant.email}</span>
                      </div>
                      <button className="text-teal-600 hover:underline">
                        {restaurant.website}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-gray-100 rounded-lg p-8">
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
        </footer>
      </div>
    </div>
  );
}
