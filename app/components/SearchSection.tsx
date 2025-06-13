import React, { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  // FiCalendar,
  // FiClock,
  // FiUsers,
  FiChevronDown,
} from "react-icons/fi";
import { TimeDropdown } from "./TimeDropdown";
import { GuestDropdown } from "./GuestsDroppdown";
import { useRouter } from "next/navigation";

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
              router.push("/search");
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

interface DateDropdownProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
}

export const DateDropdown = ({ selectedDate, onChange }: DateDropdownProps) => {
  const [show, setShow] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // build calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows: React.ReactNode[] = [];
  let days: React.ReactNode[] = [];
  let day = startDate;
  const work = () => {
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={cloneDay.toString()}
            className={`
            w-8 h-8 sm:w-12.5 sm:h-12 flex items-center justify-center text-black text-sm font-normal cursor-pointer  outline-1  outline-gray-300 
            ${
              !isSameMonth(cloneDay, monthStart)
                ? "text-neutral-400 "
                : isSameDay(cloneDay, selectedDate || new Date())
                ? "bg-indigo-800 text-white"
                : "text-gray-700 hover:bg-indigo-100 bg-gray-100"
            }
          `}
            onClick={() => {
              onChange(cloneDay);
              setShow(false);
            }}
          >
            {format(cloneDay, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 ">
          {days}
        </div>
      );
      days = [];
    }
  };

    work()

  return (
    <div className="relative inline-block text-left w-full" ref={ref}>
      {/* trigger */}
      <div
        className="flex items-center  py-2  rounded cursor-pointer"
        onClick={() => setShow(!show)}
      >
        {/* <FiCalendar className="mr-2 text-gray-500" /> */}
        <span className="flex-1 text-sm text-gray-700">
          {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Pick date"}
        </span>
        <FiChevronDown className="text-gray-500 cursor-pointer" />
      </div>

      {/* calendar dropdown */}
      {show && (
        <div className="absolute  mt-4 w-64 sm:w-96 right-0 sm:right-1 bg-white rounded-lg shadow-lg z-50 p-4">
          {/* header */}
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-base flex-1 font-medium text-gray-800">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <FiChevronLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <FiChevronRight className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
          </div>

          {/* weekday labels */}
          <div className="grid grid-cols-7  text-center text-xs font-semibold text-gray-900 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((wd) => (
              <div key={wd}>{wd}</div>
            ))}
          </div>

          {/* days grid */}
          <div>{rows}</div>
        </div>
      )}
    </div>
  );
};

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
