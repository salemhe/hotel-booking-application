"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, isBefore } from "date-fns";
import { CalendarIcon, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export function HotelSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 21),
  });
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !dates || !guests) {
      return;
    }
    const searchParams = new URLSearchParams({
      type: "hotel",
      location,
      checkIn: dates?.from?.toISOString() || "",
      checkOut: dates?.to?.toISOString() || "",
      adults: guests.adults.toString(),
      children: guests.children.toString(),
      rooms: guests.rooms.toString(),
    });
    router.push(`/search-results?${searchParams.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white shadow-lg rounded-xl items-end border border-gray-200"
    >
      <div>
        <Label className="text-gray-700" htmlFor="hotel-location">
          Where do you want to stay?
        </Label>
        <Input
          id="hotel-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter destination, hotel, or landmark"
          className="mt-1 bg-white border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <Label className="text-gray-700">Duration</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full mt-1 justify-start text-left font-normal border border-gray-300 rounded-lg",
                !dates?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {dates?.from ? (
                dates.to ? (
                  <>
                    {format(dates.from, "dd/LL/y")} -{" "}
                    {format(dates.to, "dd/LL/y")}
                  </>
                ) : (
                  format(dates.from, "LLL dd, y")
                )
              ) : (
                "Select date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dates}
              defaultMonth={dates?.from}
              onSelect={setDates}
              numberOfMonths={2}
              className="rounded-md border"
              disabled={(date) => isBefore(date, addDays(new Date(), 0))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label className="text-gray-700">Guests & Rooms</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full mt-1 justify-start text-left font-normal border border-gray-300 rounded-lg"
            >
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              {guests.adults + guests.children}{" "}
              {guests.adults + guests.children === 1 ? "guest" : "guests"},{" "}
              {guests.rooms} {guests.rooms === 1 ? "room" : "rooms"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Adults</Label>
                <Input
                  type="number"
                  min={1}
                  value={guests.adults}
                  onChange={(e) =>
                    setGuests({
                      ...guests,
                      adults: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Children</Label>
                <Input
                  type="number"
                  min={0}
                  value={guests.children}
                  onChange={(e) =>
                    setGuests({
                      ...guests,
                      children: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Rooms</Label>
                <Input
                  type="number"
                  min={1}
                  value={guests.rooms}
                  onChange={(e) =>
                    setGuests({
                      ...guests,
                      rooms: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="col-span-full flex justify-center mt-4">
        <Button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full py-3 text-lg shadow-md"
        >
          <Search className="mr-2 h-4 w-4" /> Search Hotels
        </Button>
      </div>
    </form>
  );
}
