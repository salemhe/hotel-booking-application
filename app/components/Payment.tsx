"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { AuthService, UserProfile } from "../lib/api/services/userAuth.service";
import API from "../lib/api/userAxios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function PaymentPage({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [user, setUser] = useState<UserProfile | null>(null);
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

  function calculateSplitPaymentAmount(
    vendorAmount: number,
    platformPercent: number = 0.1
  ): {
    totalAmount: number;
    paystackFee: number;
    platformCut: number;
    vendorCut: number;
  } {
    const paystackPercent = 0.015;

    // Step 1: Calculate total amount before Paystack cap
    let estimatedTotal = vendorAmount / (1 - platformPercent - paystackPercent);

    // Step 2: Calculate paystack fee
    let paystackFee = estimatedTotal * paystackPercent;

    // Step 3: Cap the fee at ₦2000
    if (paystackFee > 2000) {
      paystackFee = 2000;
      estimatedTotal = (vendorAmount + 2000) / (1 - platformPercent);
    }

    const platformCut = estimatedTotal * platformPercent;

    return {
      totalAmount: Math.round(estimatedTotal), // Send this to Paystack
      paystackFee: Math.round(paystackFee),
      platformCut: Math.round(platformCut),
      vendorCut: vendorAmount, // exactly what vendor wants
    };
  }

  const totalPrice = calculateSplitPaymentAmount(booking.totalPrice, 0.08);
  
  const handlePayClick = async () => {
    if (paymentMethod === "paystack") {
      try {
        setIsLoading(true);
        const res = await API.post("/users/make-payment", {
          amount: totalPrice.totalAmount,
          email: user?.email,
          vendorId: booking.vendorId,
          bookingId: id,
        });
        const ref = res.data.data.ref
        console.log(ref)
        router.push(res.data.data.authorization_url);
      } catch (error) {
        console.log(error);
        toast.error("Failed to redirect to Paystack");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      // router.push("/confirmation");
    }
  };

  const paymentOptions = [
    { id: "card", label: "Card Payment" },
    { id: "bankTransfer", label: "Bank Transfer" },
    { id: "paystack", label: "Paystack" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (await AuthService.isAuthenticated()) {
          const token = await AuthService.getToken();
          const id = AuthService.extractUserId(token!);
          setUser(await AuthService.getUser(id!));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const fetchBooking = async (id: string) => {
    setIsLoading(true);
    try {
      const bookings = await API.get(`/users/bookings?bookingId=${id}`);
      setBooking(bookings.data[0]);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Error fetching booking:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401 || error.response?.status === 403) {
          router.replace(
            `/user-login?redirect=${encodeURIComponent(`/payment/${id}`)}`
          );
        }
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking(id);
  }, [id]);

  // const handlePaystackCheckout = async () => {
  //   setIsRedirecting(true);

  //   // Check if the Paystack SDK is available
  //   if (Paystack) {
  //     const popup = new Paystack();

  //     try {
  //       if (!user?.email) {
  //         alert("User email is required for payment.");
  //         setIsRedirecting(false);
  //         return;
  //       }
  //       const paymentData = {
  //         key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  //         email: user.email,
  //         amount: total * 100,
  //         currency: "NGN",
  //         metadata: {
  //           vendorId: booking?.vendorId,
  //           bookingId: id,
  //           userId: user?.id,
  //           amount: subtotal,
  //           total,
  //           custom_fields: [
  //             {
  //               display_name: "Vendor ID",
  //               variable_name: "vendorId",
  //               value: booking?.vendorId,
  //             },
  //             {
  //               display_name: "Booking ID",
  //               variable_name: "bookingId",
  //               value: id,
  //             },
  //           ],
  //         },
  //         onSuccess: async (transaction: PaystackResponse) => {
  //           try {
  //             const response = await API.post("/users/verify-payment", {
  //               reference: transaction.reference,
  //             });

  //             if (response.data.status === "success") {
  //               alert("Payment verified successfully!");
  //               router.push(`/confirmation`);
  //             } else {
  //               alert("Payment verification failed. Please contact support.");
  //             }
  //           } catch (error) {
  //             console.error("Error verifying payment:", error);
  //             alert("Payment verification failed. Please try again.");
  //           }
  //         },
  //         onClose: () => {
  //           alert("Payment window closed.");
  //           setIsRedirecting(false);
  //         },
  //       };
  //       popup.newTransaction(paymentData);
  //     } catch (error) {
  //       console.error("Error initializing Paystack:", error);
  //       setIsRedirecting(false);
  //       return;
  //     } finally {
  //       setIsRedirecting(false);
  //     }

  //     // Start the Paystack payment process
  //     // paystack.inlinePay(paymentData);
  //   } else {
  //     console.error("Paystack SDK is not available.");
  //     setIsRedirecting(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4 md:px-6 md:py-6">
      <div className="max-w-md mx-auto">
        <Card className="border border-gray-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Make Payment
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* Payment Method Tabs */}
            <div className="flex gap-1 mb-6">
              {paymentOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={paymentMethod === option.id ? "outline" : "ghost"}
                  className={`flex-1 h-7 text-xs border ${
                    paymentMethod === option.id
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-gray-600"
                  } bg-teal-50 font-medium`}
                  onClick={() => setPaymentMethod(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Payment Details
              </h3>
              {paymentMethod === "bankTransfer" && (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="cardName"
                      className="text-sm font-medium text-gray-900 mb-1 block"
                    >
                      Name on Card
                    </Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      className="h-9 text-sm border-gray-300 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="cardNumber"
                      className="text-sm font-medium text-gray-900 mb-1 block"
                    >
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      className="h-9 text-sm border-gray-300 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-1 block">
                      Expiry Date
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="MM/YY"
                        className="h-9 text-sm border-gray-300 focus:border-teal-500"
                      />
                      <Input
                        placeholder="CVV"
                        className="h-9 text-sm border-gray-300 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900 mb-1 block"
                    >
                      Email Address (For receipt)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-9 text-sm border-gray-300 focus:border-teal-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="saveCard" className="w-4 h-4" />
                    <Label htmlFor="saveCard" className="text-sm text-gray-700">
                      Save card for future reservations
                    </Label>
                  </div>
                </div>
              )}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="cardName"
                      className="text-sm font-medium text-gray-900 mb-1 block"
                    >
                      Name on Card
                    </Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      className="h-9 text-sm border-gray-300 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="cardNumber"
                      className="text-sm font-medium text-gray-900 mb-1 block"
                    >
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      className="h-9 text-sm border-gray-300 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-1 block">
                      Expiry Date
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="MM/YY"
                        className="h-9 text-sm border-gray-300 focus:border-teal-500"
                      />
                      <Input
                        placeholder="CVV"
                        className="h-9 text-sm border-gray-300 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900 mb-1 block"
                    >
                      Email Address (For receipt)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              )}
              {paymentMethod === "paystack" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    You will be redirected to Paystack to complete your payment.
                  </p>
                  {/* <div>
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
                    </Button> */}
                  {/* </div> */}
                </div>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                className="w-1/3 h-11 text-sm font-medium border-gray-300"
              >
                Exit
              </Button>
              <Button
                className="w-2/3 h-11 text-sm font-medium bg-[#0A6C6D] hover:bg-teal-800"
                onClick={handlePayClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ₦${totalPrice.totalAmount.toLocaleString()} now`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
