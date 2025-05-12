"use client";
import React, { useState, useEffect, ReactElement, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import {
  Search,
  Trash2,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  X,
  Check,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

import { AuthService } from "@/services/auth.services";

// Define types
interface Booking {
  _id: string;
  user: string;
  type: "hotel" | "restaurant";
  vendor: string;
  roomNumber?: number | null;
  tableNumber?: number | null;
  checkIn: string;
  checkOut?: string;
  date: string;
  customerName: string;
  customerEmail: string;
  specialRequest?: string;
  partySize: number;
  tableType?: string;
  meals?: string[];
  status: "confirmed" | "pending" | "cancelled" | "completed";
  bookingDate: string;
  guests?: number;
}

type StatusFilterType =
  | "all"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed";
type SortOption = "newest" | "oldest" | "guestsHigh" | "guestsLow";
type BookingType = "all" | "hotel" | "restaurant";

export default function AdminDashboard(): ReactElement {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [typeFilter, setTypeFilter] = useState<BookingType>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(
    null
  );
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const BASE_URL: string =
    "https://hotel-booking-app-backend-30q1.onrender.com";

  // Fetch token on mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const authToken = AuthService.getToken();
        setToken(authToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    if (isMounted) {
      getToken();
    }
  }, [isMounted]);

  // Fetch bookings from API
  const fetchBookings = useCallback(
    async (type?: string, vendorId?: string): Promise<void> => {
      try {
        setLoading(true);

        // Only proceed if component is mounted and we have a token
        if (!isMounted || !token) {
          return;
        }

        // Build the query URL based on parameters
        let queryUrl = `${BASE_URL}/api/users/bookings`;
        const queryParams = [];

        if (type && type !== "all") {
          queryParams.push(`type=${type}`);
        }

        if (vendorId) {
          queryParams.push(`vendorId=${vendorId}`);
        }

        if (queryParams.length > 0) {
          queryUrl += `?${queryParams.join("&")}`;
        }

        const response = await axios.get<Booking[]>(queryUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(response.data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch bookings. Please try again.";
        setError(errorMessage);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [isMounted, token, BASE_URL]
  );

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  // Fetch bookings after token is available
  useEffect(() => {
    if (isMounted && token) {
      fetchBookings(typeFilter !== "all" ? typeFilter : undefined);
    }
  }, [typeFilter, isMounted, token, fetchBookings]);

  // Show notification helper
  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success"): void => {
      if (!isMounted) return;

      const notification = document.createElement("div");
      notification.className = `fixed top-4 right-4 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white p-4 rounded-md shadow-lg z-50 flex items-center`;

      const iconSpan = document.createElement("span");
      iconSpan.className = "mr-2";
      iconSpan.innerHTML =
        type === "success"
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

      const textSpan = document.createElement("span");
      textSpan.textContent = message;

      notification.appendChild(iconSpan);
      notification.appendChild(textSpan);
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.5s ease";
        setTimeout(() => notification.remove(), 500);
      }, 4500);
    },
    [isMounted]
  );

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    if (!isMounted || !token) {
      return;
    }

    try {
      const socket: Socket = io(BASE_URL, {
        auth: { token },
        query: { role: "admin" },
        reconnectionAttempts: 3,
        timeout: 5000,
      });

      socket.on("connect", () => {
        console.log("WebSocket connected");
      });

      socket.on(
        "bookingsUpdate",
        (payload: { type: string; data: Booking }) => {
          const { type, data } = payload;

          if (!data || !data._id) {
            console.warn("Invalid data received in bookingsUpdate:", payload);
            return;
          }

          switch (type) {
            case "insert":
              setBookings((prev) => [data, ...prev]);
              showNotification(
                `New booking #${data._id.substring(0, 4)} received!`,
                "success"
              );
              break;

            case "update":
              setBookings((prev) =>
                prev.map((booking) =>
                  booking._id === data._id ? data : booking
                )
              );
              showNotification(
                `Booking #${data._id.substring(0, 4)} updated.`,
                "success"
              );
              break;

            case "delete":
              setBookings((prev) =>
                prev.filter((booking) => booking._id !== data._id)
              );
              showNotification(
                `Booking #${data._id.substring(0, 4)} deleted.`,
                "error"
              );
              break;

            default:
              console.warn("Unknown booking update type:", type);
          }
        }
      );

      socket.on("connect_error", (err: Error) => {
        console.error("Socket connection error:", err);
      });

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.error("Socket error:", err);
    }
  }, [isMounted, showNotification, token]);

  // Deletion handler
  const handleDeleteBooking = async (id: string): Promise<void> => {
    if (!isMounted || !token) return;

    if (showConfirmDelete === id) {
      try {
        await axios.delete(`${BASE_URL}/api/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
        showNotification("Booking successfully deleted", "success");
      } catch (err) {
        console.error("Failed to delete booking:", err);
        showNotification(
          "Failed to delete booking. Please try again.",
          "error"
        );
      }

      setShowConfirmDelete(null);
    } else {
      setShowConfirmDelete(id);
    }
  };

  // Edit handlers
  const handleEditClick = (booking: Booking): void => {
    setEditingBooking(booking._id);
    setEditForm({
      status: booking.status,
      guests: booking.guests,
      tableNumber: booking.tableNumber,
      roomNumber: booking.roomNumber,
    });
  };

  const handleEditCancel = (): void => {
    setEditingBooking(null);
    setEditForm({});
  };

  const handleEditSave = async (id: string): Promise<void> => {
    if (!isMounted || !token) return;

    try {
      await axios.put(`${BASE_URL}/api/bookings/${id}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === id ? { ...booking, ...editForm } : booking
        )
      );

      showNotification("Booking successfully updated", "success");
    } catch (err) {
      console.error("Failed to update booking:", err);
      showNotification("Failed to update booking. Please try again.", "error");
    }

    setEditingBooking(null);
    setEditForm({});
  };

  // Refresh data handler
  const handleRefreshData = (): void => {
    fetchBookings(typeFilter !== "all" ? typeFilter : undefined);
  };

  // Reset filters
  const resetFilters = (): void => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Sorting function
  const sortBookings = (bookings: Booking[]): Booking[] => {
    return [...bookings].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.bookingDate).getTime() -
            new Date(a.bookingDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.bookingDate).getTime() -
            new Date(b.bookingDate).getTime()
          );
        case "guestsHigh":
          return (b.guests || 0) - (a.guests || 0);
        case "guestsLow":
          return (a.guests || 0) - (b.guests || 0);
        default:
          return 0;
      }
    });
  };

  // Filter bookings by search query and status
  const filteredBookings = sortBookings(
    bookings.filter((booking) => {
      // Handle search
      const searchMatches =
        booking._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.user &&
          booking.user.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (booking.tableNumber &&
          booking.tableNumber.toString().includes(searchQuery)) ||
        (booking.roomNumber &&
          booking.roomNumber.toString().includes(searchQuery));

      // Handle status filter
      const statusMatches =
        statusFilter === "all" ||
        booking.status.toLowerCase() === statusFilter.toLowerCase();

      return searchMatches && statusMatches;
    })
  );

  // Pagination
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentBookings: Booking[] = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages: number = Math.ceil(filteredBookings.length / itemsPerPage);

  // Status badge color mapping
  const getStatusBadgeClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-600 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      case "completed":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Payment status mapping
  const getPaymentStatus = (booking: Booking): string => {
    if (booking.status === "cancelled") return "Refunded";
    if (booking.status === "pending") return "Unpaid";
    return "Paid";
  };

  // Format ID to show as #1001 format
  const formatBookingId = (id: string): string => {
    return `#${id.substring(0, 4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  // Loading state or unauthorized state
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-700 mb-6">
            Unable to authenticate. Please log in again.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bookings Management</h1>

          {error && (
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded">
              <p className="font-bold">Error</p>
              <p>Failed to fetch bookings: {error}</p>
              <button
                onClick={handleRefreshData}
                className="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Search and filters bar */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="relative w-full md:w-2/5">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Find by Name, Room or Table Number"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 border border-gray-300 bg-white px-3 py-2 rounded-md">
                Sort by:{" "}
                {sortBy === "newest"
                  ? "Newest"
                  : sortBy === "oldest"
                  ? "Oldest"
                  : sortBy === "guestsHigh"
                  ? "Most Guests"
                  : "Fewest Guests"}
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("guestsHigh")}>
                  Most Guests
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("guestsLow")}>
                  Fewest Guests
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="border border-gray-300 bg-white p-2 rounded-md"
              onClick={resetFilters}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status and Type filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <Select
            value={statusFilter}
            onValueChange={(value: StatusFilterType) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(value: BookingType) => setTypeFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Booking management card */}
        <div className="bg-white rounded-lg shadow-sm w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Booking Management</h2>
          </div>

          {/* Table using shadcn/ui Table */}
          <div className="overflow-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Customer Email</TableHead>
                  <TableHead>Menus</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Special Request</TableHead>
                  <TableHead>Table type</TableHead>
                  <TableHead>Room/Table</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBookings.length > 0 ? (
                  currentBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-medium">
                        {formatBookingId(booking._id)}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{booking.customerEmail}</TableCell>
                      <TableCell>{booking.meals && booking.meals.length > 0 ? booking.meals.join(", ") : "N/A"}</TableCell>
                      <TableCell>{booking.partySize}</TableCell>
                      <TableCell>{booking.specialRequest}</TableCell>
                      <TableCell>{booking.tableType}</TableCell>
                      <TableCell>
                        {editingBooking === booking._id ? (
                          <input
                            type="number"
                            min="1"
                            className="w-16 p-1 border border-gray-300 rounded"
                            value={
                              booking.type === "hotel"
                                ? editForm.roomNumber ||
                                  booking.roomNumber ||
                                  ""
                                : editForm.tableNumber ||
                                  booking.tableNumber ||
                                  ""
                            }
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (booking.type === "hotel") {
                                setEditForm({ ...editForm, roomNumber: value });
                              } else {
                                setEditForm({
                                  ...editForm,
                                  tableNumber: value,
                                });
                              }
                            }}
                          />
                        ) : booking.type === "hotel" ? (
                          `Room ${booking.roomNumber}`
                        ) : (
                          `Table ${booking.tableNumber}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingBooking === booking._id ? (
                          <input
                            type="number"
                            min="1"
                            max="20"
                            className="w-16 p-1 border border-gray-300 rounded"
                            value={editForm.guests || booking.guests || ""}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              setEditForm({ ...editForm, guests: value });
                            }}
                          />
                        ) : (
                          booking.guests
                        )}
                      </TableCell>
                      <TableCell>
                        {editingBooking === booking._id ? (
                          <Select
                            value={editForm.status || booking.status}
                            onValueChange={(
                              value:
                                | "confirmed"
                                | "pending"
                                | "cancelled"
                                | "completed"
                            ) => setEditForm({ ...editForm, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{getPaymentStatus(booking)}</TableCell>
                      <TableCell>
                        {editingBooking === booking._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSave(booking._id)}
                              className="text-green-600 hover:text-green-800"
                              aria-label="Save changes"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="text-red-600 hover:text-red-800"
                              aria-label="Cancel edit"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ) : showConfirmDelete === booking._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteBooking(booking._id)}
                              className="text-green-600 hover:text-green-800"
                              aria-label="Confirm delete"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setShowConfirmDelete(null)}
                              className="text-red-600 hover:text-red-800"
                              aria-label="Cancel delete"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(booking)}
                              className="text-blue-600 hover:text-blue-800"
                              aria-label="Edit booking"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setShowConfirmDelete(booking._id)}
                              className="text-red-600 hover:text-red-800"
                              aria-label="Delete booking"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-sm text-gray-500"
                    >
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination with shadcn Select */}
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700 flex items-center gap-2">
              Items per page:
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-700">
                {filteredBookings.length > 0
                  ? `${indexOfFirstItem + 1}-${Math.min(
                      indexOfLastItem,
                      filteredBookings.length
                    )} of ${filteredBookings.length}`
                  : "0-0 of 0"}
              </span>

              <div className="flex space-x-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages || 1)
                    )
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-1 rounded-md ${
                    currentPage === totalPages || totalPages === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
