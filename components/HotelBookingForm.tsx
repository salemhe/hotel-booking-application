"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "./ui/label";
// import { TimePicker } from "./ui/timepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useBookingData } from "../hooks/useBookingData";
import { bookingStorage } from "../utils/bookingStorage";
import { Restaurant } from "../types/user/restaurant";

const HotelBookingForm = ({ id, restaurant }: { id: string; restaurant?: Restaurant }) => {
  const [date, setDate] = useState<Date>();
  const [date2, setDate2] = useState<Date>();
  const [request, setRequest] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { bookingData, saveBookingData } = useBookingData(id);

  // Load existing booking data from localStorage on component mount
  useEffect(() => {
    if (bookingData) {
      setDate(bookingData.checkInDate ? new Date(bookingData.checkInDate) : undefined);
      setDate2(bookingData.checkOutDate ? new Date(bookingData.checkOutDate) : undefined);
      setGuests(bookingData.guests || "");
      setRequest(bookingData.specialRequest || "");
    }
  }, [bookingData]);

  // Save form data to localStorage
  const saveFormData = useCallback(() => {
    if (date && date2 && guests) {
      const bookingDataToSave = {
        hotelId: id,
        checkInDate: date.toISOString(),
        checkOutDate: date2.toISOString(),
        guests,
        specialRequest: request,
        hotelInfo: restaurant ? {
          businessName: restaurant.businessName,
          address: restaurant.address,
          rating: restaurant.rating,
          reviews: restaurant.reviews,
          profileImages: restaurant?.profileImages?.map(img => img.url) ?? [],
          price: 150000, // You might want to get this from the restaurant data
        } : undefined,
      };
      saveBookingData(bookingDataToSave);
    }
  }, [date, date2, guests, request, id, restaurant, saveBookingData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", { date, date2, guests, request });
    
    // Save final form data
    const saveResult = saveFormData();
    console.log("Save form data result:", saveResult);
    
    // Check if data was saved properly
    const savedData = bookingStorage.getBookingDataForHotel(id);
    console.log("Saved booking data:", savedData);
    console.log("Validation result:", savedData ? bookingStorage.validateBookingData(savedData) : false);
    
    const paymentUrl = `/hotels/${id}/payment`;

    // Check if user is authenticated
    try {
      const isAuthenticated = await AuthService.isAuthenticated();
      console.log("Authentication check result:", isAuthenticated);
      
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login");
        router.push(`/auth/user/login?redirect=${encodeURIComponent(paymentUrl)}`);
        return;
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      // If authentication check fails, redirect to login
      router.push(`/user-login?redirect=${encodeURIComponent(paymentUrl)}`);
      return;
    }

    setIsLoading(true);
    try {
      if (!date || !date2) {
        throw new Error("Date and Time are required");
      }
      
      toast.success("Booking data saved successfully");
      console.log("Navigating to:", paymentUrl);
      
      // Add a small delay to ensure data is saved before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push(paymentUrl);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred";
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const SvgIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <g clipPath="url(#clip0_96_1657)">
        <path
          fill="#E0B300"
          fillRule="evenodd"
          d="M6.27 1.932a2.67 2.67 0 0 1 3.347-.09l.113.09.25.213c.183.156.404.26.64.3l.12.015.328.027A2.67 2.67 0 0 1 13.5 4.799l.014.133.027.33c.019.238.101.467.24.663l.073.095.215.25a2.666 2.666 0 0 1 .09 3.347l-.09.114-.214.25c-.156.183-.26.404-.3.64l-.015.119-.026.329a2.666 2.666 0 0 1-2.312 2.432l-.134.014-.329.026a1.33 1.33 0 0 0-.664.24l-.094.074-.252.213a2.666 2.666 0 0 1-3.346.092l-.113-.09-.25-.215a1.33 1.33 0 0 0-.64-.3l-.12-.014-.328-.027A2.666 2.666 0 0 1 2.5 11.204l-.014-.134-.027-.33a1.33 1.33 0 0 0-.24-.663l-.074-.095-.214-.251a2.67 2.67 0 0 1-.09-3.347l.09-.112.214-.251c.155-.183.26-.404.3-.64l.014-.119.027-.328A2.67 2.67 0 0 1 4.798 2.5l.133-.014.33-.027c.239-.019.468-.102.664-.24l.094-.074zm3.397 6.735a1 1 0 1 0 0 2 1 1 0 0 0 0-2M9.529 5.53l-4 4a.667.667 0 1 0 .942.943l4-4a.667.667 0 0 0-.942-.943m-3.196-.195a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
          clipRule="evenodd"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_96_1657">
          <path fill="#fff" d="M0 0h16v16H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#E5E7EB]" data-booking-form>
      <div className="w-96 h-7 inline-flex justify-between items-center">
        <div className="flex justify-start items-center gap-1">
          <div className="justify-start text-gray-900 text-xl font-bold font-['Inter'] leading-relaxed">#150,000</div>
          <div className="justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-tight">/night</div>
        </div>
        <div className="h-7 px-2 rounded-lg  outline-1 outline-offset-[-1px] outline-yellow-500 inline-flex flex-col justify-center items-center gap-2">
          <div className="inline-flex justify-start items-center gap-1.5">
            <div className="w-4 h-4 relative overflow-hidden">
              <SvgIcon />
            </div>
            <div className="justify-start text-gray-900 text-xs font-medium font-['Inter'] leading-none tracking-tight">20% off</div>
          </div>
        </div>
      </div>
      <div className="w-96 justify-start text-zinc-600 text-sm font-bold font-['Inter'] leading-tight">Prices includes all fees</div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div className="flex flex-col md:flex-row w-full gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-[#F9FAFB] border border-[#E5E7EB] flex-col items-start rounded-xl px-6 min-w-[150px] flex h-[60px]",
                  !date && "text-muted-foreground"
                )}
              >
                <Label htmlFor="date" className="text-black">
                  Check in Date
                </Label>
                {date ? format(date, "do MMM, yyyy") : "Select date"}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-[#F9FAFB] border border-[#E5E7EB] flex-col items-start rounded-xl px-6 min-w-[150px] flex h-[60px]",
                  !date2 && "text-muted-foreground"
                )}
              >
                <Label htmlFor="date" className="text-black">
                  Check out Date
                </Label>
                {date2 ? format(date2, "do MMM, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                selected={date2}
                onSelect={setDate2}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger
            className={cn(
              "w-full text-left font-normal bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-6 min-w-[150px] flex h-[60px]",
              !request && "text-muted-foreground"
            )}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="time" className="text-black">
                Guest
              </Label>
              <SelectValue placeholder="Number of guests" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4].map((t) => (
              <SelectItem key={t} value={`${t}`}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="special-request">Special Request</Label>
          <Textarea
            id="special-request"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="e.g Birthday Celebration"
            className="resize-none h-[100px] font-normal bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl"
          />
        </div>
        <Button
          type="submit"
          disabled={!date || !date2 || isLoading}
          className="w-full rounded-xl bg-[#0A6C6D] hover:bg-[0A6C6D]/50"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Loading
            </>
          ) : (
            "Reserve Room"
          )}
        </Button>
      </form>
    </div>
  );
};

export default HotelBookingForm;
