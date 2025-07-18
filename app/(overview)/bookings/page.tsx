"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface Reservation {
  id: string;
  restaurantName: string;
  image: string;
  date: string;
  time: string;
  guests: number;
  rooms: number;
  location: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  type: "restaurant" | "hotel";
}

const mockReservations: Reservation[] = [
  {
    id: "1",
    restaurantName: "Kapadoccia",
    image: "/placeholder-restaurant.jpg",
    date: "Monday 12:00 pm - Tuesday 12:00pm",
    time: "12:00 PM",
    guests: 2,
    rooms: 1,
    location: "Victoria Island, Lagos State",
    status: "confirmed",
    type: "restaurant",
  },
  {
    id: "2",
    restaurantName: "Kapadoccia",
    image: "/placeholder-restaurant.jpg",
    date: "Monday 12:00 pm - Tuesday 12:00pm",
    time: "12:00 PM",
    guests: 2,
    rooms: 1,
    location: "Victoria Island, Lagos State",
    status: "pending",
    type: "restaurant",
  },
  {
    id: "3",
    restaurantName: "Eko Hotel & Suites",
    image: "/placeholder-hotel.jpg",
    date: "Monday 12:00 pm - Tuesday 12:00pm",
    time: "12:00 PM",
    guests: 2,
    rooms: 1,
    location: "Victoria Island, Lagos State",
    status: "completed",
    type: "hotel",
  },
  {
    id: "4",
    restaurantName: "Vargas Apartments",
    image: "/placeholder-hotel.jpg",
    date: "Monday 14:00 pm - Tuesday 12:00pm",
    time: "2:00 PM",
    guests: 2,
    rooms: 2,
    location: "Victoria Island, Lagos State",
    status: "cancelled",
    type: "hotel",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Confirmed
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Pending
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/bookings/${reservation.id}`);
  };

  return (
    <Card
      className="mb-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleViewDetails}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={reservation.image}
              alt={reservation.restaurantName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop&crop=center`;
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {reservation.restaurantName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {reservation.type === "restaurant"
                      ? "Restaurant"
                      : reservation.type === "hotel"
                        ? "Hotels"
                        : "Apartments"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(reservation.status)}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{reservation.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{reservation.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {reservation.guests} Guests, {reservation.rooms} Room
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {reservation.status === "confirmed" && (
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails();
                  }}
                >
                  View Details
                </Button>
              )}
              {reservation.status === "pending" && (
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails();
                  }}
                >
                  View Details
                </Button>
              )}
              {(reservation.status === "completed" ||
                reservation.status === "cancelled") && (
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails();
                  }}
                >
                  Leave Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "reservations") {
      setActiveTab("reservations");
    }
  }, [searchParams]);

  const upcomingReservations = mockReservations.filter(
    (r) => r.status === "confirmed" || r.status === "pending",
  );
  const pastReservations = mockReservations.filter(
    (r) => r.status === "completed" || r.status === "cancelled",
  );

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
                  Bookings/Reservation
                </a>
                <a href="/deals" className="text-gray-600 hover:text-gray-900">
                  Promotions
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-center mb-6">
            <TabsList className="grid w-fit grid-cols-2 bg-gray-100">
              <TabsTrigger value="bookings" className="px-6">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="reservations" className="px-6">
                Reservations
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bookings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium">Upcoming Bookings</h2>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {upcomingReservations.length}
                  </span>
                  <h2 className="text-lg font-medium text-gray-500 ml-6">
                    Past Bookings
                  </h2>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {pastReservations.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {upcomingReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                    />
                  ))}
                </div>
                <div>
                  {pastReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reservations">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium">Upcoming Reservations</h2>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {
                      upcomingReservations.filter(
                        (r) => r.type === "restaurant",
                      ).length
                    }
                  </span>
                  <h2 className="text-lg font-medium text-gray-500 ml-6">
                    Past Reservations
                  </h2>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {
                      pastReservations.filter((r) => r.type === "restaurant")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {upcomingReservations
                    .filter((r) => r.type === "restaurant")
                    .map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                      />
                    ))}
                </div>
                <div>
                  {pastReservations
                    .filter((r) => r.type === "restaurant")
                    .map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                      />
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
