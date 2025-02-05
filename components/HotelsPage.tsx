"use client";

import { useEffect, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Wifi,
  Coffee,
  Dumbbell,
  PocketIcon as Pool,
  Star,
  ChevronLeft,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

export default function HotelPage({ id }: { id: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("");
  const [rooms, setRooms] = useState("");
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // In a real application, you would fetch the hotel data based on the ID
  const hotel = {
    id,
    name: "Grand Luxury Hotel",
    type: "Luxury",
    rating: 4.8,
    reviews: 512,
    priceRange: "$$$",
    address: "456 Ocean Ave, Beachtown, USA",
    description:
      "Experience unparalleled luxury in our beachfront hotel. Enjoy stunning ocean views, world-class amenities, and impeccable service for an unforgettable stay.",
    images: [
      "/hero-bg.jpg",
      "/hero-bg.jpg",
      "/hero-bg.jpg",
      // "/placeholder.svg?height=400&width=600",
      // "/placeholder.svg?height=400&width=600",
      // "/placeholder.svg?height=400&width=600",
    ],
    amenities: [
      "Free Wi-Fi",
      "Swimming Pool",
      "Fitness Center",
      "Spa",
      "Restaurant",
      "Room Service",
    ],
    rooms: [
      {
        type: "Standard Room",
        price: 199.99,
        description: "Comfortable room with a queen-size bed and city view.",
      },
      {
        type: "Deluxe Room",
        price: 299.99,
        description:
          "Spacious room with a king-size bed and partial ocean view.",
      },
      {
        type: "Suite",
        price: 499.99,
        description:
          "Luxurious suite with a separate living area and full ocean view.",
      },
    ],
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the booking logic
    console.log("Booking:", { checkIn, checkOut, guests, rooms });
    toast({
      title: "Booking Confirmed!",
      description: `Your stay from ${checkIn} to ${checkOut} for ${guests} guests in ${rooms} room(s) has been booked.`,
    });
    // Redirect to confirmation page
    router.push(`/booking-confirmation/${id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => router.push("hotels")} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Hotels
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{hotel.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{hotel.type}</Badge>
                  <Badge variant="secondary">{hotel.priceRange}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{hotel.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({hotel.reviews} reviews)
                    </span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full max-w-xs mx-auto" setApi={setApi}>
                <CarouselContent>
                  {hotel.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${hotel.name} - Image ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
              <div className="py-2 text-center text-sm text-muted-foreground">
                Image {current} of {count}
              </div>

              <p className="mt-4 text-gray-600">{hotel.description}</p>

              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <p>{hotel.address}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">
                      {amenity === "Free Wi-Fi" && (
                        <Wifi className="h-4 w-4 mr-1" />
                      )}
                      {amenity === "Swimming Pool" && (
                        <Pool className="h-4 w-4 mr-1" />
                      )}
                      {amenity === "Fitness Center" && (
                        <Dumbbell className="h-4 w-4 mr-1" />
                      )}
                      {amenity === "Restaurant" && (
                        <Coffee className="h-4 w-4 mr-1" />
                      )}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Room Types</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={hotel.rooms[0].type}>
                <TabsList>
                  {hotel.rooms.map((room) => (
                    <TabsTrigger key={room.type} value={room.type}>
                      {room.type}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {hotel.rooms.map((room) => (
                  <TabsContent key={room.type} value={room.type}>
                    <div className="space-y-2">
                      <p className="font-semibold">
                        ${room.price.toFixed(2)} / night
                      </p>
                      <p>{room.description}</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book Your Stay</CardTitle>
              <CardDescription>
                Reserve your room now for the best rates!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal border border-gray-300 rounded-lg",
                            !checkIn && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(checkIn) => checkIn < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal border border-gray-300 rounded-lg",
                            !checkOut && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(checkOut) => checkOut < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5", "6"].map((n) => (
                          <SelectItem key={n} value={n}>
                            {n} {n === "1" ? "guest" : "guests"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rooms">Number of Rooms</Label>
                    <Select value={rooms} onValueChange={setRooms}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of rooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4"].map((n) => (
                          <SelectItem key={n} value={n}>
                            {n} {n === "1" ? "room" : "rooms"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    Book Now
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                By making a booking, you agree to our terms and conditions.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
