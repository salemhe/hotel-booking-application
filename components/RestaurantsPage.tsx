"use client";

import { useEffect, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Star,
  ChevronLeft,
  CalendarIcon,
  FolderX,
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
import API from "@/utils/axios";
import { AxiosError } from "axios";

type restaurants = {
  isVerified: boolean;
  _id: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
};

type Menu = [
  {
    _id: string;
    vendor: string;
    dishName: string;
    description: string;
    price: number;
    category: string;
    itemImage: string;
  }
];

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default function RestaurantPage({ id }: { id: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<Menu | null>(null);
  const router = useRouter();
  const [data, setData] = useState<restaurants | null>(null);
  const [errors, setErrors] = useState("");
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

  const fetchData = async (id: string) => {
    try {
      const response = await API.get(`/vendors/`);
      return response.data.find(
        (restaurant: restaurants) => restaurant._id === id
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("fetch error", error.message);
        setErrors(error.message);
      }
      return null;
    }
  };

  const fetchMenu = async (id: string) => {
    try {
      const response = await API.get(`/vendors/menus/${id}`);
      console.log("menu", response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("fetch error", error.message);
        setErrors(error.message);
      }
      return null;
    }
  };

  useEffect(() => {
    const data = async () => {
      const restaurant = await fetchData(id);
      const menu = await fetchMenu(id);
      setData(restaurant);
      setMenu(menu.menus);
    };
    data();
  }, [id]);

  if (!data) {
    return (
      <div className="container mx-auto py-8 px-4">
        {errors ? errors : <Loading />}
      </div>
    );
  }

  if (!data || errors) {
    return <div className="container mx-auto py-8 px-4">Error: {errors}</div>;
  }

  // In a real application, you would fetch the restaurant data based on the ID
  const restaurant = {
    id,
    name: "The Italian Place",
    cuisine: "Italian",
    rating: 4.5,
    reviews: 328,
    priceRange: "₦₦",
    address: "123 Main St, Anytown, USA",
    phone: "(555) 123-4567",
    website: "https://example.com",
    hours: "Mon-Sat: 11am-10pm, Sun: 12pm-9pm",
    description:
      "Experience authentic Italian cuisine in a cozy, romantic atmosphere. Our chef brings the flavors of Italy to your plate with fresh, locally-sourced ingredients and traditional recipes.",
    images: [
      "/hero-bg.jpg",
      "/hero-bg.jpg",
      "/hero-bg.jpg",
      // "/placeholder.svg?height=400&width=600",
      // "/placeholder.svg?height=400&width=600",
      // "/placeholder.svg?height=400&width=600",
    ],
    menu: [
      {
        category: "Appetizers",
        items: [
          { name: "Bruschetta", price: 8.99 },
          { name: "Caprese Salad", price: 10.99 },
        ],
      },
      {
        category: "Main Courses",
        items: [
          { name: "Spaghetti Carbonara", price: 15.99 },
          { name: "Margherita Pizza", price: 13.99 },
        ],
      },
      {
        category: "Desserts",
        items: [
          { name: "Tiramisu", price: 7.99 },
          { name: "Panna Cotta", price: 6.99 },
        ],
      },
    ],
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the reservation logic
    console.log("Reservation:", { date, time, guests });
    setLoading(true);
    try {
      const response = await API.post(`/users/bookings/`, {
        type: "restaurant",
        vendor: data._id,
        tableNumber: Math.floor(Math.random() * 10),
        guests: guests,
        menuId: menu ? menu[0]._id : "",
      });
      console.log("Reservation response:", response);
      toast({
        title: "Reservation Confirmed!",
        description: `Your table for ${guests} on ${date} at ${time} has been booked. your room number is ${response.data.booking.tableNumber}`,
      });
      // Redirect to confirmation page
      // router.push(`/userDashboard/booking`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error submitting reservation:", error.response?.data);
        toast({
          title: "Error",
          description:
            "There was a problem processing your reservation. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/restaurants")}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Restaurants
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{data.businessName}</CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{restaurant.cuisine}</Badge>
                  <Badge variant="secondary">{restaurant.priceRange}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{restaurant.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({restaurant.reviews} reviews)
                    </span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full max-w-xs mx-auto" setApi={setApi}>
                <CarouselContent>
                  {restaurant.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${restaurant.name} - Image ${index + 1}`}
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

              <p className="mt-4 text-gray-600">{restaurant.description}</p>

              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <p>{data.address}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <p>{data.phone}</p>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <a
                    href={restaurant.website}
                    className="text-blue-600 hover:underline"
                  >
                    {restaurant.website}
                  </a>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <p>{restaurant.hours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Menu</CardTitle>
            </CardHeader>
            <CardContent>
              {menu && menu.length > 0 ? (
                <Tabs defaultValue={menu[0].category}>
                  <TabsList>
                    {Array.from(new Set(menu.map((item) => item.category))).map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                    ))}
                  </TabsList>
                  {menu.map((item) => (
                  <TabsContent key={item._id} value={item.category}>
                    <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>{item.dishName}</span>
                      <span>₦{item.price.toFixed(2)}</span>
                    </li>
                    </ul>
                  </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <FolderX size={150} />
                  <p className="text-gray-500 text-center">
                    No menu available at the moment. Please check back later.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Make a Reservation</CardTitle>
              <CardDescription>
                Book your table now to avoid disappointment!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReservation}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal border border-gray-300 rounded-lg",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
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
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "18:00",
                          "18:30",
                          "19:00",
                          "19:30",
                          "20:00",
                          "20:30",
                          "21:00",
                        ].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => (
                          <SelectItem key={n} value={n}>
                            {n} {n === "1" ? "guest" : "guests"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    {loading ? "Loading..." : "Reserve Table"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                By making a reservation, you agree to our terms and conditions.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
