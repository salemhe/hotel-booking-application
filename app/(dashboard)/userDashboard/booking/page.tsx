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
  X,
  Edit,
  AlertTriangle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  _id: string;
  user: string;
  type: string;
  vendor: string;
  vendorId?: string;
  menuId: string;
  roomNumber: null | number;
  tableNumber: number;
  tableType?: string;
  guests: number;
  partySize?: number;
  date: string;
  checkIn: null | string;
  checkOut: null | string;
  status: string;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  
  // Additional fields from API
  businessName?: string;
  location?: string;
  meals?: string[];
  meal?: string;
  image?: string;
  pricePerTable?: number;
  totalPrice?: number;
  specialRequest?: string;
  
  // Display fields
  name?: string;
  time?: string;
}

export default function BookingList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [tableTypeFilter, setTableTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [editFormData, setEditFormData] = useState({
    tableNumber: 0,
    guests: 0,
  });

  const authUser = AuthService.getUser();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch bookings
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Using userId query parameter to get user's bookings
      const response = await API.get("/users/bookings", {
        params: { userId: authUser?.id },
      });
      
      // Process the bookings data to ensure we have all the display fields
      const bookingsData = Array.isArray(response.data) ? response.data : [];
      
      // Process each booking to ensure it has proper display properties
      const processedBookings = bookingsData.map((booking) => {
        const bookingDate = new Date(booking.date);
        const formattedTime = bookingDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        
        return {
          ...booking,
          // If businessName exists, use it as name, otherwise use a default
          name: booking.businessName || "Restaurant",
          // Extract time from the date string
          time: formattedTime,
          // For backward compatibility
          meal: booking.meals?.[0] || booking.meal || "Standard meal",
        };
      });
      
      setBookings(processedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings. Please try again.");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.id) fetchBookings();
    else setIsLoading(false);
  }, [authUser?.id]);

  // Search + filter logic
  const clearSearch = () => setSearchQuery("");
  const filtered = bookings.filter((b) => {
    const nameMatch =
      !searchQuery ||
      (b.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (b.meal?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const locationMatch =
      locationFilter === "all" || b.location === locationFilter;
    const tableMatch =
      tableTypeFilter === "all" || 
      b.tableType === tableTypeFilter || 
      `${b.tableNumber}-seats` === tableTypeFilter;
    return nameMatch && locationMatch && tableMatch;
  });

  // Split current vs past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const current = filtered.filter((b) => new Date(b.date) >= today);
  const past = filtered.filter((b) => new Date(b.date) < today);

  // Handle cancellation
  const openCancelDialog = (id: string) => {
    setBookingToCancel(id);
    setShowCancelDialog(true);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
  
    setIsCancelling(true);
    try {
      const response = await API.patch(`/users/bookings/cancel/${bookingToCancel}`);
  
      // Log the cancellation response
      console.log("Cancellation Response:", response.data);
  
      // Use the response data (e.g., message or booking details)
      const { message, booking } = response.data;
  
      // Update the bookings list with the updated booking
      setBookings((prevBookings) =>
        prevBookings.map((bookingItem) =>
          bookingItem._id === bookingToCancel
            ? { ...bookingItem, status: booking.status } // Use updated status from response
            : bookingItem
        )
      );
  
      toast({
        title: "Booking Cancelled",
        description: message || "Your booking has been successfully cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
      setShowCancelDialog(false);
      setBookingToCancel(null);
    }
  };

  // Handle editing
  const openEditDialog = (booking: Booking) => {
    setBookingToEdit(booking);
    setEditFormData({
      tableNumber: booking.tableNumber,
      guests: booking.guests,
    });
    setShowEditDialog(true);
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingToEdit) return;
    
    try {
      const payload = {
        type: bookingToEdit.type,
        vendor: bookingToEdit.vendor || bookingToEdit.vendorId,
        tableNumber: editFormData.tableNumber,
        guests: editFormData.guests,
      };
      
      const response = await API.patch(`/users/bookings/update/${bookingToEdit._id}`, payload);
      
      // Update the bookings list with the updated booking
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingToEdit._id 
            ? { ...booking, ...response.data.booking } 
            : booking
        )
      );
      
      toast({
        title: "Booking Updated",
        description: "Your booking has been successfully updated.",
      });
      
      setShowEditDialog(false);
      setBookingToEdit(null);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your booking. Please try again.",
        variant: "destructive",
      });
    }
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
            <Button onClick={fetchBookings} variant="outline" size="sm">
              Refresh
            </Button>
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
                {/* Extract unique locations from bookings */}
                {[...new Set(bookings.map(b => b.location).filter(Boolean))].map(location => (
                  <SelectItem key={location} value={location || ""}>
                    {location}
                  </SelectItem>
                ))}
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
                <SelectItem value="8-seats">8 Seats</SelectItem>
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
              <Button onClick={fetchBookings}>Try Again</Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <SearchXIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="mb-4">No bookings found.</p>
              <Button onClick={() => router.push("/userDashboard/search")}>
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
                    {current.map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onCancel={openCancelDialog}
                        onEdit={openEditDialog}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8">No upcoming bookings.</p>
                )}
              </TabsContent>

              <TabsContent value="Past" className="mt-6">
                {past.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {past.map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        isPast
                        onCancel={openCancelDialog}
                        onEdit={openEditDialog}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8">No past bookings.</p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>

      {/* Cancel Booking Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(false)}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Make changes to your booking details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateBooking}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="tableNumber" className="text-sm font-medium">
                  Table Number
                </label>
                <Select
                  value={editFormData.tableNumber.toString()}
                  onValueChange={(value) => setEditFormData({
                    ...editFormData,
                    tableNumber: parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a table number" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Table {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="guests" className="text-sm font-medium">
                  Number of Guests
                </label>
                <Select
                  value={editFormData.guests.toString()}
                  onValueChange={(value) => setEditFormData({
                    ...editFormData,
                    guests: parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Booking
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BookingCard({
  booking,
  isPast = false,
  onCancel,
  onEdit,
}: {
  booking: Booking;
  isPast?: boolean;
  onCancel: (id: string) => void;
  onEdit: (booking: Booking) => void;
}) {
  const [receipt, setReceipt] = useState<Booking | null>(null);
  const router = useRouter();

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n || 0);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString(undefined);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
        isPast || booking.status?.toLowerCase() === 'cancelled' ? "opacity-70" : "hover:shadow-lg"
      }`}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={booking.image || "/hero-bg.jpg"}
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
            {booking.status || "Pending"}
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
            <span>{booking.meal || booking.meals?.[0] || "Standard meal"}</span>
          </div>
          <div className="flex justify-between">
            <span>Total</span>
            <span>{fmtPrice(booking.totalPrice || booking.pricePerTable || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Booking Date</span>
            <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setReceipt(booking)}>
                <Printer className="mr-2 h-4 w-4" />
                View Receipt
              </DropdownMenuItem>
              
              {!isPast && booking.status?.toLowerCase() !== 'cancelled' && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(booking)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Booking
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onCancel(booking._id)}
                    className="text-red-600"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </Card>
  );
}

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
    }).format(n || 0);

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
            <span className="truncate">{receipt.name || receipt.businessName || "Restaurant"}</span>
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
              ["Meal", receipt.meal || receipt.meals?.[0] || "Standard meal"],
              ["Total", fmtPrice(receipt.totalPrice || receipt.pricePerTable || 0)],
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