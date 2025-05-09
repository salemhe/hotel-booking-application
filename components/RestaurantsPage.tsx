"use client";

import { useEffect, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  // Clock,
  Phone,
  // Globe,
  // Star,
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
// import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import API from "@/utils/userAxios";
import { AxiosError } from "axios";
import ItemSelector from "./ItemSelector";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { AuthService } from "@/services/userAuth.services";

type restaurants = {
  isVerified: boolean;
  _id: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  profileImage: string;
  services: string[];
};

type Menu = {
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
  const [guests, setGuests] = useState("");
  const [seats, setSeats] = useState("");
  const [partySize, setPartySize] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [image, setImage] = useState<File>();
  const [tableType, setTableType] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [meals, setMeals] = useState<string[]>([""]);
  const [mealId, setMealId] = useState("");
  const [menu, setMenu] = useState<Menu[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [restaurantMenu, setRestaurantMenu] = useState<Menu[] | null>(null);
  const router = useRouter();
  const [restaurantData, setRestaurantData] = useState<restaurants | null>(
    null
  );
  const [errors, setErrors] = useState("");
  const { toast } = useToast();
  const authUser = AuthService.getUser();

  const required = <span className="text-red-500">*</span>

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Ensure file is a JPG
    if (file.type !== "image/jpeg") {
      alert("Only JPG images are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setImage(file);
  };

  const handleSelectionChange = (selected: Menu[], foods: string[]) => {
    setMenu(selected)
    if (selected && selected.length > 0) {
      setMeals(foods);
      setMealId(selected[0]._id);
    } else {
      setMeals(['']);
      setMealId('');
    }
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
        if (error.response?.status === 404) {
          setRestaurantMenu(null);
        } else {
          console.log("fetch error", error.message);
          setErrors(error.message);
        }
      }
      return null;
    }
  };

  useEffect(() => {
    const data = async () => {
      const restaurant = await fetchRestaurantData(id);
      const menu = await fetchMenu(id);
      setRestaurantData(restaurant);
      if (menu) {
        setRestaurantMenu(menu.menus);
      }
      console.log("menu", restaurantMenu);
      console.log("restaurant", restaurantData);
    };
    data();
  }, []);

  if (!restaurantData) {
    return (
      <div className="container mx-auto py-8 px-4">
        {errors ? errors : <Loading />}
      </div>
    );
  }

  if (!restaurantData || errors) {
    return <div className="container mx-auto py-8 px-4">Error: {errors}</div>;
  }

  const menuItem = [
    { name: "Main Course", value: "mainCourse" },
    { name: "Dessert", value: "dessert" },
    { name: "Appetizer", value: "appetizer" },
    { name: "Lunch", value: "lunch" },
    { name: "Drink", value: "drink" },
  ];

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1) Basic validation (now includes `meals`)
    if (!meals || !mealId || !partySize || !tableType || !seats || !date) {
      toast({
        title: "Missing Information",
        description: "Please select a menu item, seats, Party Size, TableType, date",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // 2) Format date/time
      const formattedDate = format(date as Date, "yyyy-MM-dd");
      const reservationDateTime = `${formattedDate}T${time}:00`;

      // 3) Build payload
      const payload = {
        type: "restaurant",
        vendorId: restaurantData._id,
        customerName: `${authUser?.firstName} ${authUser?.lastName}`,
        customerEmail: authUser?.email,
        businessName: restaurantData.businessName,
        location: restaurantData.address,
        partySize: Number(partySize),
        menuId: mealId,
        tableNumber: Number(seats),
        tableType,
        meals,
        pricePerTable: Number(seats) * (menu ? menu[0].price : 1),
        guests: Number(guests),
        totalPrice: Number(guests) * (menu ? menu[0].price : 1),
        specialRequest,
        image,
        date: reservationDateTime,
      };

      console.log("Final payload:", payload);
      const { data: res } = await API.post("/users/bookings", payload);
      

      // 4) Success!
      toast({
        title: "Reservation Confirmed!",
        description: `Table ${res.booking.tableNumber} for ${guests} is booked.`,
      });
      router.push(`/userDashboard/payment/${res.booking._id}`);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      toast({
        title: "Error",
        description:
          axiosErr.response?.data?.message ??
          "Reservation failed. Please try again.",
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
              {/* <CardDescription>
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
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <Carousel className="w-full max-w-xs mx-auto" setApi={setApi}>
                <CarouselContent>
                  <CarouselItem>
                    <Image
                      src={restaurantData.profileImage || "/hero-bg.jpg"}
                      alt={`${restaurantData.businessName || "Business Name"}`}
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

              {/* <p className="mt-4 text-gray-600">{restaurant.description}</p> */}

              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <p>
                    {restaurantData.address}
                    {restaurantData.location}
                  </p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <p>{restaurantData.phone}</p>
                </div>
                {/* <div className="flex items-center">
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
                </div> */}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={menuItem?.[0]?.value || ""}
                className="w-full"
              >
                <TabsList className="flex flex-wrap w-full h-auto">
                  {menuItem &&
                    [...new Set(menuItem.map((item) => item))].map(
                      (category, i) => (
                        <TabsTrigger key={i} value={category.value}>
                          {category.name}
                        </TabsTrigger>
                      )
                    )}
                </TabsList>

                {restaurantMenu && restaurantMenu.length > 0 ? (
                  [...new Set(restaurantMenu.map((item) => item.category))].map(
                    (category) => (
                      <TabsContent key={category} value={category}>
                        <ScrollArea className="h-72 rounded-md">
                          {restaurantMenu
                            .filter((item) => item.category === category)
                            .map((i) => (
                              <Card key={i._id} className="space-y-2 mb-3">
                                <CardContent className="flex flex-col w-full p-2">
                                  <div className="flex gap-4">
                                    <Image
                                      src={`https://hotel-booking-app-backend-30q1.onrender.com/uploads/${
                                        i.itemImage ||
                                        i.dishImage ||
                                        "/hero-bg.jpg"}`}
                                      alt={i.itemName || i.dishName}
                                      width={100}
                                      height={100}
                                      className="rounded-md object-cover h-[100px] w-[100px]"
                                    />
                                    <div>
                                      <h2 className="font-semibold">
                                        {i.dishName || i.itemName}
                                      </h2>
                                      <span className="text-muted-foreground">
                                        ₦{i.price.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full flex flex-col mt-2">
                                    <h3 className="font-semibold text-muted-foreground">
                                      Description:
                                    </h3>
                                    <p className=" break-words">
                                      {i.description}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </ScrollArea>
                      </TabsContent>
                    )
                  )
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
                <p className="text-xs text-gray-500">{required} required</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReservation}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Date</Label> {required}
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
                    <Label htmlFor="time">Time</Label> {required}
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
                    <Label htmlFor="guests">Number of Guests</Label> {required}
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
                  <div>
                    <Label htmlFor="guests">Party Size</Label> {required}
                    <Select value={partySize} onValueChange={setPartySize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of Party Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "10",
                        ].map((n) => (
                          <SelectItem key={n} value={n}>
                            {n} {n === "1" ? "guest" : "guests"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="seats">Number of Seats</Label> {required}
                    <Select value={seats} onValueChange={setSeats}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of Seats" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => (
                          <SelectItem key={n} value={n}>
                            {n} {n === "1" ? "seat" : "seats"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="time">Table type</Label> {required}
                    <Select value={tableType} onValueChange={setTableType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Table type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Round Table", "Square Table"].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="time">Special Request</Label>
                    <Input
                      type="text"
                      placeholder="Enter Special Request"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image Upload</Label>
                    <div
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <div className="space-y-1 text-center">
                        {imagePreview ? (
                          <Image
                            src={imagePreview || "/dan-gold.jpg"}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="mx-auto h-32 w-32 object-cover rounded-md"
                          />
                        ) : (
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-hidden focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>
                              {imagePreview
                                ? "Change image"
                                : "Upload an image"}
                            </span>
                            <input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleImageUpload}
                              accept="image/*"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="meals">Select Menu Items</Label> {required}
                    {restaurantMenu && (
                      <ItemSelector
                        items={restaurantMenu}
                        onSelectionChange={handleSelectionChange}
                      />
                    )}
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
