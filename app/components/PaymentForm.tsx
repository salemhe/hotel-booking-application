"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface PaymentFormProps {
  amount: number;
  onPayment: (paymentData: any) => void;
  onExit: () => void;
}

export default function PaymentForm({
  amount,
  onPayment,
  onExit,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
    email: "",
    saveCard: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPayment({
      method: paymentMethod,
      amount,
      ...cardData,
    });
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Make Payment</h2>
      </div>

      <Tabs
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="card"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:border-teal-600"
          >
            Card Payment
          </TabsTrigger>
          <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          <TabsTrigger value="paystack">Paystack</TabsTrigger>
        </TabsList>

        <TabsContent value="card" className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Payment Details</h3>

              <div>
                <Label htmlFor="name">Name on Card</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) =>
                    setCardData({ ...cardData, name: e.target.value })
                  }
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="number">Card Number</Label>
                <Input
                  id="number"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardData.number}
                  onChange={(e) =>
                    setCardData({
                      ...cardData,
                      number: formatCardNumber(e.target.value),
                    })
                  }
                  className="mt-1"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        expiry: formatExpiry(e.target.value),
                      })
                    }
                    className="mt-1"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="CVV"
                    value={cardData.cvv}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        cvv: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="mt-1"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address (For receipt)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={cardData.email}
                  onChange={(e) =>
                    setCardData({ ...cardData, email: e.target.value })
                  }
                  className="mt-1"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="save-card"
                  checked={cardData.saveCard}
                  onCheckedChange={(checked) =>
                    setCardData({ ...cardData, saveCard: checked as boolean })
                  }
                />
                <Label htmlFor="save-card" className="text-sm">
                  Save card for future reservations
                </Label>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onExit}
                className="flex-1"
              >
                Exit
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Pay ₦{amount.toLocaleString()} now
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="bank" className="mt-6">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Bank transfer details will be provided
            </p>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onExit}
                className="flex-1"
              >
                Exit
              </Button>
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                onClick={() => onPayment({ method: "bank", amount })}
              >
                Continue with Bank Transfer
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="paystack" className="mt-6">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              You will be redirected to Paystack
            </p>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onExit}
                className="flex-1"
              >
                Exit
              </Button>
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                onClick={() => onPayment({ method: "paystack", amount })}
              >
                Continue with Paystack
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
