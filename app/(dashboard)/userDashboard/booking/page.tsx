"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Printer,
  MoreVertical,
  SearchXIcon,
  Download,
  ArrowUpRightFromSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import API from "@/lib/api/userAxios";
import { ReservationService } from "@/lib/api/services/reservation.service";
import { AuthService, UserProfile } from "@/lib/api/services/userAuth.service";
import { toast } from "sonner";
import { Edit, X, AlertTriangle, Star } from "lucide-react";

export default function BookingList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [tableType, setTableType] = useState("all");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooking = async () => {
    setIsLoading(true);
    try {
      const id = await AuthService.getId();

      // Fetch both bookings and reservations
      const [bookingsResponse, reservationsResponse] = await Promise.allSettled([
        API.get(`/users/bookings`),
        ReservationService.getUserReservations(id!)
      ]);

      let allBookings: Booking[] = [];

      // Process bookings
      if (bookingsResponse.status === 'fulfilled') {
        allBookings = [...allBookings, ...bookingsResponse.value.data];
      }

      // Process reservations and transform them to booking format
      if (reservationsResponse.status === 'fulfilled') {
        const transformedReservations = reservationsResponse.value.map(reservation => ({
          _id: reservation._id,
          businessName: reservation.businessName,
          date: reservation.date,
          bookingDate: reservation.date,
          guests: reservation.guests,
          meals: reservation.meals?.map(meal => meal.name) || [],
          menuId: reservation.meals?.[0]?.id || '',
          partySize: reservation.guests,
          specialRequest: reservation.specialRequest || '',
          status: reservation.status,
          tableNumber: reservation.guests, // Use guests as table number for reservations
          tableType: `${reservation.guests}-seats`,
          location: reservation.location,
          image: reservation.image || '',
          pricePerTable: reservation.totalPrice,
          totalPrice: reservation.totalPrice,
          userId: id!,
          vendorId: reservation.vendorId,
          time: reservation.time,
          reservationType: reservation.reservationType,
          seatingPreference: reservation.seatingPreference,
          additionalNote: reservation.additionalNote
        }));
        allBookings = [...allBookings, ...transformedReservations];
      }

      setBookings(allBookings);
      console.log(`Loaded ${allBookings.length} bookings/reservations`);
    } catch (error) {
      if (error instanceof AxiosError)
        console.error(
          "Error fetching bookings:",
          error.response?.data || error.message
        );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const booking = bookings.find(b => b._id === bookingId);
    const isReservation = booking && 'reservationType' in booking;

    const confirmCancel = window.confirm(
      `Are you sure you want to cancel this ${isReservation ? 'reservation' : 'booking'}? This action cannot be undone.`
    );

    if (!confirmCancel) return;

    try {
      if (isReservation) {
        await ReservationService.cancelReservation(bookingId);
      } else {
        await API.patch(`/users/bookings/${bookingId}/cancel`);
      }

      // Update local state
      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );

      toast.success(`${isReservation ? 'Reservation' : 'Booking'} cancelled successfully`);
    } catch (error) {
      console.error("Error cancelling:", error);
      toast.error(`Failed to cancel ${isReservation ? 'reservation' : 'booking'}. Please try again.`);
    }
  };

  const router = useRouter();

  const handleModifyBooking = (bookingId: string) => {
    // Navigate to modification page
    router.push(`/userDashboard/booking/${bookingId}/edit`);
  };



  useEffect(() => {
    (async () => {
      const id = await AuthService.getId();
      const authUser = await AuthService.getUser(id!);
      setUser(authUser);
      await fetchBooking();
    })();
  }, []);

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter((booking) => {
    if (
      searchQuery &&
      !booking.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (location !== "all" && booking.location !== location) {
      return false;
    }
    if (tableType !== "all" && booking.tableType !== tableType) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-900/40">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex gap-2">
              {user?.firstName || "loading..."} {user?.lastName || ""}
            </h1>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search restaurant"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-zinc-900">
                <SelectValue placeholder="Restaurant Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Victoria Island">Victoria Island</SelectItem>
                <SelectItem value="Lekki">Lekki</SelectItem>
                <SelectItem value="Banana Island">Banana Island</SelectItem>
                <SelectItem value="Opebi">Opebi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tableType} onValueChange={setTableType}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-zinc-900">
                <SelectValue placeholder="Table Selection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                <SelectItem value="2-seats">2 Seats</SelectItem>
                <SelectItem value="4-seats">4 Seats</SelectItem>
                <SelectItem value="6-seats">6 Seats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Booking List */}
        <main>
          <h2 className="text-xl font-semibold mb-4">Booking List</h2>
          <Tabs defaultValue="Current">
            <div className="w-full flex justify-center mb-2">
              <TabsList>
                <TabsTrigger value="Current">Current</TabsTrigger>
                <TabsTrigger value="Past">Past</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="Current">
              {filteredBookings.filter((booking) => {
                const today = new Date();
                const bookingDate = new Date(booking.date);
                return bookingDate > today;
              }).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookings
                    .filter((booking) => {
                      const today = new Date();
                      const bookingDate = new Date(booking.date);
                      return bookingDate > today;
                    })
                    .map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onCancel={handleCancelBooking}
                        onModify={handleModifyBooking}
                      />
                    ))}
                </div>
              ) : (
                <div className="w-full py-[50] px-4 flex items-center justify-center">
                  <div className="flex flex-col gap-8 items-center">
                    <SearchXIcon className="size-[64]" />
                    <p className="text-center">
                      No Bookings to show yet, Start booking your affordable
                      restaurants today.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="Past">
              {filteredBookings.filter((booking) => {
                const today = new Date();
                const bookingDate = new Date(booking.date);
                return bookingDate < today;
              }).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookings
                    .filter((booking) => {
                      const today = new Date();
                      const bookingDate = new Date(booking.date);
                      return bookingDate < today;
                    })
                    .map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onCancel={handleCancelBooking}
                        onModify={handleModifyBooking}
                      />
                    ))}
                </div>
              ) : (
                <div className="w-full py-[50] px-4 flex items-center justify-center">
                  <div className="flex flex-col gap-8 items-center">
                    <SearchXIcon className="size-[64]" />
                    <p className="text-center">
                      No Bookings to show yet, Start booking your affordable
                      restaurants today.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

interface Booking {
  _id: string;
  businessName: string;
  date: string;
  bookingDate: string;
  guests: number;
  meals: string[];
  menuId: string;
  partySize: number;
  specialRequest: string;
  status: string;
  tableNumber: number;
  tableType: string;
  location: string;
  image: string;
  pricePerTable: number;
  totalPrice: number;
  userId: string;
  vendorId: string;
  time?: string;
  reservationType?: string;
  seatingPreference?: string;
  additionalNote?: string;
}

function BookingCard({
  booking,
  onCancel,
  onModify
}: {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  onModify: (bookingId: string) => void;
}) {
  const [receipt, setReceipt] = useState<Booking | null>(null);
  const router = useRouter();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePrint = (booking: Booking) => {
    setReceipt(booking);
  };

  const canCancel = (): boolean => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 2 && !['cancelled', 'completed'].includes(booking.status);
  };

  const canModify = (): boolean => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 4 && !['cancelled', 'completed'].includes(booking.status);
  };



  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[4/3]">
        <Image
          src={`https://hotel-booking-app-backend-30q1.onrender.com/uploads/${booking.image}` || "/dan-gold.jpg"}
          alt={booking.businessName}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            booking.status === "confirmed"
              ? "bg-green-100 text-green-800 border border-green-200"
              : booking.status === "cancelled"
              ? "bg-red-100 text-red-800 border border-red-200"
              : booking.status === "completed"
              ? "bg-blue-100 text-blue-800 border border-blue-200"
              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
          }`}>
            {getStatusText(booking.status)}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">{booking.businessName}</h3>
            <p className="text-sm text-muted-foreground">{booking.location}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {" "}
                {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Seats</span>
              <span className="font-medium">{booking.tableNumber} seats</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Payment</span>
              <span className="font-medium">
                {formatPrice(booking.totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/userDashboard/booking/${booking._id}`)
                    }
                    size="icon"
                    className="h-8 w-8"
                  >
                    <ArrowUpRightFromSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handlePrint(booking);
                    }}
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  title="More"
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canModify() && (
                  <DropdownMenuItem
                    onClick={() => onModify(booking._id)}
                    className="flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modify Booking
                  </DropdownMenuItem>
                )}
                {canCancel() && (
                  <DropdownMenuItem
                    onClick={() => onCancel(booking._id)}
                    className="text-destructive flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </DropdownMenuItem>
                )}
                {booking.status === 'completed' && (
                  <DropdownMenuItem className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Leave Review
                  </DropdownMenuItem>
                )}
                {!canCancel() && !canModify() && booking.status !== 'completed' && (
                  <DropdownMenuItem disabled className="text-gray-400">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Too late to modify
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
      <Data receipt={receipt} setReceipt={setReceipt} />
    </Card>
  );
}

