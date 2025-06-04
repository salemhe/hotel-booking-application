"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

export default function SplitSetup() {
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLinkBank = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/vendor/payments/split-account", {
        bankCode,
        accountNumber,
      });

      if (res.status === 200) {
        toast.success("Bank linked successfully!");
      } else {
        toast.error("Failed to link bank account.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while linking bank account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Setup Split Payments</h2>
      <p className="text-sm text-gray-600">
        Link your preferred bank account to receive earnings through Paystack split payments.
      </p>

      <div>
        <label className="block text-sm font-medium mb-1">Bank Code</label>
        <Input
          type="text"
          placeholder="e.g. 058 for GTBank"
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Account Number</label>
        <Input
          type="text"
          placeholder="e.g. 0123456789"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>

      <Button onClick={handleLinkBank} disabled={loading}>
        {loading ? "Linking..." : "Link Bank Account"}
      </Button>
    </div>
  );
}
