// components/BookingList.tsx
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
  Loader2,
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
import { useRouter } from "next/navigation";
import API from "@/utils/axios";
import { AuthService } from "@/services/auth.services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Booking {
  _id: string;
  user: string;
  type: string;
  vendor: string;
  menuId: string;
  roomNumber: null | string;
  tableNumber: number;
  guests: number;
  date: string;
  checkIn: null | string;
  checkOut: null | string;
  status: string;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  
  // These fields will be populated from the vendor/menu data
  name?: string;
  location?: string;
  image?: string;
  pricePerTable?: number;
  totalPayment?: number;
  tableType?: string;
  time?: string;
  meal?: string;
}

export default function BookingList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [tableTypeFilter, setTableTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  const authUser = AuthService.getUser();
  const router = useRouter();

  // Fetch bookings for the logged‑in user
  useEffect(() => {
    let isMounted = true;

    async function fetchBookings() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await API.get<Booking[]>("/users/bookings", {
          params: { userId: authUser?.id },
        });
        
        if (isMounted) {
          // Get the bookings data
          const bookingsData = Array.isArray(response.data) ? response.data : [];
          
          // For each booking, fetch additional vendor and menu data
          const enhancedBookings = await Promise.all(
            bookingsData.map(async (booking) => {
              try {
                // Fetch vendor data
                const vendorResponse = await API.get(`/vendors/${booking.vendor}`);
                const vendor = vendorResponse.data;
                
                // Fetch menu data
                const menuResponse = await API.get(`/menus/${booking.menuId}`);
                const menu = menuResponse.data;
                
                // Extract time from the date
                const bookingDate = new Date(booking.date);
                const hours = bookingDate.getHours();
                const minutes = bookingDate.getMinutes();
                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                
                // Return enhanced booking with display data
                return {
                  ...booking,
                  id: booking._id, // For backward compatibility
                  name: vendor?.name || "Restaurant",
                  location: vendor?.location || "Unknown location",
                  image: vendor?.image || "/placeholder.svg",
                  seats: booking.guests,
                  tableType: `${booking.tableNumber}-table`,
                  time: formattedTime,
                  meal: menu?.name || "Standard meal",
                  pricePerTable: menu?.price || 0,
                  totalPayment: (menu?.price || 0) * booking.guests,
                };
              } catch (err) {
                console.error("Error fetching additional booking data:", err);
                // Return basic booking with defaults
                return {
                  ...booking,
                  id: booking._id,
                  name: "Restaurant",
                  location: "Location unavailable",
                  image: "/placeholder.svg",
                  seats: booking.guests,
                  tableType: `Table ${booking.tableNumber}`,
                  time: new Date(booking.date).toLocaleTimeString(),
                  meal: "Meal information unavailable",
                  pricePerTable: 0,
                  totalPayment: 0,
                };
              }
            })
          );
          
          setBookings(enhancedBookings);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        if (isMounted) {
          setError("Failed to load your bookings.");
          setBookings([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (authUser?.id) fetchBookings();
    else setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, [authUser?.id]);

  // Search + filter logic
  const clearSearch = () => setSearchQuery("");
  const filtered = bookings.filter((b) => {
    const nameMatch =
      !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.meal.toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch =
      locationFilter === "all" || b.location === locationFilter;
    const tableMatch =
      tableTypeFilter === "all" || b.tableType === tableTypeFilter;
    return nameMatch && locationMatch && tableMatch;
  });

  // Only show current user’s bookings
  const userBookings = filtered.filter(
    (b) => String(b.user) === String(authUser?.id)
  );

  // Split current vs past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const current = userBookings.filter((b) => new Date(b.date) >= today);
  const past = userBookings.filter((b) => new Date(b.date) < today);

  // Cancel booking handler
  const handleCancel = (id: string) => {
    // TODO: await API.delete(`/users/bookings/${id}`);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-900/40">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header & Filters */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {authUser?.firstName || "Guest"} {authUser?.lastName || ""}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 pr-10"
                placeholder="Search restaurant or meal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <SearchXIcon size={16} />
                </button>
              )}
            </div>

            <Select
              value={locationFilter}
              onValueChange={setLocationFilter}
            >
              <SelectTrigger className="w-[200px] bg-white dark:bg-zinc-900">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Victoria Island">
                  Victoria Island
                </SelectItem>
                <SelectItem value="Lekki">Lekki</SelectItem>
                <SelectItem value="Banana Island">Banana Island</SelectItem>
                <SelectItem value="Opebi">Opebi</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={tableTypeFilter}
              onValueChange={setTableTypeFilter}
            >
              <SelectTrigger className="w-[200px] bg-white dark:bg-zinc-900">
                <SelectValue placeholder="Table Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                <SelectItem value="2-seats">2 Seats</SelectItem>
                <SelectItem value="4-seats">4 Seats</SelectItem>
                <SelectItem value="6-seats">6 Seats</SelectItem>
                <SelectItem value="7-seats">7 Seats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Booking Tabs */}
        <main>
          <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              Loading...
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="mb-4 text-rose-600">{error}</p>
            </div>
          ) : userBookings.length === 0 ? (
            <div className="text-center py-16">
              <SearchXIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="mb-4">No bookings found.</p>
              <Button onClick={() => router.push("/restaurants")}>
                Browse Restaurants
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="Current">
              <TabsList className="mx-auto">
                <TabsTrigger value="Current">
                  Current
                  {current.length > 0 && (
                    <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                      {current.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="Past">
                  Past
                  {past.length > 0 && (
                    <span className="ml-2 bg-muted px-2 py-0.5 rounded-full text-xs">
                      {past.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="Current" className="mt-6">
                {current.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {current.map((b) => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        onCancel={handleCancel}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center">No upcoming bookings.</p>
                )}
              </TabsContent>

              <TabsContent value="Past" className="mt-6">
                {past.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {past.map((b) => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        isPast
                        onCancel={handleCancel}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center">No past bookings.</p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  isPast = false,
  onCancel,
}: {
  booking: Booking;
  isPast?: boolean;
  onCancel: (id: string) => void;
}) {
  const [receipt, setReceipt] = useState<Booking | null>(null);
  const router = useRouter();

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString(undefined);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-shadow duration-300 ${
        isPast ? "opacity-70" : "hover:shadow-lg"
      }`}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={booking.image || "/placeholder.svg"}
          alt={booking.name || "Restaurant"}
          fill
          className="object-cover"
        />
        {isPast && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-black/70 text-white px-3 py-1 rounded text-sm">
              Past
            </span>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{booking.name || "Restaurant"}</h3>
        <p className="text-sm text-muted-foreground">
          {booking.location || "Unknown location"}
        </p>
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Date</span>
            <span>{fmtDate(booking.date)}</span>
          </div>
          <div className="flex justify-between">
            <span>Time</span>
            <span>{booking.time || new Date(booking.date).toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Guests</span>
            <span>{booking.guests}</span>
          </div>
          <div className="flex justify-between">
            <span>Table</span>
            <span>{booking.tableNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Meal</span>
            <span>{booking.meal || "Standard meal"}</span>
          </div>
          <div className="flex justify-between">
            <span>Total</span>
            <span>{fmtPrice(booking.totalPayment || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Booking Date</span>
            <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Rest of the component remains the same */}
        <div className="flex justify-end gap-2 pt-4">
          {/* ... existing code ... */}
        </div>
      </CardContent>

      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </Card>
  );
}

// ... existing code ...
function ReceiptModal({
  receipt,
  onClose,
}: {
  receipt: Booking;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString(undefined);

  const download = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      const dataUrl = await domtoimage.toPng(ref.current);
      const pdf = new jsPDF("p", "pt", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, "PNG", 10, 10, w - 20, h / 2);
      pdf.save(`Receipt-${receipt._id}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-30 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg w-full max-w-md">
        <div className="p-6" ref={ref}>
          <h2 className="text-xl font-medium mb-4 flex justify-between">
            <span className="truncate">{receipt.name || "Restaurant"}</span>
            <span className="text-sm text-muted-foreground">Receipt</span>
          </h2>

          <div className="flex justify-center mb-4">
            <QRCodeCanvas
              value={`https://.../booking/${receipt._id}`}
              size={200}
            />
          </div>

          <div className="border-t border-b py-4 space-y-2 text-sm">
            {[
              ["Booking ID", receipt._id.slice(0, 8) + "..."],
              ["Type", receipt.type],
              ["Status", receipt.status],
              ["Date", fmtDate(receipt.date)],
              ["Time", receipt.time || new Date(receipt.date).toLocaleTimeString()],
              ["Table Number", receipt.tableNumber.toString()],
              ["Guests", receipt.guests.toString()],
              ["Meal", receipt.meal || "Standard meal"],
              ["Total", fmtPrice(receipt.totalPayment || 0)],
              ["Booking Date", new Date(receipt.bookingDate).toLocaleDateString()],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}:</span>
                <span>{val}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            Thank you for your booking!
          </p>
        </div>

        <div className="flex justify-between p-6 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={download} disabled={busy}>
            {busy ? "Generating..." : "Download"}
          </Button>
        </div>
      </div>
    </div>
  );
}
// ... existing code ...