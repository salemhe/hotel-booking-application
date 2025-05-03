"use client";

import { useState, useEffect } from "react";
import {  useRouter } from "next/navigation";
// import PaystackPop from '@paystack/inline-js';
import {
  ChevronRight,
  CreditCard,
  Utensils,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AuthService } from "@/services/userAuth.services";
import { UserProfile } from "./Navigation";
import { useToast } from "@/hooks/use-toast";
import  API  from "@/utils/axios";

// Types for Paystack callback
interface PaystackResponse {
  status: string;
  reference: string;
}

interface PaystackPopConstructor {
  newTransaction(config: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    callback: (response: PaystackResponse) => void;
    metadata?: {
      custom_fields: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
  } & {
    onClose?: () => void;
  }): void;
}

declare global {
  interface Window {
    PaystackPop: PaystackPopConstructor;
  }
}

// Structure we saved in sessionStorage in RestaurantPage
interface ReservationDetails {
  bookingId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: number;
  menuId: string;
  menuItem: string;
  menuPrice: number;
  restaurantImage?: string;
  restaurantLogo?: string;
}

export default function PaymentMethodSelection() {
  // const { bookingId } = useParams();
  const router = useRouter();
  const profile = AuthService.getUser() as UserProfile;

  const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  // Hydrate details from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("pendingReservation");
    if (stored) {
      setReservationDetails(JSON.parse(stored));
    } else {
      setError("No reservation data found. Please start again.");
    }
    setLoading(false);
  }, []);

  // Format numbers for display
  function formatNumber(value: number): string {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Payment handlers
  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

// ... existing code ...

const handlePaystackCheckout = async () => {
  if (!reservationDetails || !profile?.email) return;
  setIsRedirecting(true);

  try {
      // Call the server endpoint to initialize payment
      const response = await API.post('/users/make-payment', {
          email: profile.email,
          amount: String(Math.round(total)), // Convert to string as per API docs
          vendorId: reservationDetails.restaurantId
      });

      // Store the reference for verification
      sessionStorage.setItem('paymentRef', response.data.data.ref);
      
      // Redirect to Paystack payment page
      window.location.href = response.data.data.authorization_url;
  } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
          title: "Payment Error",
          description: error instanceof Error ? error.message : "Could not initialize payment",
          variant: "destructive"
      });
      setIsRedirecting(false);
  }
};
// Update payment verification function
useEffect(() => {
  const verifyPayment = async () => {
      const paymentRef = sessionStorage.getItem('paymentRef');
      if (!paymentRef) return;

      try {
          // Call the server endpoint to verify payment
          const response = await API.post('/users/verify-payment', {
              reference: paymentRef
          });
          
          const paymentStatus = response.data;
          
          if (paymentStatus.status === 'success') {
              // Update booking status based on the type
              await API.patch(`/users/bookings/update/${reservationDetails?.bookingId}`, {
                  type: 'restaurant',
                  vendor: reservationDetails?.restaurantId,
                  tableNumber: reservationDetails?.tableNumber,
                  guests: reservationDetails?.guests
              });

              toast({
                  title: "Payment Successful",
                  description: "Your booking has been confirmed!",
              });

              router.push('/userDashboard/bookings');
          }
      } catch (error) {
          console.error('Payment verification failed:', error);
          toast({
              title: "Verification Failed",
              description: "Please contact support with your reference: " + paymentRef,
              variant: "destructive"
          });
      } finally {
          sessionStorage.removeItem('paymentRef');
      }
  };

  verifyPayment();
}, [reservationDetails]);


  const handleBack = () => {
    setSelectedPaymentMethod(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48"><span className="animate-spin h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full"/></div>;
  }
  if (error || !reservationDetails) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  const {
    restaurantName,
    restaurantAddress,
    restaurantImage,
    restaurantLogo,
    date,
    time,
    guests,
    tableNumber,
    // menuId,
    menuItem,
    menuPrice,
  } = reservationDetails;

  // Calculate totals
  const subtotal = menuPrice;
  const vatRate = 0.18;
  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full overflow-hidden bg-white p-1 shadow-md">
          {restaurantLogo ? (
            <Image src={restaurantLogo} alt={restaurantName} width={64} height={64} className="w-full h-full object-cover rounded-full" />
          ) : null}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{restaurantName}</h1>
          <p className="text-gray-600">{restaurantAddress}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reservation summary */}
        <Card className="overflow-hidden shadow-lg rounded-lg">
          {restaurantImage && (
            <div className="h-48 overflow-hidden">
              <Image src={restaurantImage} alt={restaurantName} width={300} height={200} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
            </div>
          )}
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Reservation Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">{date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-800">{time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium text-gray-800">{guests} {guests === 1 ? 'person' : 'people'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Utensils className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Table</p>
                  <p className="font-medium text-gray-800">#{tableNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Utensils className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Menu Item</p>
                  <p className="font-medium text-gray-800">{menuItem}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Reservation fee</span>
                <span className="font-medium text-gray-800">₦ {formatNumber(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-500">VAT ({(vatRate*100).toFixed(0)}%)</span>
                <span className="font-medium text-gray-800">₦ {formatNumber(vat)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-gray-800">
                <span>Total</span>
                <span>₦ {formatNumber(total)}</span>
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
                        <h3 className="font-medium text-gray-800">Paystack</h3>
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
                {/* <PaymentForm total={total} /> */}
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
                  You&apos;ll be redirected to Paystack&apos;s secure payment
                  page to complete your transaction.
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
      {/* <div className="text-center text-sm text-gray-500 mt-4">
        <p>© 2025 {RESTAURANT_INFO.name}. All rights reserved.</p>
      </div> */}
    </div>
  );
}
