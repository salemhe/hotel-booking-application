"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, Clock, Users, Utensils } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { BookingService } from "@/services/booking.services";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function EditBookingForm({ bookingId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    guests: 0,
    checkIn: null,
    checkOut: null,
    tableNumber: null,
    roomNumber: null,
  });

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      
      try {
        setIsLoading(true);
        // In a real app, you'd fetch the specific booking by ID
        // const data = await BookingService.getBookingById(bookingId);
        
        // Since we don't have that endpoint in the documentation,
        // we could get all bookings and filter, or mock the data for now
        const data = {
          _id: bookingId,
          type: "restaurant", // or "hotel"
          vendor: "vendor123",
          tableNumber: 5,
          roomNumber: null,
          guests: 4,
          checkIn: new Date().toISOString(),
          checkOut: new Date(Date.now() + 86400000).toISOString(), // +1 day
          status: "Pending"
        };
        
        setBooking(data);
        setFormData({
          guests: data.guests || 0,
          checkIn: data.checkIn ? new Date(data.checkIn) : null,
          checkOut: data.checkOut ? new Date(data.checkOut) : null,
          tableNumber: data.tableNumber || null,
          roomNumber: data.roomNumber || null,
        });
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Failed to load booking details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!booking) return;
    
    try {
      setIsLoading(true);
      
      // Prepare the update data based on booking type
      const updateData = {
        type: booking.type,
        vendor: booking.vendor,
        guests: formData.guests,
      };
      
      if (booking.type === 'hotel') {
        updateData.roomNumber = formData.roomNumber;
        updateData.checkIn = formData.checkIn.toISOString();
        updateData.checkOut = formData.checkOut.toISOString();
      } else if (booking.type === 'restaurant') {
        updateData.tableNumber = formData.tableNumber;
      }
      
      await BookingService.updateBooking(bookingId, updateData);
      
      toast.success("Booking updated successfully");
      router.push(`/userDashboard/booking/${bookingId}`);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-8">
        <p>Booking not found. Please check the booking ID and try again.</p>
        <Button onClick={() => router.push('/userDashboard/bookings')} className="mt-4">
          Back to Bookings
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Booking</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Fields */}
            <div className="space-y-4">
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-primary mt-2" />
                <div className="w-full">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => handleFormChange('guests', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            {/* Type-specific Fields */}
            {booking.type === 'restaurant' && (
              <div className="space-y-4">
                <div className="flex items-start">
                  <Utensils className="h-5 w-5 mr-3 text-primary mt-2" />
                  <div className="w-full">
                    <Label htmlFor="tableNumber">Table Number</Label>
                    <Input
                      id="tableNumber"
                      type="number"
                      min="1"
                      value={formData.tableNumber}
                      onChange={(e) => handleFormChange('tableNumber', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {booking.type === 'hotel' && (
              <>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-primary mt-2" />
                    <div className="w-full">
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input
                        id="roomNumber"
                        type="number"
                        min="1"
                        value={formData.roomNumber}
                        onChange={(e) => handleFormChange('roomNumber', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-primary mt-2" />
                    <div className="w-full">
                      <Label>Check-In Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left mt-1"
                          >
                            {formData.checkIn ? format(formData.checkIn, "PPP") : "Select date..."}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.checkIn}
                            onSelect={(date) => handleFormChange('checkIn', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-primary mt-2" />
                    <div className="w-full">
                      <Label>Check-Out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left mt-1"
                          >
                            {formData.checkOut ? format(formData.checkOut, "PPP") : "Select date..."}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.checkOut}
                            onSelect={(date) => handleFormChange('checkOut', date)}
                            disabled={(date) => date < (formData.checkIn || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Booking"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}