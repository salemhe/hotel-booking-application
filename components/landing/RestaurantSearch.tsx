"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Search } from "lucide-react";
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

export function RestaurantSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date>();
  const [cuisine, setCuisine] = useState("");
  const [guests, setGuests] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      return
    }
    const searchParams = new URLSearchParams({
      location,
      date: date?.toISOString() || "",
      cuisine,
      guests,
    });
    router.push(`/restaurants?${searchParams.toString()}`);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
        <div>
          <Label htmlFor="restaurant-location">Location</Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <MapPin
              className="absolute top-1/2 left-3 -mt-2 text-gray-400"
              size={16}
            />
            <Input
              id="restaurant-location"
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
          <Label htmlFor="restaurant-date">Date</Label>
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
          <Label htmlFor="restaurant-guests">Number of Guests</Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger id="restaurant-guests">
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
        <div>
          <Label htmlFor="restaurant-cuisine">Cuisine</Label>
          <Select value={cuisine} onValueChange={setCuisine}>
            <SelectTrigger id="restaurant-cuisine">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Cuisine</SelectItem>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search Restaurants
          </Button>
        </div>
      </form>
    </>
  );
}
