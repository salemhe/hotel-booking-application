"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPinPlus, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countries, numberOfPeople } from "@/constant";

const BookSection = () => {
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    if (!location || !dates || !guests) {
      return;
    }
    console.log("Dates:", dates);
    console.log("Location:", location);
    console.log("Guests:", guests);
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-15 items-end text-gray-700"
      onSubmit={handleSubmit}
    >
      {/* Date Picker */}
      <div className="flex flex-col ">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="justify-start text-left font-normal"
            >
              <CalendarIcon />
              {dates ? format(dates, "PPP") : <span>Check Available</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dates}
              onSelect={setDates}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Location */}
      <Select onValueChange={(value) => setGuests(value)}>
        <SelectTrigger className="bg-white focus:ring-0 hover:bg-accent hover:text-accent-foreground">
          <div className="flex gap-4 items-center">
            <User />
            <SelectValue placeholder="People" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {numberOfPeople.map((people, i) => (
              <SelectItem key={i} value={people.value}>
                {people.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Guests Input */}
      <Select onValueChange={(value) => setLocation(value)}>
        <SelectTrigger className="bg-white focus:ring-0 hover:bg-accent hover:text-accent-foreground">
          <div className="flex gap-4 items-center">
            <MapPinPlus />
            <SelectValue placeholder="Select Location" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {countries.map((country, i) => (
              <SelectItem key={i} value={country.value}>
                {country.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-[#222222] transition-all duration-200"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default BookSection;
