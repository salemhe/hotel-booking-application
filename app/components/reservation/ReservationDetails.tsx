"use client";

import Image from "next/image";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Textarea } from "@/app/components/ui/textarea";
import { useReservations } from "@/app/contexts/ReservationContext";
import ReservationHeader from "./ReservationHeader";
import { TimePicker } from "../restaurants/ui/timepicker";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import API from "@/app/lib/api/userAxios";
import DatePicker from "../restaurants/ui/datepicker";
import { GuestPicker } from "../restaurants/ui/guestpicker";

export default function ReservationDetails({
  id,
  searchQuery,
}: {
  id: string;
  searchQuery: {
    date: string;
    time: string;
    guests: string;
    specialRequest: string;
  };
}) {
  const {
    selectedOccasion,
    setSelectedOccasion,
    seatingPreference,
    setSeatingPreference,
    guestCount,
    setGuestCount,
    specialRequest,
    setSpecialRequest,
    occasions,
    setPage,
    date,
    setDate,
    time,
    setTime,
    setVendor,
    vendor,
  } = useReservations();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/vendors/${id}`);
      setVendor(response.data);
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
    setDate(new Date(searchQuery.date));
    setTime(searchQuery.time);
    setGuestCount(searchQuery.guests);
    setSpecialRequest(searchQuery.specialRequest);
  }, []);
  const router = useRouter();

  const preferences = [
    {
      name: "Indoor",
      value: "indoor",
    },
    {
      name: "Outdoor",
      value: "outdoor",
    },
    {
      name: "No Preference",
      value: "no-preference",
    },
  ];

  const handleContinue = () => {
    if (!date || !seatingPreference || !guestCount || !time) {
      toast.error("Fill the required field");
      return;
    }
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mb-[65px] mt-[20px] md:mt-0 bg-gray-50">
      <ReservationHeader title="Reservation Details" index={1} />
      <div className="md:hidden flex items-center gap-3 px-4 py-3 ">
        <button onClick={() => router.push(`/restaurants/${id}`)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_2317_1082)">
              <path
                d="M3.03 9.41084C2.87377 9.56711 2.78601 9.77903 2.78601 10C2.78601 10.221 2.87377 10.4329 3.03 10.5892L7.74417 15.3033C7.90133 15.4551 8.11184 15.5391 8.33033 15.5372C8.54883 15.5353 8.75784 15.4477 8.91235 15.2932C9.06685 15.1387 9.1545 14.9297 9.15639 14.7112C9.15829 14.4927 9.0743 14.2822 8.9225 14.125L5.63083 10.8333H16.6667C16.8877 10.8333 17.0996 10.7455 17.2559 10.5893C17.4122 10.433 17.5 10.221 17.5 10C17.5 9.77899 17.4122 9.56703 17.2559 9.41075C17.0996 9.25447 16.8877 9.16667 16.6667 9.16667H5.63083L8.9225 5.875C9.0743 5.71783 9.15829 5.50733 9.15639 5.28883C9.1545 5.07034 9.06685 4.86133 8.91235 4.70682C8.75784 4.55231 8.54883 4.46467 8.33033 4.46277C8.11184 4.46087 7.90133 4.54487 7.74417 4.69667L3.03 9.41084Z"
                fill="#111827"
              />
            </g>
            <defs>
              <clipPath id="clip0_2317_1082">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
        Reservation Details
      </div>

      <div className="max-w-4xl mx-auto  px-4 py-5 md:py-15 space-y-6">
        <div className="max-w-[500px]">
          <div className="flex gap-4">
            <div className="relative size-[64px] md:w-32 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src={vendor?.profileImages?.[0]?.url || "/hero-bg.png"}
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-sm md:text-xl font-semibold mb-2">
                {vendor?.businessName || "Restaurant Name"}
              </h2>
              <div className="flex items-start gap-1 text-gray-600 mb-2">
                <div>
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-[12px] md:text-sm truncate w-[210px] sm:w-full">
                  {vendor?.address || "123 Main St, City, Country"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#F0AE02] text-[#F0AE02]" />
                <span className="text-[12px] md:text-sm font-medium">
                  {vendor?.rating || "4.8"} (
                  {vendor?.reviews.toLocaleString() || "1,000"} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border">
          <div className=" divide-y">
            <div className="flex p-4">
              <h3 className="text-lg font-semibold">Reservation Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <DatePicker value={date} onChange={setDate} />
              <TimePicker value={time} onChange={setTime} />
              <GuestPicker value={guestCount} onChange={setGuestCount} />
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="mb-6 hidden md:block">
            <h3 className="text-lg font-semibold mb-2">
              Let&apos;s Plan For Your Visit
            </h3>
            <p className="text-sm text-gray-600">
              Kindly provide answers to the question below to enable us serve
              you better
            </p>
          </div>

          <div className="divide-y border bg-white rounded-2xl">
            <div className="p-4">
              <h4 className="text-lg font-semibold">Preferences</h4>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Special Occasion?
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {occasions.map((occasion) => (
                    <button
                      key={occasion}
                      onClick={() => setSelectedOccasion(occasion)}
                      className={`p-3 text-sm border rounded-xl bg-[#F9FAFB] cursor-pointer transition-colors ${
                        selectedOccasion === occasion
                          ? "border-[#0A6C6D] text-[#0A6C6D]"
                          : "border-[#E5E7EB]  hover:border-[#d7d9dd] text-[#606368]"
                      }`}
                    >
                      {occasion}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">
                  Seating Preference
                </Label>
                <RadioGroup
                  value={seatingPreference}
                  onValueChange={setSeatingPreference}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {preferences.map((preference, i) => (
                      <Label
                        key={i}
                        htmlFor={preference.value}
                        className="text-sm cursor-pointer"
                      >
                        <div className="flex items-center gap-2 p-3 border bg-[#F9FAFB] border-[#E5E7EB] rounded-xl">
                          <RadioGroupItem
                            className="border-[#0A6C6D]"
                            value={preference.value}
                            id={preference.value}
                          />
                          {preference.name}
                        </div>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <div className="relative">
                <Label
                  htmlFor="special-request"
                  className="text-sm font-medium mb-2 block"
                >
                  Special Request (Optional)
                </Label>
                <Textarea
                  id="special-request"
                  placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
                  value={specialRequest}
                  maxLength={500}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="min-h-[100px] bg-[#F9FAFB] border text-sm border-[#E5E7EB] resize-none rounded-xl"
                />
                <p className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {specialRequest.length}/500
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full fixed bottom-0 left-0 bg-white border-t border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row justify-between gap-2 items-center max-w-4xl mx-auto p-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="md:flex items-center hover:bg-transparent text-[#0A6C6D] hover:text-[#0A6C6D] cursor-pointer gap-2 hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Restaurant Page
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 px-8 w-full max-w-xs rounded-xl cursor-pointer"
            onClick={handleContinue}
            disabled={!date || !seatingPreference || !guestCount || !time}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
