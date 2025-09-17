"use client"
import React, { useEffect, useState } from "react";
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

interface SearchData {
  query: string;
  tab: string;
  date?: string;
  time?: string;
  guests?: string;
  timestamp: string;
}

interface SearchSectionProps {
  activeTab: string;
  onSearch?: (searchData: SearchData) => void;
}

const SearchSection = ({ activeTab, onSearch }: SearchSectionProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [guests, setGuests] = useState<{
    adults: number;
    children: number;
    infants: number;
  }>({ adults: 2, children: 0, infants: 0 });
  
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalGuests = guests.adults + guests.children + guests.infants;
    const searchData = {
      query: searchQuery,
      tab: activeTab,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      time: time || undefined,
      guests: totalGuests.toString(),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('searchData', JSON.stringify(searchData));
    if (onSearch) {
      onSearch(searchData);
    } else {
      router.push(`/search`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="bg-white z-50 absolute top-5 lg:top-15 w-full left-0 right-0 rounded-3xl lg:rounded-full shadow-lg p-4 sm:p-2 justify-center mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Restaurant/Cuisine */}
        <div className="flex flex-col justify-center col-span-2 lg:col-span-1 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 pl-3">
          <label className="text-xs text-text-secondary text-left mb-1">
            {activeTab === "restaurants" ? " Restaurant/Cuisine" : activeTab === "hotels" ? "Hotels": "Club"}
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === "restaurants" ? "Enter Restaurant or Cuisine" : activeTab === "hotels" ? "Enter Hotels" : "Enter club name"}
            className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
          />
        </div>

    //     {/* Date */}
    //     <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
    //       <label className="text-xs text-text-secondary text-left mb-1">
    //         Date
    //       </label>
    //       <DateDropdown selectedDate={date} onChange={(d) => setDate(d)} />
    //     </div>

    //     {/* Time */}
    //     <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
    //       <label className="text-xs text-text-secondary text-left mb-1">
    //         Time
    //       </label>
    //       <TimeDropdown selectedTime={time} onChange={setTime} />
    //     </div>

    //     {/* Guests */}
    //     <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
    //       <label className="text-xs text-text-secondary text-left mb-1">
    //         Guests
    //       </label>
    //       <GuestDropdown
    //         onChange={(counts) => setGuests(counts)}
    //       />
    //     </div>
        
        {/* Search button */}
        <div className="flex items-center justify-center sm:justify-end w-full">
          <button
            type="submit"
            className={`flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-3 transition ${
              activeTab === "restaurants"
                ? "bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]"
                : activeTab === "hotels" 
                ? "bg-gradient-to-b from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600"
                : "bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]"
            }`}
          >
            <FiSearch className="w-5 h-5" />
            <span className="text-sm sm:text-base">Search</span>
          </button>
        </div>
      </div>

      {/* Time */}
      <div className="flex flex-col justify-center border-b sm:border-b-0 lg:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
        <label className="text-xs text-text-secondary text-left mb-1">
          Time
        </label>
        <TimeDropdown selectedTime={time} onChange={setTime} />
      </div>
    </div>

    {/* Row 3: Guests + Search button */}
    <div className="grid grid-cols-2 gap-4 col-span-1 sm:col-span-2 lg:col-span-2">
      {/* Guests */}
      <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
        <label className="text-xs text-text-secondary text-left mb-1">
          Guests
        </label>
        <GuestDropdown onChange={(counts) => setGuests(counts)} />
      </div>

      {/* Search button */}
      <div className="flex items-center justify-center sm:justify-end w-full">
        <button
          type="submit"
          className={`flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-3 transition w-full sm:w-auto justify-center ${
            activeTab === "restaurants"
              ? "bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]"
              : "bg-gradient-to-b from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600"
          }`}
        >
          <FiSearch className="w-5 h-5" />
          <span className="text-sm sm:text-base">Search</span>
        </button>
      </div>
    </div>
  </div>
</form>



  );
};

export default SearchSection;

interface SearchSectionTwoProps {
  onSearch?: (searchData: SearchData) => void;
  searchData?: SearchData | null;
}

export const SearchSectionTwo = ({ onSearch, searchData }: SearchSectionTwoProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<{
    adults: number;
    children: number;
    infants: number;
  }>({ adults: 2, children: 0, infants: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    // Update state from searchData prop if provided
    if (searchData) {
      if (searchData.query) setSearchQuery(searchData.query);
      if (searchData.date) setDate(new Date(searchData.date));
      if (searchData.time) setTime(searchData.time);
      if (searchData.guests) {
        const guestsNum = parseInt(searchData.guests, 10);
        setGuests({ adults: guestsNum || 2, children: 0, infants: 0 });
      }
    } else {
      // On mount, load from localStorage if available
      const stored = localStorage.getItem('searchData');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.query) setSearchQuery(parsed.query);
          if (parsed.date) setDate(new Date(parsed.date));
          if (parsed.time) setTime(parsed.time);
          if (parsed.guests) {
            const guestsNum = parseInt(parsed.guests, 10);
            setGuests({ adults: guestsNum || 2, children: 0, infants: 0 });
          }
        } catch {}
      }
    }
  }, [searchData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalGuests = guests.adults + guests.children + guests.infants;
    const searchData = {
      query: searchQuery,
      tab: 'restaurants',
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      time: time || undefined,
      guests: totalGuests.toString(),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('searchData', JSON.stringify(searchData));
    if (onSearch) {
      onSearch(searchData);
    } else {
      router.push(`/search`);
    }
  };
  
  return (
    <form onSubmit={handleSearchSubmit} className="mx-auto w-full max-w-3xl">
      {/* Desktop Search Bar */}
      <div className="hidden sm:block">
        <div className="h-16 bg-white rounded-full shadow-lg flex items-center px-2 sm:px-4 gap-2 sm:gap-0">
          {/* Restaurant/Cuisine */}
          <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4">
            <label className="text-xs text-text-secondary text-left mb-1">
              Restaurant/Cuisine
            </label>
            <input
              type="text"
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Restaurant or Cuisine"
              className="w-full bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
            />
          </div>
          
          {/* Date */}
          <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              Date
            </label>
            <DateDropdown
              selectedDate={date}
              onChange={(d) => {
                setDate(d);
              }}
            />
          </div>
          
          {/* Time */}
          <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              Time
            </label>
            <TimeDropdown
              selectedTime={time}
              onChange={(t) => {
                setTime(t);
              }}
            />
          </div>
          
          {/* Guests */}
          <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              Guests
            </label>
            <GuestDropdown
              onChange={(counts) => {
                setGuests(counts);
              }}
            />
          </div>
          
          {/* Search Button */}
          <div className="flex items-center justify-center pl-2 pr-1">
            <button type="submit" className="flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-2 transition bg-gradient-to-r from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600 focus:outline-none shadow-md">
              <FiSearch className="w-5 h-5" />
              <span className="text-sm sm:text-base">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden">
        <div className="bg-black  shadow-lg p-4 space-y-4">
         {/* Resurants & Cusisine */}
          <div className="space-y-2">
            <label className="text-xs text-text-secondary font-medium">
              Restaurant/Cuisine
            </label>
            <input
              type="text"
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Restaurant or Cuisine"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-text-secondary font-medium">
                Date
              </label>
              <div className="p-3 border border-gray-200 rounded-lg">
                <DateDropdown
                  selectedDate={date}
                  onChange={(d) => {
                    setDate(d);
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-text-secondary font-medium">
                Time
              </label>
              <div className="p-3 border border-gray-200 rounded-lg">
                <TimeDropdown
                  selectedTime={time}
                  onChange={(t) => {
                    setTime(t);
                  }}
                />
              </div>
            </div>
          </div>
          

          {/* Guest  */}
          <div className="space-y-2">
            <label className="text-xs text-text-secondary font-medium">
              Guests
            </label>
            <div className="p-3 border border-gray-200 rounded-lg">
              <GuestDropdown
                onChange={(counts) => {
                  setGuests(counts);
                }}
              />
            </div>
          </div>
          
         {/* Search Bar */}
          <button type="submit" className="w-full flex items-center justify-center gap-2 cursor-pointer text-white rounded-lg px-6 py-4 transition bg-gradient-to-r from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600 focus:outline-none shadow-md">
            <FiSearch className="w-5 h-5" />
            <span className="text-base font-medium">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};
































































































































































































































































































// src/app/components/SearchSection.tsx

// import React, { useEffect, useState } from "react";
// import {
//   format,
// } from "date-fns";
// import {
//   FiSearch,
// } from "react-icons/fi";
// import { TimeDropdown } from "./TimeDropdown";
// import { GuestDropdown } from "./GuestsDroppdown";
// import { useRouter } from "next/navigation";
// import { DateDropdown } from "./DateDropdown";

// interface SearchData {
//   query: string;
//   tab: string;
//   date?: string;
//   time?: string;
//   guests?: string;
//   timestamp: string;
// }

// interface SearchSectionProps {
//   activeTab: string;
//   onSearch?: (searchData: SearchData) => void;
// }

// const SearchSection = ({ activeTab, onSearch }: SearchSectionProps) => {
//   const [date, setDate] = useState<Date | null>(null);
//   const [time, setTime] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [guests, setGuests] = useState<{
//     adults: number;
//     children: number;
//     infants: number;
//   }>({ adults: 2, children: 0, infants: 0 });
  
//   const router = useRouter();

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const totalGuests = guests.adults + guests.children + guests.infants;
//     const searchData = {
//       query: searchQuery,
//       tab: activeTab,
//       date: date ? format(date, "yyyy-MM-dd") : undefined,
//       time: time || undefined,
//       guests: totalGuests.toString(),
//       timestamp: new Date().toISOString(),
//     };
//     localStorage.setItem('searchData', JSON.stringify(searchData));
//     if (onSearch) {
//       onSearch(searchData);
//     } else {
//       router.push(`/search`);
//     }
//   };

//   return (
//     <form onSubmit={handleSearchSubmit} className="bg-white z-50 absolute top-20 w-[90%] md:w-full max-w-7xl mx-auto left-0 right-0 rounded-2xl md:rounded-full shadow-lg p-4 md:p-2 justify-center mb-8">
//       {/* Mobile-first layout: This div will be a flex column on mobile */}
//       <div className="flex flex-col space-y-4 md:hidden">
//         {/* Restaurant/Cuisine */}
//         <div className="flex flex-col space-y-1">
//           <label className="text-xs text-text-secondary text-left">
//             {activeTab === "restaurants" ? "Restaurant/Cuisine" : "Hotels"}
//           </label>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder={activeTab === "restaurants" ? "Enter Restaurant or Cuisine" : "Enter Hotels"}
//             className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//           />
//         </div>

//         {/* Date & Time in one row */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex flex-col space-y-1">
//             <label className="text-xs text-text-secondary text-left">
//               Date
//             </label>
//             <DateDropdown selectedDate={date} onChange={(d) => setDate(d)} />
//           </div>
//           <div className="flex flex-col space-y-1">
//             <label className="text-xs text-text-secondary text-left">
//               Time
//             </label>
//             <TimeDropdown selectedTime={time} onChange={setTime} />
//           </div>
//         </div>

//         {/* Guests */}
//         <div className="flex flex-col space-y-1">
//           <label className="text-xs text-text-secondary text-left">
//             Guests
//           </label>
//           <GuestDropdown onChange={(counts) => setGuests(counts)} />
//         </div>
        
//         {/* Search button (full width) */}
//         <div className="flex items-center justify-center w-full">
//           <button
//             type="submit"
//             className={`flex items-center w-full justify-center gap-2 cursor-pointer text-white rounded-lg px-6 py-4 transition ${
//               activeTab === "restaurants"
//                 ? "bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]"
//                 : "bg-gradient-to-b from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600"
//             }`}
//           >
//             <FiSearch className="w-5 h-5" />
//             <span className="text-base">Search</span>
//           </button>
//         </div>
//       </div>

//       {/* Desktop layout: This div is a grid and is hidden on mobile */}
//       <div className="hidden md:grid md:grid-cols-5 md:gap-4 md:items-center">
//         {/* Restaurant/Cuisine */}
//         <div className="flex flex-col justify-center border-r border-gray-200 pr-4">
//           <label className="text-xs text-text-secondary text-left mb-1">
//             {activeTab === "restaurants" ? "Restaurant/Cuisine" : "Hotels"}
//           </label>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder={activeTab === "restaurants" ? "Enter Restaurant or Cuisine" : "Enter Hotels"}
//             className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm md:text-base"
//           />
//         </div>

//         {/* Date */}
//         <div className="flex flex-col justify-center border-r border-gray-200 pr-4">
//           <label className="text-xs text-text-secondary text-left mb-1">
//             Date
//           </label>
//           <DateDropdown selectedDate={date} onChange={(d) => setDate(d)} />
//         </div>

//         {/* Time */}
//         <div className="flex flex-col justify-center border-r border-gray-200 pr-4">
//           <label className="text-xs text-text-secondary text-left mb-1">
//             Time
//           </label>
//           <TimeDropdown selectedTime={time} onChange={setTime} />
//         </div>

//         {/* Guests */}
//         <div className="flex flex-col justify-center border-r border-gray-200 pr-4">
//           <label className="text-xs text-text-secondary text-left mb-1">
//             Guests
//           </label>
//           <GuestDropdown onChange={(counts) => setGuests(counts)} />
//         </div>
        
//         {/* Search button */}
//         <div className="flex items-center justify-end w-full">
//           <button
//             type="submit"
//             className={`flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-3 transition ${
//               activeTab === "restaurants"
//                 ? "bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]"
//                 : "bg-gradient-to-b from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600"
//             }`}
//           >
//             <FiSearch className="w-5 h-5" />
//             <span className="text-sm md:text-base">Search</span>
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default SearchSection;