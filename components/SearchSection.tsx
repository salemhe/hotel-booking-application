// components/SearchSection.tsx
"use client";

import React from "react";
import { FiSearch, FiCalendar, FiClock, FiUsers } from "react-icons/fi";

export default function SearchSection() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <FiCalendar className="min-w-[20px] h-5 text-text-secondary" />
          <input
            type="date"
            className="w-full focus:outline-none text-text-primary text-sm sm:text-base"
          />
        </div>

        <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <FiClock className="min-w-[20px] h-5 text-text-secondary" />
          <select className="w-full focus:outline-none text-text-primary bg-transparent text-sm sm:text-base">
            <option>12:00 PM</option>
            <option>12:30 PM</option>
            <option>1:00 PM</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <FiUsers className="min-w-[20px] h-5 text-text-secondary" />
          <select className="w-full focus:outline-none text-text-primary bg-transparent text-sm sm:text-base">
            <option>2 People</option>
            <option>3 People</option>
            <option>4 People</option>
          </select>
        </div>

        <div className="flex items-center justify-center sm:justify-end w-full">
          <button
            className="w-full sm:w-auto bg-primary flex justify-center items-center gap-2 rounded-full text-white px-6 py-3 sm:py-2
                       bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:opacity-90 transition-opacity"
            type="button"
          >
            <FiSearch className="w-5 h-5" />
            <span className="text-sm sm:text-base">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
