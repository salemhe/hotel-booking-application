"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { cn } from "@/app/lib/utils";
import { format } from "date-fns";
import { Label } from "./ui/label";
import { TimePicker } from "./ui/timepicker";
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

const BookingForm = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [request, setRequest] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!date || !time) {
        throw new Error("Date and Time are required");
      }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    toast.success("Booked Succesfully")
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

  return (
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
                Date
              </Label>
              {date ? format(date, "PPP") : "Select date"}
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
        <TimePicker value={time} onChange={setTime} />
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
    </form>
  );
};

export default BookingForm;