const Data = ({
  receipt,
  setReceipt,
}: {
  receipt: Booking | null;
  setReceipt: (data: null) => void;
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  if (!receipt) return null;

  const downloadReceiptAsPDF = async () => {
    if (!receiptRef.current) return;

    const dataUrl = await domtoimage.toPng(receiptRef.current);
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(dataUrl, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
    pdf.save(
      `${receipt.meals.join(" & ")}-${receipt.businessName}-Receipt.pdf`
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full bg-black/80 z-30">
      <div className="bg-white rounded-2xl shadow-lg max-w-[320px] w-full receipt-safe">
        <div className="p-6" ref={receiptRef}>
          <h2 className="text-xl font-medium flex items-center gap-2 mb-4">
            <span className="max-w-[150px] truncate block">
              {receipt.businessName}
            </span>
            <span className="text-muted-foreground">Receipt</span>
          </h2>

          <QRCodeCanvas
            value={`https://hotel-booking-application-omega.vercel.app/userDashboard/booking/${
              receipt._id || ""
            }`}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            className="mx-auto"
          />

          <div className="flex flex-col py-4 gap-2 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="text-blue-900 font-medium">
                {new Date(receipt.bookingDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-blue-900 font-medium">
                {receipt.status}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Table Type:</span>
              <span className="text-blue-900 font-medium">
                {receipt.tableType}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Meal:</span>
              <span className="text-blue-900 font-medium">
                {receipt.meals.join()}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-between p-6 pt-4">
          <Button onClick={() => setReceipt(null)} variant="outline">
            Cancel
          </Button>
          <Button onClick={downloadReceiptAsPDF}>
            Download <Download className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// const bookings = [
//   {
//     id: "7t2gyuw7y7uhu72",
//     name: "Ocean Basket",
//     meal: "Rice and Chicken",
//     location: "Victoria Island",
//     image: "/hero-bg.jpg",
//     date: new Date().toISOString().split("T")[0], // Today's date
//     seats: 3,
//     pricePerTable: 80000,
//     totalPayment: 80000,
//     tableType: "2-seats",
//     time: "19:00",
//   },
//   {
//     id: "bus6783uyeg73",
//     name: "Velvet Bar & Lounge",
//     meal: "Chicken Bucket",
//     location: "Lekki",
//     image: "/hero-bg.jpg",
//     date: new Date(new Date().setDate(new Date().getDate() - 2))
//       .toISOString()
//       .split("T")[0], // 2 days ago
//     seats: 6,
//     pricePerTable: 80000,
//     totalPayment: 80000,
//     tableType: "2-seats",
//     time: "11:00",
//   },
//   {
//     id: "ukniweh78738ee",
//     name: "Shiro Lagos",
//     meal: "Eba & Ewedu Soup",
//     location: "Banana Island",
//     image: "/restaurant.jpg",
//     date: new Date(new Date().setDate(new Date().getDate() + 5))
//       .toISOString()
//       .split("T")[0], // 5 days from now
//     seats: 4,
//     pricePerTable: 80000,
//     totalPayment: 80000,
//     tableType: "3-seats",
//     time: "14:00",
//   },
//   {
//     id: "heu38y22hbsi",
//     name: "Shiro Lagos",
//     meal: "Yam & Egg",
//     location: "Opebi",
//     image: "/hero-bg.jpg",
//     date: new Date(new Date().setDate(new Date().getDate() + 10))
//       .toISOString()
//       .split("T")[0], // 10 days from now
//     seats: 5,
//     pricePerTable: 80000,
//     totalPayment: 80000,
//     tableType: "4-seats",
//     time: "15:00",
//   },
//   {
//     id: "38juwin2u92wu",
//     name: "Chicken Republic",
//     meal: "Rice & Chicken",
//     location: "Opebi",
//     image: "/chicken-republic.jpg",
//     date: new Date(new Date().setDate(new Date().getDate() + 10))
//       .toISOString()
//       .split("T")[0], // 10 days from now
//     seats: 7,
//     pricePerTable: 80000,
//     totalPayment: 80000,
//     tableType: "7-seats",
//     time: "11:00",
//   },
// ];
