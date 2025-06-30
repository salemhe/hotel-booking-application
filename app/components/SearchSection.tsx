import React, { useState,  } from "react";
import {
  format,
} from "date-fns";
import {
  FiSearch,
} from "react-icons/fi";
import { TimeDropdown } from "./TimeDropdown";
import { GuestDropdown } from "./GuestsDroppdown";
import { useRouter } from "next/navigation";
import { DateDropdown } from "./DateDropdown";

const SearchSection = ({ activeTab }: { activeTab: string }) => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="bg-white z-50 sm:absolute top-15 w-[90%] mx-auto left-0 right-0 rounded-2xl sm:rounded-full shadow-lg p-4 sm:p-2 justify-center mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Restaurant/Cuisine */}
        <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0  pl-3 w">
          <label className="text-xs text-text-secondary text-left   mb-1">
            Restaurant/Cuisine
          </label>
          {/* <div className="flex flex-col items-center pr- text-left"> */}
          <input
            type="text"
            placeholder="Enter Restaurant or Cuisine"
            className="w- focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
          />
          {/* </div> */}
        </div>

        {/* Date */}
        <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <label className="text-xs text-text-secondary text-left mb-1">
            Date
          </label>
          {/* <div className="relative flex flex-col items-center text-left"> */}
          {/* <FiCalendar className="absolute left-0 w-5 h-5 text-text-secondary" /> */}
          <DateDropdown selectedDate={date} onChange={(d) => setDate(d)} />
          {/* </div> */}
        </div>

        {/* Time */}
        <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <label className="text-xs text-text-secondary text-left mb-1">
            Time
          </label>
          <TimeDropdown selectedTime={time} onChange={setTime} />
        </div>

        {/* Guests */}
        <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <label className="text-xs text-text-secondary text-left mb-1">
            Guests
          </label>
          <GuestDropdown
            onChange={(counts) => console.log("guest counts", counts)}
          />
        </div>
        {/* Search button */}
        <div className="flex items-center justify-center sm:justify-end w-full">
          <button
            onClick={() => {
              router.push(`/search?date=${date ? format(date, "yyyy-MM-dd") : ""}&time=${time || ""}`);
              console.log("search button clicked");
            }}
            className={`flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-3 transition ${
              activeTab === "restaurants"
                ? "bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C] text-white rounded-full px-6 py-3 transition"
                : "bg-gradient-to-b from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600 text-white rounded-full px-6 py-3 transition"
            }`}
          >
            <FiSearch className="w-5 h-5" />
            <span className="text-sm sm:text-base">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;

// DateDropdown.tsx


export const SearchSectionTwo = () => {
  const [restaurant, setRestaurant] = useState<string>(
    "International Restaurant"
  );
  const [date, setDate] = useState<Date | null>(
    new Date("2025-05-23T00:00:00")
  );
  const [time, setTime] = useState<string | null>("7:30 pm");
  const [, setGuests] = useState<{
    adults: number;
    children: number;
    infants: number;
  }>({ adults: 2, children: 0, infants: 0 });
  const [, setShowDate] = useState(false);
  const [, setShowTime] = useState(false);
  const [, setShowGuests] = useState(false);
  // const totalGuests = guests.adults + guests.children + guests.infants;

  return (
    <div className="mx-auto w-full max-w-3xl h-16 bg-white rounded-full shadow-lg flex items-center px-2 sm:px-4 gap-2 sm:gap-0">
      {/* Restaurant/Cuisine */}
      <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4">
        <label className="text-xs text-text-secondary text-left mb-1">
          Restaurant/Cuisine
        </label>
        <input
          type="text"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          placeholder="Enter Restaurant or Cuisine"
          className="w-full bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
        />
      </div>
      {/* Date */}
      <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
        <label className="text-xs text-text-secondary text-left mb-1">
          Date
        </label>
        {/* <div onClick={() => setShowDate(v => !v)} className="cursor-pointer">
          <span className="text-sm text-text-primary truncate">{date ? format(date, 'MMM d, yyyy') : 'Pick date'}</span>
        </div> */}
        {/* {showDate && (
          <div className="absolute top-14 left-0 z-50"> */}
        <DateDropdown
          selectedDate={date}
          onChange={(d) => {
            setDate(d);
            setShowDate(false);
          }}
        />
        {/* </div> */}
        {/* )} */}
      </div>
      {/* Time */}
      <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
        <label className="text-xs text-text-secondary text-left mb-1">
          Time
        </label>
        {/* <div onClick={() => setShowTime(v => !v)} className="cursor-pointer">
          <span className="text-sm text-text-primary truncate">{time || 'Pick time'}</span>
        </div> */}
        {/* {showTime && (
          <div className="absolute top-14 left-0 z-50"> */}
        <TimeDropdown
          selectedTime={time}
          onChange={(t) => {
            setTime(t);
            setShowTime(false);
          }}
        />
        {/* </div>
        )} */}
      </div>
      {/* Guests */}
      <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
        <label className="text-xs text-text-secondary text-left mb-1">
          Guests
        </label>
        {/* <div onClick={() => setShowGuests(v => !v)} className="cursor-pointer">
          <span className="text-sm text-text-primary truncate">{totalGuests} Guest{totalGuests > 1 ? 's' : ''}</span>
        </div> */}
        {/* {showGuests && ( */}
        {/* <div className="absolute top-14 left-0 z-50"> */}
        <GuestDropdown
          onChange={(counts) => {
            setGuests(counts);
            setShowGuests(false);
          }}
        />
        {/* </div>
        )} */}
      </div>
      {/* Search Button */}
      <div className="flex items-center justify-center pl-2 pr-1">
        <button className="flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-2 transition bg-gradient-to-r from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600 focus:outline-none shadow-md">
          <FiSearch className="w-5 h-5" />
          <span className="text-sm sm:text-base">Search</span>
        </button>
      </div>
    </div>
  );
};
