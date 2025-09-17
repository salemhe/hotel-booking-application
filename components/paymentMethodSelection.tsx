"use client";

import { useEffect, useState } from "react";
import Paystack from "@paystack/inline-js";
interface PaystackResponse {
  status: string;
  reference: string;
}

// interface PaystackPopInterface {
//   inlinePay: (data: {
//     key: string;
//     email: string;
//     amount: number;
//     currency: string;
//     callback: (response: PaystackResponse) => void;
//     onClose: () => void;
//   }) => void;
// }

// declare global {
//   interface Window {
//     PaystackPop: PaystackPopInterface;
//   }
// }
import {
  ChevronRight,
  CreditCard,
  Utensils,
  Calendar,
  // Clock,
  Users,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PaymentForm from "@/components/paymentForm";
import Image from "next/image";
import { AuthService, UserProfile } from "@/services/userAuth.service";
import { AxiosError } from "axios";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

// Restaurant details
const RESTAURANT_INFO = {
  name: "Chicken Republic",
  address: "10, Ikorodu Road, Lagos",
  image: "/hero-bg.jpg",
  logo: "/hero-bg.jpg",
};

// Reservation details
const RESERVATION_DETAILS = {
  date: "Saturday, April 5, 2025",
  time: "7:30 PM",
  guests: 4,
  table: "#12",
  subtotal: 9200.0,
  vatRate: 0.18,
};

export default function PaymentMethodSelection({ id }: { id: string }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const [booking, setBooking] = useState<{
    totalPrice: number;
    businessName: string;
    location: string;
    date: string;
    guests: number;
    tableType: string;
    vendorId: string;
  }>({
    totalPrice: 0,
    businessName: "",
    location: "",
    date: "",
    guests: 0,
    tableType: "",
    vendorId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  function formatNumber(value: number): string {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          if (await AuthService.isAuthenticated()) {
            const token = await AuthService.getToken();
            const id = AuthService.extractUserId(token!);
            const profile = await AuthService.fetchMyProfile(id!);
            if (profile) {
              setUser(profile as UserProfile);
            } else {
              setUser(null);
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);

  function formatDate(dateString?: string): string {
    {
      return dateString
        ? new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        : "";
    }
  }

  const fetchBooking = async (id: string) => {
    setIsLoading(true);
    try {
      const bookings = await API.get(`/users/bookings?bookingId=${id}`);
      setBooking(bookings.data[0]);
    } catch (error) {
      if (error instanceof AxiosError)
        console.error(
          "Error fetching booking:",
          error.response?.data || error.message
        );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking(id);
  }, [id]);

  // Calculate total
  const subtotal = booking.totalPrice;
  const vat = subtotal * 0.115;
  const total = subtotal + vat;

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  // Handle Paystack checkout
  const handlePaystackCheckout = async () => {
    setIsRedirecting(true);

    // Check if the Paystack SDK is available
    if (Paystack) {
      const popup = new Paystack();

      try {
        if (!user?.email) {
          alert("User email is required for payment.");
          setIsRedirecting(false);
          return;
        }
        const paymentData = {
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
          email: user.email,
          amount: total * 100, 
          currency: "NGN",
          metadata: {
            vendorId: booking?.vendorId,
            bookingId: id,
            userId: user?.id,
            amount: subtotal,
            total,
            custom_fields: [
              {
                display_name: "Vendor ID",
                variable_name: "vendorId",
                value: booking?.vendorId,
              },
              {
                display_name: "Booking ID",
                variable_name: "bookingId",
                value: id,
              },
            ],
          },
          onSuccess: async (transaction: PaystackResponse) => {
            try {
              const response = await API.post("/users/verify-payment", {
                reference: transaction.reference,
              });

              if (response.data.status === "success") {
                alert("Payment verified successfully!");
                router.push(`/userDashboard/payment/${id}/success`);
              } else {
                alert("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              alert("Payment verification failed. Please try again.");
            }
          },
          onClose: () => {
            alert("Payment window closed.");
            setIsRedirecting(false);
          },
        };  
        popup.newTransaction(paymentData);
      } catch (error) {
        console.error("Error initializing Paystack:", error);
        setIsRedirecting(false);
        return;
      } finally {
        setIsRedirecting(false);
      }

      // Start the Paystack payment process
      // paystack.inlinePay(paymentData);
    } else {
      console.error("Paystack SDK is not available.");
      setIsRedirecting(false);
    }
  };

  // Go back to payment selection
  const handleBack = () => {
    setSelectedPaymentMethod(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <p className="ml-4 text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            <p className="ml-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Restaurant header */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-white p-1 shadow-md">
                <Image
                  src={RESTAURANT_INFO.logo || "/placeholder.svg"}
                  alt={booking?.businessName || "Restaurant Logo"}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {booking?.businessName || RESTAURANT_INFO.name}
                </h1>
                <p className="text-gray-600">
                  {booking?.location || RESTAURANT_INFO.address}
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Reservation details */}
              <Card className="md:col-span-1 overflow-hidden shadow-lg rounded-lg">
                <div className="h-48 overflow-hidden">
                  <Image
                    src={RESTAURANT_INFO.image || "/placeholder.svg"}
                    alt={booking?.businessName || "Restaurant Logo"}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Reservation Details
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-800">
                          {formatDate(booking?.date) ||
                            RESERVATION_DETAILS.date}
                        </p>
                      </div>
                    </div>

                    {/* <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-800">
                    {RESERVATION_DETAILS.time}
                  </p>
                </div>
              </div> */}

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium text-gray-800">
                          {booking?.guests || RESERVATION_DETAILS.guests} people
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Utensils className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Table</p>
                        <p className="font-medium text-gray-800">
                          {booking?.tableType || RESERVATION_DETAILS.table}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Reservation fee</span>
                      <span className="font-medium text-gray-800">
                        ₦{" "}
                        {formatNumber(
                          booking?.totalPrice || RESERVATION_DETAILS.subtotal
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-500">
                        VAT ({(11.5).toFixed(1)}%)
                      </span>
                      <span className="font-medium text-gray-800">
                        ₦ {formatNumber(vat)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg text-gray-800">
                      <span>Total</span>
                      <span>
                        ₦ {formatNumber(total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right column - Payment method selection or form */}
              <Card>
                <CardContent className="p-6">
                  {selectedPaymentMethod === null ? (
                    <>
                      <h2 className="text-xl font-semibold mb-6 text-gray-800">
                        Select Payment Method
                      </h2>

                      <div className="grid gap-4">
                        {/* Credit Card Option */}
                        <button
                          onClick={() => handlePaymentMethodSelect("card")}
                          className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-500/5 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium text-gray-800">
                                Credit/Debit Card
                              </h3>
                              <p className="text-sm text-gray-500">
                                Pay directly with your card
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>

                        {/* Paystack Option */}
                        <button
                          onClick={() => handlePaymentMethodSelect("paystack")}
                          className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-500/5 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-[#0BA4DB]/10 p-3 rounded-full">
                              <Image
                                src="/paystack.svg"
                                alt="Paystack Logo"
                                width={24}
                                height={24}
                                className="h-6 w-6 text-[#0BA4DB]"
                              />
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium text-gray-800">
                                Paystack
                              </h3>
                              <p className="text-sm text-gray-500">
                                Fast and secure payment with Paystack
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>

                      <div className="mt-8 text-center text-sm text-gray-500">
                        <p>Your payment information is processed securely.</p>
                        <p>We do not store your card details on our servers.</p>
                      </div>
                    </>
                  ) : selectedPaymentMethod === "card" ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBack}
                          className="p-0 h-auto"
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Back
                        </Button>
                        <h2 className="text-xl font-semibold text-gray-800">
                          Card Payment
                        </h2>
                      </div>
                      <PaymentForm total={booking?.totalPrice || total} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="mb-6">
                        <Image
                          src="/paystack.svg"
                          alt="Paystack Logo"
                          width={64}
                          height={64}
                          className="h-16 w-16 text-[#0BA4DB]"
                        />
                      </div>
                      <h2 className="text-xl font-semibold mb-4 text-center">
                        Redirecting to Paystack
                      </h2>
                      <p className="text-gray-600 text-center mb-6">
                        You&apos;ll be redirected to Paystack&apos;s secure
                        payment page to complete your transaction.
                      </p>
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={handleBack}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePaystackCheckout}
                          disabled={isRedirecting}
                          className="bg-[#0BA4DB] hover:bg-[#0994C6] text-white"
                        >
                          {isRedirecting ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                              Redirecting...
                            </span>
                          ) : (
                            "Continue to Paystack"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>© 2025 {RESTAURANT_INFO.name}. All rights reserved.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}