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
    setGuestCount(searchQuery.guests)
    setSpecialRequest(searchQuery.specialRequest)
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
    <div className="min-h-screen mb-[65px] bg-gray-50">
      <ReservationHeader title="Reservation Details" index={1} />

      <div className="max-w-4xl mx-auto  px-4 py-15 space-y-6">
        <div className="max-w-[500px]">
          <div className="flex gap-4">
            <div className="relative w-32 h-24 rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src={vendor?.profileImages[0].url || "/hero-bg.png"}
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                {vendor?.businessName || "Restaurant Name"}
              </h2>
              <div className="flex items-start gap-1 text-gray-600 mb-2">
                <div>
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm">
                  {vendor?.address || "123 Main St, City, Country"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#F0AE02] text-[#F0AE02]" />
                <span className="text-sm font-medium">
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
          <div className="mb-6">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
      <div className="w-full bg-white border-t border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row justify-between gap-2 items-center max-w-4xl mx-auto p-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="flex items-center hover:bg-transparent text-[#0A6C6D] hover:text-[#0A6C6D] cursor-pointer gap-2"
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
