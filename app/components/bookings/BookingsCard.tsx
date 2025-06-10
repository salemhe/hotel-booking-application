import { Edit, Hotel } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

interface BookingProps {
  name: string;
  type: string;
  status: string;
  location: string;
  guests: number;
  rooms?: number;
  startTime: string;
  endTime: string;
  image: string;
}

const BookingsCard = ({ data }: { data: BookingProps }) => {
  return (
    <div className="flex flex-col divide-[#E5E7EB] bg-white border-2 border-[#E5E7EB] overflow-clip rounded-2xl divide-y-2">
      <div className="flex items-start justify-between pb-8 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 mt-4 ml-4 w-full">
          <div className="h-[140px] w-full sm:w-[140px] relative border-2 rounded-lg border-[#606368] overflow-clip">
            <Image
              src="/hero-bg.jpg"
              alt="Bookings Image"
              fill
              className="object-cover "
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-[#111827] font-medium text-sm">
              {data.name}
            </h2>
            <p className="text-[#606368] flex gap-2 items-center text-sm">
              <span>
                <Hotel className="size-5" />
              </span>{" "}
              {data.type === "Hotel" ? "Hotels" : "Restaurants"}
            </p>
            <p className="text-[#606368] flex gap-2 items-center text-sm">
              <span>
                <Hotel className="size-5" />
              </span>{" "}
              {data.startTime} - {data.endTime}
            </p>
            <p className="text-[#606368] flex gap-2 items-center text-sm">
              <span>
                <Hotel className="size-5" />
              </span>{" "}
              {data.location}
            </p>
            <p className="text-[#606368] flex gap-2 items-center text-sm">
              <span>
                <Hotel className="size-5" />
              </span>{" "}
              {data.type === "Hotel" ? `${data.guests} Guests, ${data.rooms} Rooms` : `${data.guests} Guests`}
            </p>
          </div>
        </div>
        <div className="bg-[#E9EBF3] border-b border-l rounded-bl-2xl p-3 flex gap-4 border-[#B9C2DB] ">
          <button className="cursor-pointer">
            <Edit className="size-5 text-[#606368]" />
          </button>
          <button className="cursor-pointer">
            <Edit className="size-5 text-[#606368]" />
          </button>
          <button className="cursor-pointer">
            <Edit className="size-5 text-[#606368]" />
          </button>
        </div>
      </div>
      <div className="p-5 flex justify-between gap-5 items-center">
        <div className="border border-[#37703F] text-[#111827] bg-[#7EFFBD] rounded-full px-3 py-1 text-xs">
          Completed
        </div>
        <Button className="rounded-xl bg-[#0A6C6D] hover:bg-[#0A6C6D]/70 cursor-pointer">
          Leave Review
        </Button>
      </div>
    </div>
  );
};

export default BookingsCard;
