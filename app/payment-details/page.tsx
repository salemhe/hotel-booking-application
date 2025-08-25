"use client";

import { Suspense } from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { 
  ArrowLeft,
  CreditCard,
  Building2,
  Smartphone
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';



function PaymentDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '42000';

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    email: '',
    saveCard: false
  });
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      router.push(`/payment-success?amount=${amount}&method=card`);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Create New Reservation
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Reservation Details</span>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Preselect meal</span>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-teal-600">Payment</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Make Payment</h1>
            </div>

            {/* Payment Method Tabs */}
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card" className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Card Payment</span>
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Bank Transfer</span>
                </TabsTrigger>
                <TabsTrigger value="paystack" className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Paystack</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-6 mt-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Payment Details</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Expiry Date</Label>
                      <Input
                        id="expiryMonth"
                        placeholder="MM/YY"
                        value={formData.expiryMonth}
                        onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address (For receipt)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={formData.saveCard}
                      onChange={(e) => handleInputChange('saveCard', e.target.checked)}
                    />
                    <Label htmlFor="saveCard" className="text-sm">
                      Save card for future reservations
                    </Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-6 mt-6">
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Bank Transfer</h3>
                  <p className="text-gray-600">Bank transfer payment option will be available soon</p>
                </div>
              </TabsContent>

              <TabsContent value="paystack" className="space-y-6 mt-6">
                <div className="text-center py-12">
                  <Smartphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Paystack</h3>
                  <p className="text-gray-600">Paystack payment integration coming soon</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => router.back()}>
                Exit
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={processing || !formData.cardName || !formData.cardNumber || !formData.email}
                className="bg-teal-600 hover:bg-teal-700 min-w-40"
              >
                {processing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay ₦${parseInt(amount).toLocaleString()} now`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment details...</div>}>
      <PaymentDetailsContent />
    </Suspense>
  );
}
