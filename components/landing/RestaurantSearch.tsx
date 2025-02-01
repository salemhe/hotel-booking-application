"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Clock, Search, Users } from "lucide-react";
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
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 py-7 px-9 bg-[#484848] rounded-3xl shadow-lg items-center"
    >
      <div>
        <Label className="text-white" htmlFor="restaurant-location">
          Where do you want to eat?
        </Label>
        <Input
          id="restaurant-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location or restaurant name"
          className="mt-1 bg-white"
        />
      </div>
      <div>
        <Label className="text-white">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full mt-1 justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
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
        <Label className="text-white">Time</Label>
        <Select value={time} onValueChange={setTime}>
          <SelectTrigger className="mt-1 bg-white">
            <SelectValue placeholder="Select time">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {time || "Select time"}
              </div>
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
        <Label className="text-white">Number of guests</Label>
        <div className="flex items-center gap-4 mt-1 w-full">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
          >
            -
          </Button>
          <div className="flex items-center gap-2 text-white">
            <Users className="h-4 w-4" />
            <span>
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setGuests((prev) => Math.min(20, prev + 1))}
          >
            +
          </Button>
        </div>
      </div>
      <Button type="submit" className="h-full">
        <Search className="mr-2 h-4 w-4" />
        Find a Table
      </Button>
    </form>
  );
}
