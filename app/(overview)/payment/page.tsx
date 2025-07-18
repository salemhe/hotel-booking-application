"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    name: "John Doe",
    number: "0000 0000 0000 0000",
    expiry: "",
    cvv: "",
    email: "your@email.com",
    saveCard: false,
  });

  const handlePayment = () => {
    // Process payment logic here
    router.push("/payment/success");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Make Payment
              </h1>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger
                  value="card"
                  className="text-sm data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  Card Payment
                </TabsTrigger>
                <TabsTrigger value="bank" className="text-sm">
                  Bank Transfer
                </TabsTrigger>
                <TabsTrigger value="paystack" className="text-sm">
                  Paystack
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">
                    Payment Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name on Card
                      </label>
                      <Input
                        value={cardDetails.name}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            name: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <Input
                        value={cardDetails.number}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            number: e.target.value,
                          })
                        }
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <Input
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiry: e.target.value,
                            })
                          }
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <Input
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvv: e.target.value,
                            })
                          }
                          placeholder="CVV"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address (for receipt)
                      </label>
                      <Input
                        value={cardDetails.email}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            email: e.target.value,
                          })
                        }
                        placeholder="your@email.com"
                        type="email"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="save-card"
                        checked={cardDetails.saveCard}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            saveCard: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <label
                        htmlFor="save-card"
                        className="text-sm text-gray-700"
                      >
                        Save card for future reservations
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-6">
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Bank transfer payment details will be displayed here
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="paystack" className="space-y-6">
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Paystack payment integration will be displayed here
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Exit
              </Button>
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={handlePayment}
              >
                Pay ₦42,000 now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
