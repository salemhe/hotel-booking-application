"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  Phone,
  Mail,
  Edit,
  Download,
  Share,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api/axios";

interface BookingDetails {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  vendorId: {
    businessName: string;
    address: string;
    phone: string;
    email: string;
    profileImages?: string[];
  };
  bookingDate: string;
  timeSlot: string;
  numberOfGuests: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  bookingType: "restaurant" | "hotel";
  roomDetails?: {
    roomType: string;
    checkIn: string;
    checkOut: string;
    numberOfRooms: number;
  };
  mealPreferences?: {
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    specialNotes?: string;
  };
}

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setBookingId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API
      const response = await API.get(`/users/bookings?bookingId=${bookingId}`);

      if (response.data && response.data.length > 0) {
        setBooking(response.data[0]);
      } else {
        // If no data from API, create mock data for demonstration
        const mockBooking: BookingDetails = {
          _id: bookingId,
          userId: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+234 123 456 7890",
          },
          vendorId: {
            businessName: "Kapadoccia Restaurant",
            address: "16, Idowu Taylor Street, Victoria Island, Lagos",
            phone: "+234 987 654 3210",
            email: "info@kapadoccia.com",
            profileImages: [
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center",
            ],
          },
          bookingDate: "2025-05-23",
          timeSlot: "19:30",
          numberOfGuests: 2,
          status: "confirmed",
          totalAmount: 45000,
          paymentStatus: "paid",
          specialRequests: "Window seat preferred, celebrating anniversary",
          createdAt: "2025-01-15T10:30:00Z",
          updatedAt: "2025-01-15T11:00:00Z",
          bookingType: "restaurant",
          mealPreferences: {
            items: [
              { name: "Mezze Platter", quantity: 2, price: 15000 },
              { name: "Chicken Springrolls", quantity: 1, price: 12000 },
              { name: "Spaghetti Carbonara", quantity: 1, price: 18000 },
            ],
            specialNotes: "No garlic, extra parmesan on pasta",
          },
        };
        setBooking(mockBooking);
      }
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError("Failed to load booking details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Failed
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Booking not found"}
          </h2>
          <Button onClick={() => router.push("/bookings")} variant="outline">
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Booking Details</h1>
              <p className="text-sm text-gray-500">Booking ID: {booking._id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {booking.vendorId.businessName}
                    </h2>
                    <div className="flex items-center gap-4 mb-2">
                      {getStatusBadge(booking.status)}
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </div>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden">
                    <img
                      src={
                        booking.vendorId.profileImages?.[0] ||
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop&crop=center"
                      }
                      alt={booking.vendorId.businessName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {formatDate(booking.bookingDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">
                          {formatTime(booking.timeSlot)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium">
                          {booking.numberOfGuests} people
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">
                          {booking.vendorId.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Special Requests
                    </h4>
                    <p className="text-gray-600">{booking.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Meal Preferences */}
            {booking.mealPreferences && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Pre-Selected Meals
                  </h3>
                  <div className="space-y-3">
                    {booking.mealPreferences.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">
                            {item.quantity}x {item.name}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  {booking.mealPreferences.specialNotes && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Special Notes:</strong>{" "}
                        {booking.mealPreferences.specialNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Restaurant
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {booking.vendorId.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {booking.vendorId.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Guest</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        {booking.userId.firstName} {booking.userId.lastName}
                      </p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{booking.userId.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{booking.userId.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{booking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Service Fee</span>
                    <span>₦0</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₦{booking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Payment Status</span>
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Booking Date</span>
                    <span>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {booking.status === "confirmed" && (
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      <Edit className="w-4 h-4 mr-2" />
                      Modify Booking
                    </Button>
                  )}

                  {booking.status === "pending" && (
                    <Button variant="outline" className="w-full">
                      Cancel Booking
                    </Button>
                  )}

                  {booking.status === "completed" && (
                    <Button variant="outline" className="w-full">
                      <Star className="w-4 h-4 mr-2" />
                      Leave Review
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
