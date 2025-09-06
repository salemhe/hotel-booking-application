"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useRouter } from "next/navigation";
import { AuthService, UserProfile } from "../lib/api/services/userAuth.service";
import API from "../lib/api/userAxios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function PaymentPage({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
  const paystackFlatFee = 100;
  const flatFeeThreshold = 2500;
  const paystackCap = 2000;

  // Start with a rough estimate
  const estimatedTotal = vendorAmount / ((1 - platformPercent) * (1 - paystackPercent));
  let flatFee = estimatedTotal > flatFeeThreshold ? paystackFlatFee : 0;

  const paystackFee = Math.min(estimatedTotal * paystackPercent, paystackCap);
  const totalWithFlatFee = (vendorAmount + paystackFee + flatFee) / (1 - platformPercent);

  // Recalculate after flat fee is considered
  if (totalWithFlatFee > flatFeeThreshold) {
    flatFee = paystackFlatFee;
  } else {
    flatFee = 0;
  }

  // Final total
  const finalTotal = (vendorAmount + flatFee + paystackFee) / (1 - platformPercent);
  const platformCut = finalTotal * platformPercent;

  return {
    totalAmount: Math.round(finalTotal),
    paystackFee: Math.round(paystackFee + flatFee),
    platformCut: Math.round(platformCut),
    vendorCut: vendorAmount
  };
}


  const totalPrice = calculateSplitPaymentAmount(booking.totalPrice, 0.08);
  
  const handlePayClick = async () => {
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
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (await AuthService.isAuthenticated()) {
          const token = await AuthService.getToken();
          const id = AuthService.extractUserId(token!);
          setUser(await AuthService.fetchMyProfile(id!));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const fetchBooking = useCallback(async (id: string) => {
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
  }, [router]);

  useEffect(() => {
    fetchBooking(id);
  }, [id, fetchBooking]);

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
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Payment Details
              </h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    You will be redirected to Paystack to complete your payment.
                  </p>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                className="w-1/3 h-11 text-sm font-medium border-gray-300"
                onClick={() => {
                  router.back()
                }}
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
