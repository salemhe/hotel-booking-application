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
  // Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import ItemSelector from "./ItemSelector";
import { ScrollArea } from "./ui/scroll-area";

import { AuthService } from "@/services/auth.services";
type restaurants = {
  isVerified: boolean;
  _id: string;
  businessName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  profileImage: string;
  services: string[];
};

export type Menu = {
  _id: string;
  vendor: string;
  dishName: string;
  dishImage: string;
  description: string;
  price: number;
  category: string;
  itemImage: string;
  itemName: string;
};

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
  const [partySize, setPartySize] = useState("");
  const [tableType, setTableType] = useState("");
  const [meal, setMeal] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<Menu[] | null>(null);
  const [location, setLocation] = useState("");
  const [restaurantMenu, setRestaurantMenu] = useState<Menu[] | null>(null);
  const router = useRouter();
  const [restaurantData, setRestaurantData] = useState<restaurants | null>(null);
  const [errors, setErrors] = useState("");
  const { toast } = useToast();
  const authUser = AuthService.getUser(); 
  const handleSelectionChange = (selected: string[]) => {
    setMeal(selected[0]);
  };

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

  const fetchRestaurantData = async (id: string) => {
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
      const response = await API.get(`/vendors/menus?vendorId=${id}`);
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
    const fetchData = async () => {
      const restaurant = await fetchRestaurantData(id);
      const menuData = await fetchMenu(id);
      
      if (restaurant) {
        setRestaurantData(restaurant);
        setLocation(restaurant.address);
      }
      
      if (menuData) {
        setRestaurantMenu(menuData.menus);
        setMenu(menuData.menus);
      }
    };
    
    fetchData();
  }, [id]); 
  if (!restaurantData || errors) {
    return <div className="container mx-auto py-8 px-4">Error: {errors}</div>;
  }

  // const menuItem = [
  //   { name: "Main Course", value: "mainCourse" },
  //   { name: "Dessert", value: "dessert" },
  //   { name: "Appetizer", value: "appetizer" },
  //   { name: "Lunch", value: "lunch" },
  //   { name: "Drink", value: "drink" },
  // ];

  const tableTypes = [
    { name: "2-seats", value: "2-seats" },
    { name: "4-seats", value: "4-seats" },
    { name: "6-seats", value: "6-seats" },
    { name: "8-seats", value: "8-seats" },
  ];

  // Modify the restaurant object to include images
  const restaurant = {
    id,
    name: restaurantData.businessName,
    cuisine: "Restaurant",
    rating: 4.5,
    reviews: 328,
    priceRange: "₦₦",
    address: restaurantData.address,
    phone: restaurantData.phone,
    website: "https://example.com",
    hours: "Mon-Sat: 11am-10pm, Sun: 12pm-9pm",
    description: "Experience authentic cuisine in a cozy, romantic atmosphere. Our chef brings amazing flavors to your plate with fresh, locally-sourced ingredients and traditional recipes.",
    images: [
      "/hero-bg.jpg",
      "/hero-bg.jpg",
      "/hero-bg.jpg",
    ],
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    // 1) Basic validation
    if (!meal || !tableType || !partySize || !date || !time || !specialRequests) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
  
    try {
      // 2) Format date
      const formattedDate = format(date as Date, "yyyy-MM-dd");
      
      // 3) Get selected menu item details
      const selectedMenuItem = menu!.find((m) => m._id === meal);
      
      if (!selectedMenuItem) {
        throw new Error("Selected menu item not found");
      }
      
      // 4) Extract table number from tableType
      const tableNumber = Number(tableType.replace(/\D/g, ''));
      
      // 5) Make API request - match payload exactly to documentation
      const payload = {
        vendorId: data._id,
        businessName: data.businessName,
        location: location,
        partySize: Number(partySize),
        menuId: meal,
        tableNumber: tableNumber,
        tableType: tableType,
        meal: selectedMenuItem.dishName || selectedMenuItem.itemName,
        pricePerTable: selectedMenuItem.price,
        guests: Number(partySize),
        totalPrice: selectedMenuItem.price,
        specialRequest: specialRequests,
        image: selectedMenuItem.itemImage || "/hero-bg.jpg",
        date: formattedDate
      };
      
      // Make sure the user is authenticated before making the request
      if (!authUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make a reservation",
          variant: "destructive",
        });
        router.push('/login');
        setLoading(false);
        return;
      }
      
      // Add authorization header
      const response = await API.post("/users/bookings", payload);
      const booking = response.data.booking;
      
      // 6) Create reservation details for payment page
      const reservationDetails = {
        bookingId: booking._id,
        menuId: meal,
        restaurantId: data._id,
        restaurantName: data.businessName,
        restaurantAddress: data.address,
        date: formattedDate,
        time,
        guests: Number(partySize),
        tableNumber: tableNumber,
        menuItem: selectedMenuItem.dishName || selectedMenuItem.itemName,
        menuPrice: selectedMenuItem.price,
        specialRequests: specialRequests,
        restaurantImage: "/hero-bg.jpg",
      };
  
      // 7) Store details for payment page
      sessionStorage.setItem(
        "pendingReservation",
        JSON.stringify(reservationDetails)
      );
  
      toast({
        title: "Reservation Created!",
        description: `Your table for ${partySize} is reserved. Proceeding to payment.`,
      });
      
      // 8) Redirect to payment page
      router.push(`/userDashboard/payment/${booking._id}`);
      
    } catch (err) {
      console.error("Reservation error:", err);
      
      let errorMessage = "Failed to create reservation. Please try again.";
      
      if (err instanceof AxiosError && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast({
        title: "Reservation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/userDashboard/search")}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Restaurants
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                {restaurantData.businessName}
              </CardTitle>
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
               
                  {/* {restaurantData.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${restaurant.name} - Image ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full rounded-lg"
                      />
                    </CarouselItem>
                  ))} */}
                    <CarouselItem >
                      <Image
                        src={restaurantData.profileImage || "/hero-bg.jpg"}
                        alt={`${restaurant.name}`}
                        width={600}
                        height={400}
                        className="w-full rounded-lg"
                      />
                    </CarouselItem>
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
                  <p>{restaurantData.address}{restaurantData.location}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <p>{restaurantData.phone}</p>
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
              <Tabs defaultValue={restaurantMenu?.[0]?.category || ""} className="w-full">
                <TabsList className="flex flex-wrap w-full h-auto">
                  {restaurantMenu &&
                    [...new Set(restaurantMenu.map((item) => item.category))].map((category, i) => (
                      <TabsTrigger key={i} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                </TabsList>

                {restaurantMenu && restaurantMenu.length > 0 ? (
                  [...new Set(restaurantMenu.map((item) => item.category))].map((category) => (
                    <TabsContent key={category} value={category}>
                      <ScrollArea className="h-72 rounded-md">
                        {restaurantMenu
                          .filter((item) => item.category === category)
                          .map((i) => (
                            <Card key={i._id} className="space-y-2 mb-3">
                              <CardContent className="flex flex-col w-full p-2">
                                <div className="flex gap-4">
                                  <Image
                                    src={i.itemImage || i.dishImage || "/hero-bg.jpg"}
                                    alt={i.itemName || i.dishName}
                                    width={100}
                                    height={100}
                                    className="rounded-md object-cover h-[100px] w-[100px]"
                                  />
                                  <div>
                                    <h2 className="font-semibold">{i.dishName || i.itemName}</h2>
                                    <span className="text-muted-foreground">
                                      ₦{i.price.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full flex flex-col mt-2">
                                  <h3 className="font-semibold text-muted-foreground">Description:</h3>
                                  <p className=" break-words">{i.description}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </ScrollArea>
                    </TabsContent>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <FolderX size={150} />
                    <p className="text-gray-500 text-center">
                      No menu available at the moment. Please check back later.
                    </p>
                  </div>
                )}
              </Tabs>
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
                  {/* Date Input */}
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
                  
                  {/* Time Input */}
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
                  
                  {/* Party Size */}
                  <div>
                    <Label htmlFor="partySize">Number of Guests</Label>
                    <Select value={partySize} onValueChange={setPartySize}>
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
                  
                  {/* Table Type */}
                  <div>
                    <Label htmlFor="tableType">Table Type</Label>
                    <Select value={tableType} onValueChange={setTableType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select table type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tableTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Meal Selection */}
                  <div>
                    <Label htmlFor="meal">Select Meal</Label>
                    {menu && (
                      <ItemSelector
                        items={restaurantMenu}
                        onSelectionChange={handleSelectionChange}
                      />
                    )}
                  </div>
                  
                  {/* Location (Optional field - can be edited) */}
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Restaurant location"
                    />
                  </div>
                  
                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      placeholder="Any special requests for your visit? (e.g., Anniversary celebration)"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
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