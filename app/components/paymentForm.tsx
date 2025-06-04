"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Check, X, CreditCardIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import Image from "next/image";

// Card types and their logos (using actual card brand SVGs)
const CARD_TYPES = {
  mastercard: (
    <Image
      src="/mastercard.svg"
      alt="Mastercard"
      className="h-6 w-8"
      width={32}
      height={32}
      unoptimized
    />
  ),
  verve: (
    <Image
      src="/verve.svg"
      alt="Verve Card"
      className="h-6 w-8"
      width={32}
      height={32}
      unoptimized
    />
  ),
  default: (
    <CreditCardIcon
      className="h-6 w-8"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    />
  ),
};

// Form schema
const formSchema = z.object({
  cardholderName: z.string().min(3, { message: "Name is required" }),
  cardNumber: z
    .string()
    .min(16, { message: "Card number must be at least 16 digits" })
    .max(19, { message: "Card number must not exceed 19 digits" })
    .regex(/^[0-9\s]+$/, { message: "Card number must contain only digits" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, {
    message: "Invalid expiry date format (MM/YY)",
  }),
  cvv: z
    .string()
    .min(3, { message: "CVV must be at least 3 digits" })
    .max(4, { message: "CVV must not exceed 4 digits" })
    .regex(/^[0-9]+$/, { message: "CVV must contain only digits" }),
  country: z.string().min(1, { message: "Country is required" }),
  savePaymentMethod: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;
export default function PaymentForm( {total}: {total: number}) {
  const [showCVV, setShowCVV] = useState(false);
  const [cardType, setCardType] = useState<keyof typeof CARD_TYPES>("default");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiry, setExpiry] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showTrackDialog, setShowTrackDialog] = useState(false);
  const [reservationId, setReservationId] = useState("");

  function formatNumber(value: number): string {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      savePaymentMethod: false,
    },
  });

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    if (!value) return;
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // // Format expiry date
  // const formatExpiryDate = (value: string) => {
  //   const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

  //   if (v.length >= 2) {
  //     return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  //   }

  //   return v;
  // };

  // Detect card type using Paystack BIN API
  const detectCardType = async (cardNumber: string) => {
    if (cardNumber.length < 6) {
      setCardType("default");
      return;
    }

    const bin = cardNumber.replace(/\s/g, "").substring(0, 6);

    try {
      const response = await fetch(
        `https://api.paystack.co/decision/bin/${bin}`
      );
      const data = await response.json();

      if (data.status && data.data) {
        const brand = data.data.brand?.toLowerCase();
        if (brand === "mastercard") {
          setCardType("mastercard");
        } else if (brand === "verve") {
          setCardType("verve");
        } else {
          setCardType("default");
        }
      }
    } catch (error) {
      console.error("Error detecting card type:", error);
      setCardType("default");
    }
  };

  // Watch card number changes
  const cardNumber = form.watch("cardNumber");

  useEffect(() => {
    if (cardNumber) {
      detectCardType(cardNumber);
    } else {
      setCardType("default");
    }
  }, [cardNumber]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      // In a real app, you would send the payment data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a random reservation ID
      const newReservationId = `RES-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      setReservationId(newReservationId);
      console.log("Payment data:", data);

      // Show success notification
      setNotification({
        type: "success",
        message: "Payment processed successfully!",
      });

      // Show the track reservation dialog
      setTimeout(() => {
        setShowTrackDialog(true);
      }, 1000);

      // Reset form after successful payment
      setTimeout(() => {
        form.reset();
      }, 2000);
    } catch {
      // Show error notification
      setNotification({
        type: "error",
        message: "Payment failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  // Handles input formatting while typing
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric chars

    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    setExpiry(value);
    form.setValue("expiryDate", value, { shouldValidate: true });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="cardholderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Cardholder Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Smith"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  Credit Card Number
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="bg-white pr-10"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                        const formatted = formatCardNumber(value);
                        field.onChange(formatted);
                      }}
                      maxLength={19}
                    />
                    {cardNumber && cardNumber.trim() !== "" && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {CARD_TYPES[cardType]}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Expiration Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="text-lg p-2 border rounded-md w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">CVV</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCVV ? "text" : "password"}
                        placeholder="123"
                        className="bg-white pr-10"
                        {...field}
                        maxLength={3}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCVV(!showCVV)}
                      >
                        {showCVV ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="sr-only">
                          {showCVV ? "Hide CVV" : "Show CVV"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="savePaymentMethod"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Save the payment method
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </span>
            ) : (
              `Pay ₦ ${formatNumber(total)}`
            )}
          </Button>
        </form>
      </Form>

      {/* Notification popup */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-1.5 rounded-full ${
                  notification.type === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {notification.type === "success" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-medium ${
                    notification.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {notification.type === "success" ? "Success" : "Error"}
                </h3>
                <p
                  className={`text-sm ${
                    notification.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track Reservation Dialog */}
      <Dialog open={showTrackDialog} onOpenChange={setShowTrackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Payment Successful!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your reservation has been confirmed. Reservation ID:{" "}
              {reservationId}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center text-gray-700 mb-6">
              Thank you for your payment. Your table reservation has been
              confirmed.
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowTrackDialog(false)}
            >
              Track Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
