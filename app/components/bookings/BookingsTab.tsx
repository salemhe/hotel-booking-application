import { useBookings } from "@/app/contexts/BookingsContext";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Clock,
  MoreVertical,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoFilter } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";
import BookingsCard from "./BookingsCard";

const BookingsTab = ({ type }: { type: "bookings" | "reservations" }) => {
  const { activeType, setActiveType } = useBookings();
  const [datas, setDatas] = useState<
    {
      name: string;
      type: string;
      status: string;
      location: string;
      guests: number;
      rooms: number;
      startTime: string;
      endTime: string;
      image: string;
    }[]
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [metLoading, setMetLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [data, setData] = useState<{
    upcomingBookings: number;
    pastBookings: number;
    upcomingReservations: number;
    pastReservations: number;
  }>({
    upcomingBookings: 4,
    pastBookings: 8,
    upcomingReservations: 3,
    pastReservations: 6,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const tab: { name: string; tab: "upcoming" | "past"; number: number }[] = [
    {
      name: `Upcoming ${type === "bookings" ? "Bookings" : "Reservations"}`,
      tab: "upcoming",
      number:
        type === "bookings" ? data.upcomingBookings : data.upcomingReservations,
    },
    {
      name: `Past ${type === "bookings" ? "Bookings" : "Reservations"}`,
      tab: "past",
      number: type === "bookings" ? data.pastBookings : data.pastReservations,
    },
  ];

  const filter = [
    "Featured Hotels",
    "Guest's Top-rated",
    "Wishlist",
    "Previously visited",
    "Top Hotels in Lagos",
  ];

  const bookings = [
    {
      name: "Kapadoccia",
      type: "Restaurant",
      status: "Confirmed",
      location: "Victoria Island, Lagos State",
      guests: 2,
      rooms: 1,
      startTime: "Monday 12:00 pm",
      endTime: "Tuesday 12:00pm",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
    },
    {
      name: "Kapadoccia",
      type: "Restaurant",
      status: "Pending",
      location: "Victoria Island, Lagos State",
      guests: 2,
      rooms: 1,
      startTime: "Monday 12:00 pm",
      endTime: "Tuesday 12:00pm",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
    },
    {
      name: "Kapadoccia",
      type: "Restaurant",
      status: "Confirmed",
      location: "Victoria Island, Lagos State",
      guests: 2,
      rooms: 1,
      startTime: "Monday 12:00 pm",
      endTime: "Tuesday 12:00pm",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
    },
    {
      name: "Kapadoccia",
      type: "Restaurant",
      status: "Confirmed",
      location: "Victoria Island, Lagos State",
      guests: 2,
      rooms: 1,
      startTime: "Monday 12:00 pm",
      endTime: "Tuesday 12:00pm",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
    },
    {
      name: "Eko Hotel & Suites",
      type: "Hotel",
      status: "Completed",
      location: "Victoria Island, Lagos State",
      guests: 2,
      rooms: 1,
      startTime: "Monday 12:00 pm",
      endTime: "Tuesday 12:00pm",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
    },
    {
      name: "Vangaa Apartments",
      type: "Apartments",
      status: "Cancelled",
      location: "Victoria Island, Lagos State",
      guests: 2,
      rooms: 1,
      startTime: "Monday 12:00 pm",
      endTime: "Tuesday 12:00pm",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
    },
  ];

  const fetchMetrics = async () => {
    setMetLoading(true);
    const upcomingBookings = bookings.filter(
      (c) => c.status === "Upcoming" && c.type === "Hotel",
    );
    const pastBookings = bookings.filter(
      (c) => c.status === "Past" && c.type === "Hotel",
    );
    const upcomingReservations = bookings.filter(
      (c) => c.status === "Upcoming" && c.type === "Restaurant",
    );
    const pastReservations = bookings.filter(
      (c) => c.status === "Past" && c.type === "Restaurant",
    );
    const data = new Promise<{
      upcomingBookings: number;
      pastBookings: number;
      upcomingReservations: number;
      pastReservations: number;
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          upcomingBookings: upcomingBookings.length,
          pastBookings: pastBookings.length,
          upcomingReservations: upcomingReservations.length,
          pastReservations: pastReservations.length,
        });
      }, 500);
    });
    setData(await data);
    setMetLoading(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const upcomingBookings = bookings.filter(
      (c) => c.status === "Upcoming" && c.type === "Hotel",
    );
    const pastBookings = bookings.filter(
      (c) => c.status === "Past" && c.type === "Hotel",
    );
    const upcomingReservations = bookings.filter(
      (c) => c.status === "Upcoming" && c.type === "Restaurant",
    );
    const pastReservations = bookings.filter(
      (c) => c.status === "Past" && c.type === "Restaurant",
    );

    const data = new Promise<
      {
        name: string;
        type: string;
        status: string;
        location: string;
        guests: number;
        rooms: number;
        startTime: string;
        endTime: string;
        image: string;
      }[]
    >((resolve) => {
      setTimeout(() => {
        const items =
          activeType === "upcoming" && type === "bookings"
            ? upcomingBookings
            : activeType === "past" && type === "bookings"
              ? pastBookings
              : activeType === "upcoming" && type === "reservations"
                ? upcomingReservations
                : pastReservations;
        resolve(items);
      }, 1000);
    });
    setDatas(await data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [type, activeType]);

  if (metLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A6C6D]" />
        <span className="ml-4 text-[#0A6C6D] font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center flex-wrap gap-4 px-4 pt-2 sm:pt-0 sm:pb-0 bg-white border rounded-t-2xl border-[#E5E7EB]">
        <div className="flex gap-6 items-center">
          {tab.map((tab, i) => (
            <button
              onClick={() => setActiveType(tab.tab)}
              key={i}
              className={`py-5 flex gap-2 items-center text-sm cursor-pointer font-medium ${
                activeType === tab.tab
                  ? "border-b-2 border-[#0A6C6D] text-[#0A6C6D] "
                  : "text-[#606368]"
              } `}
            >
              {tab.name}{" "}
              <div className="px-2.5 py-0.5 bg-[#E9EBF3] rounded-full">
                {tab.number}
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-6 items-center">
          <button className="px-3 py-2 rounded-xl border-[#E5E7EB] border bg-[#F9FAFB] cursor-pointer">
            <Search className="size-6" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-2 rounded-xl relative border-[#E5E7EB] border bg-[#F9FAFB] cursor-pointer">
              {activeItem && (
                <span className="absolute bg-orange-400 size-4 rounded-full -top-1 -right-1" />
              )}
              <div className="flex gap-2 items-center">
                <IoFilter className="size-5" /> Filter
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 rounded-2xl">
              {filter.map((item, i) => (
                <DropdownMenuCheckboxItem
                  key={i}
                  onClick={() => setActiveItem(item)}
                  checked={item === activeItem}
                  className={`${item === activeItem && "bg-[#E5E7EB]"}`}
                >
                  {item}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A6C6D]" />
          <span className="ml-4 text-[#0A6C6D] font-medium">Loading...</span>
        </div>
      ) : (
        datas && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {datas.map((booking, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={booking.image}
                      alt={booking.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <span className="mr-2">
                            {booking.type === "Restaurant" ? "🍽️" : "🏨"}
                          </span>
                          <span>{booking.type}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuCheckboxItem>
                            View Details
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Leave Review
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{booking.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>
                          {booking.guests} Guests, {booking.rooms} Room
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge
                        variant={
                          booking.status === "Confirmed"
                            ? "default"
                            : booking.status === "Pending"
                              ? "secondary"
                              : booking.status === "Completed"
                                ? "default"
                                : "destructive"
                        }
                        className={
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }
                      >
                        {booking.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default BookingsTab;
