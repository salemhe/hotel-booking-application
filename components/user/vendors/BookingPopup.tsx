"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import DatePicker from "../ui/datepicker";
import { TimePicker } from "../ui/timepicker";
import { GuestPicker } from "../ui/guestpicker";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

const BookingPopup = ({ id }: { id: string }) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [request, setRequest] = useState<string>("");
  const [guests, setGuests] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date: date ? date.toISOString() : "",
      time,
      guests,
      specialRequest: request,
    });
    router.push(`/restaurants/${id}/reservations?${params.toString()}`);
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!date || !time) {
        throw new Error("Date and Time are required");
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success("Booked Succesfully");
    } catch (err) {
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
  const handlePopup = () => {
    setShow(true);
  };

  return (
    <div className="md:hidden">
      {show && (
        <div className="fixed inset-0 z-50 w-full px-4 bg-[#F9FAFB] pt-10">
            <button className="flex items-center gap-2 text-sm" onClick={() => setShow(false)}>
               <X className="text-gray-600" /> Exit
            </button>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex flex-col md:flex-row w-full gap-4">
              <DatePicker className="bg-white" value={date} onChange={setDate} />
              <TimePicker className="bg-white" value={time} onChange={setTime} />
            </div>
            <GuestPicker className="bg-white" value={guests} onChange={setGuests} />
            <div className="flex flex-col gap-y-3">
              <Label htmlFor="special-request">Special Request</Label>
              <Textarea
                id="special-request"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="e.g Birthday Celebration"
                className="resize-none h-[100px] font-normal bg-white border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div className="flex md:hidden fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
              <Button
                type="submit"
                disabled={!date || !time || isLoading}
                className="w-full rounded-xl bg-[#0A6C6D] hover:bg-[0A6C6D]/50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Loading
                  </>
                ) : (
                  "Reserve Table"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
      <div className="flex fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
        <Button
          className="w-full rounded-xl bg-[#0A6C6D] hover:bg-[0A6C6D]/50"
          onClick={handlePopup}
        >
          Reserve Table
        </Button>
      </div>
    </div>
  );
};

export default BookingPopup;
