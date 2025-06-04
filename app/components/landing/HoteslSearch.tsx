"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function HotelSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      return;
    }
    const searchParams = new URLSearchParams({
      type: "hotel",
      location,
      checkIn: checkIn?.toISOString() || "",
      checkOut: checkOut?.toISOString() || "",
      guests,
    });
    router.push(`/hotels?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
      <div>
        <Label htmlFor="hotel-location">Location</Label>
        <div className="mt-1 relative rounded-md shadow-xs">
          <MapPin
            className="absolute top-1/2 left-3 -mt-2 text-gray-400"
            size={16}
          />
          <Input
            id="hotel-location"
            placeholder="Enter a location"
            className="pl-10"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="hotel-check-in">Check-in Date</Label>
        <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full mt-1 justify-start text-left font-normal border border-gray-300 rounded-lg",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {checkIn ? format(checkIn, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(checkIn) => checkIn < new Date()}
              />
            </PopoverContent>
          </Popover>
      </div>
      <div>
        <Label htmlFor="hotel-check-out">Check-out Date</Label>
        <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full mt-1 justify-start text-left font-normal border border-gray-300 rounded-lg",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {checkOut ? format(checkOut, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(checkOut) => checkOut < new Date()}
              />
            </PopoverContent>
          </Popover>
      </div>
      <div>
        <Label htmlFor="hotel-guests">Number of Guests</Label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger id="hotel-guests">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 guest</SelectItem>
            <SelectItem value="2">2 guests</SelectItem>
            <SelectItem value="3">3 guests</SelectItem>
            <SelectItem value="4">4 guests</SelectItem>
            <SelectItem value="5">5+ guests</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search Hotels
        </Button>
      </div>
    </form>
  );
}
