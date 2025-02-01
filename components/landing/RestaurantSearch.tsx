"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return [`${hour}:00`, `${hour}:30`];
}).flat();

export function RestaurantSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    // Simulated fetch from trending searches
    const data = [
      "Terra Kulture",
      "The Yellow Chilli",
      "Nkoyo",
      "Sky Restaurant & Lounge",
      "Bungalow Restaurant",
      "Ocean Basket",
      "The Backyard Bar & Grill",
      "RSVP Lagos",
      "Shiro Lagos",
    ];
    setSuggestions(data.filter((restaurant) => restaurant.toLowerCase().includes(query.toLowerCase())));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || !date || !time || !guests) {
      return;
    }

    const searchParams = new URLSearchParams({
      type: "restaurant",
      location,
      date: date?.toISOString() || "",
      time,
      guests: guests.toString(),
    });
    router.push(`/search-results?${searchParams.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white shadow-lg rounded-xl items-end border border-gray-200"
    >
      <div className=" relative">
        <Label className="text-gray-700" htmlFor="restaurant-location">
          Where do you want to eat?
        </Label>
        <Input
          id="restaurant-location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          placeholder="Enter location or restaurant name"
          className="mt-1 bg-white border border-gray-300 rounded-lg"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setLocation(suggestion);
                  setSuggestions([]);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <Label className="text-gray-700">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full mt-1 justify-start text-left font-normal border border-gray-300 rounded-lg",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {date ? format(date, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label className="text-gray-700">Time</Label>
        <Select value={time} onValueChange={setTime}>
          <SelectTrigger className="mt-1 bg-white border border-gray-300 rounded-lg">
            <SelectValue placeholder="Select time">
              {time || "Select time"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-gray-700">Number of guests</Label>
        <div className="flex items-center gap-4 mt-1 w-full">
          <Button type="button" variant="outline" size="icon" onClick={() => setGuests((prev) => Math.max(1, prev - 1))}>
            -
          </Button>
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{guests} {guests === 1 ? "guest" : "guests"}</span>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={() => setGuests((prev) => Math.min(20, prev + 1))}>
            +
          </Button>
        </div>
      </div>
      <div className="col-span-full flex justify-center mt-4">
        <Button type="submit" className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full py-3 text-lg shadow-md">
          <Search className="mr-2 h-4 w-4" /> Find a Table
        </Button>
      </div>
    </form>
  );
}
