"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format, isBefore } from "date-fns";
import { CalendarIcon, MapPinPlus, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countries, numberOfPeople } from "@/utils/constant";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

const BookSection = () => {
  const [location, setLocation] = useState("");
  const [dates, setDates] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 21),
  });
  const [guests, setGuests] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    if (!location || !dates || !guests) {
      return;
    }
    setShowDialog(true)
  };

  return (
    <>
      <Dialog
        open={showDialog}
        onOpenChange={setShowDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Data Submited</DialogTitle>
            <DialogDescription>
              This are the data that are going to be sent
            </DialogDescription>
            <div className="flex flex-col p-6 border-2 border-dashed">
              <ul className="flex flex-col gap-4 text-gray-600">
                <li>Dates: from <span className="text-black">{String(dates?.from)}</span> to <span className="text-black">{String(dates?.to)}</span></li>
                <li>location: <span className="text-black">{location.toUpperCase()}</span></li>
                <li>how many people: <span className="text-black">{guests}</span></li>
              </ul>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
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
                {dates?.from ? (
                  dates.to ? (
                    <>
                      {format(dates.from, "LLL dd, y")} -{" "}
                      {format(dates.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dates.from, "LLL dd, y")
                  )
                ) : (
                  <span>Check Available</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
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
    </>
  );
};

export default BookSection;
