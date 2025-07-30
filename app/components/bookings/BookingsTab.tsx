import { useBookings } from "@/app/contexts/BookingsContext";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoFilter } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
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
  }, [fetchMetrics]);

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
      name: "Eko Hotel & Suites",
      type: "Hotel",
      status: "Past",
      location: "Victoria Island, Lagos State",
      guests: 2,
      rooms: 1,
      startTime: "Monday 12:00 pm",
      endTime: "Tuesday 12:00 pm",
      image: "/images/eko-hotel.jpg",
    },
    {
      name: "The Yellow Chilli",
      type: "Restaurant",
      status: "Upcoming",
      location: "Ikeja, Lagos State",
      guests: 4,
      rooms: 0,
      startTime: "Friday 7:00 pm",
      endTime: "Friday 9:00 pm",
      image: "/images/yellow-chilli.jpg",
    },
    {
      name: "Radisson Blu Anchorage",
      type: "Hotel",
      status: "Upcoming",
      location: "Ozumba Mbadiwe, Lagos State",
      guests: 1,
      rooms: 1,
      startTime: "Wednesday 2:00 pm",
      endTime: "Thursday 11:00 am",
      image: "/images/radisson-blu.jpg",
    },
    {
      name: "Sheraton Lagos Hotel",
      type: "Hotel",
      status: "Past",
      location: "Ikeja, Lagos State",
      guests: 2,
      rooms: 1,
      startTime: "Sunday 3:00 pm",
      endTime: "Monday 11:00 am",
      image: "/images/sheraton.jpg",
    },
    {
      name: "RSVP Lagos",
      type: "Restaurant",
      status: "Upcoming",
      location: "Victoria Island, Lagos State",
      guests: 2,
      rooms: 0,
      startTime: "Saturday 6:30 pm",
      endTime: "Saturday 9:00 pm",
      image: "/images/rsvp.jpg",
    },
    {
      name: "Bon Hotel Grand Towers",
      type: "Hotel",
      status: "Upcoming",
      location: "Abuja, FCT",
      guests: 3,
      rooms: 2,
      startTime: "Thursday 1:00 pm",
      endTime: "Friday 11:00 am",
      image: "/images/bon-hotel.jpg",
    },
    {
      name: "The Grill by Delis",
      type: "Restaurant",
      status: "Past",
      location: "Victoria Island, Lagos State",
      guests: 2,
      rooms: 0,
      startTime: "Last Saturday 7:00 pm",
      endTime: "Last Saturday 9:30 pm",
      image: "/images/the-grill.jpg",
    },
    {
      name: "Transcorp Hilton Abuja",
      type: "Hotel",
      status: "Past",
      location: "Maitama, Abuja",
      guests: 2,
      rooms: 1,
      startTime: "Tuesday 4:00 pm",
      endTime: "Wednesday 11:00 am",
      image: "/images/transcorp.jpg",
    },
    {
      name: "Ocean Basket",
      type: "Restaurant",
      status: "Upcoming",
      location: "Lekki Phase 1, Lagos State",
      guests: 3,
      rooms: 0,
      startTime: "Next Sunday 1:00 pm",
      endTime: "Next Sunday 3:00 pm",
      image: "/images/ocean-basket.jpg",
    },
    {
      name: "Four Points by Sheraton",
      type: "Hotel",
      status: "Upcoming",
      location: "Oniru, Victoria Island",
      guests: 2,
      rooms: 1,
      startTime: "Next Monday 12:00 pm",
      endTime: "Next Tuesday 12:00 pm",
      image: "/images/four-points.jpg",
    },
  ];

  const fetchMetrics = async () => {
    setMetLoading(true)
    const upcomingBookings = bookings.filter(
      (c) => c.status === "Upcoming" && c.type === "Hotel"
    );
    const pastBookings = bookings.filter(
      (c) => c.status === "Past" && c.type === "Hotel"
    );
    const upcomingReservations = bookings.filter(
      (c) => c.status === "Upcoming" && c.type === "Restaurant"
    );
    const pastReservations = bookings.filter(
      (c) => c.status === "Past" && c.type === "Restaurant"
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
    setMetLoading(false)
  };

  const fetchData = async () => {
    setIsLoading(true);
    const upcomingBookings = bookings.filter(
      (c) => c.status === "Upcoming" && c.type === "Hotel"
    );
    const pastBookings = bookings.filter(
      (c) => c.status === "Past" && c.type === "Hotel"
    );
    const upcomingReservations = bookings.filter(
      (c) => c.status === "Upcoming" && c.type === "Restaurant"
    );
    const pastReservations = bookings.filter(
      (c) => c.status === "Past" && c.type === "Restaurant"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {datas.map((booking, i) => (
              <BookingsCard key={i} data={booking} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default BookingsTab;
