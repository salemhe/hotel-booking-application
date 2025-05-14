// vendorDashboard/payments/initializePayment.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { initializePayment } from "@/lib/paystack";
import { toast } from "sonner";
import axios from "axios";

export default function InitializePayment() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  // const [isProcessing, setIsProcessing] = useState(false);

  const handleInitializePayment = async () => {
    setLoading(true);
    try {
      const koboAmount = parseFloat(amount) * 100;

      // First, send transaction details to your backend for logging or additional processing
      const transactionData = {
        email,
        amount: koboAmount,
        reference: `txn-${Date.now()}`, // Example reference, you can generate your own
        reason: "Payment for services", // Customize as needed
      };

      // Log transaction data to your server
      await axios.post("/api/vendor/payment/initialize", transactionData);

      // Then, call Paystack to initialize the payment
      // const res = await initializePayment({ email, amount: koboAmount });

      // if (res?.authorization_url) {
      //   // Redirect the user to Paystack for payment authorization
      //   window.location.href = res.authorization_url;
      // } else {
      //   toast.error("Failed to initialize payment");
      // }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Customer Email</label>
        <Input
          type="email"
          placeholder="e.g. user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount (₦)</label>
        <Input
          type="number"
          placeholder="e.g. 5000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button onClick={handleInitializePayment} disabled={loading}>
        {loading ? "Processing..." : "Initialize Payment"}
      </Button>
    </div>
  );
}
