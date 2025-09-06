"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CreditCard, Users } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import SplitPaymentForm from "@/app/components/SplitPaymentForm";
import { toast } from "sonner";

export default function RestaurantSplitPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  
  // In a real application, this would be fetched from an API
  const [reservation, setReservation] = useState({
    id: "res-" + Math.random().toString(36).substring(2, 10),
    restaurantName: "Gourmet Haven",
    date: new Date().toISOString(),
    time: "19:00",
    guests: 4,
    totalAmount: 24500, // Amount in Naira
    status: "pending",
  });

  const handleSplitPaymentComplete = async (data: any) => {
    try {
      // In a real application, this would be an API call
      console.log("Processing split payment:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update reservation status
      setReservation(prev => ({
        ...prev,
        status: "processing_payment",
      }));
      
      toast.success("Split payment initiated successfully!");
      
      // Navigate to confirmation page
      router.push(`/restaurants/${restaurantId}/confirmation?splitPayment=true`);
    } catch (error) {
      console.error("Error processing split payment:", error);
      toast.error("Failed to process split payment. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Payment Options
      </Button>

      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle>Reservation Summary</CardTitle>
            <CardDescription>
              Review your reservation details before proceeding with payment
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Restaurant</h3>
                <p className="text-lg font-semibold">{reservation.restaurantName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reservation ID</h3>
                <p className="text-lg font-semibold">{reservation.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                <p className="text-lg font-semibold">
                  {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Number of Guests</h3>
                <p className="text-lg font-semibold">{reservation.guests} people</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ₦{reservation.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <SplitPaymentForm
            totalAmount={reservation.totalAmount}
            onComplete={handleSplitPaymentComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}