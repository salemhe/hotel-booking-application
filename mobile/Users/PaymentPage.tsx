'use client';

import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Building, Smartphone, Check } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { Checkbox } from '../../app/components/ui/checkbox';
import BottomNavigation from './BottomNavigation';

interface PaymentData {
  amount: number;
  paymentMethod: 'card' | 'bank' | 'paystack';
  cardDetails: {
    nameOnCard: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    email: string;
    saveCard: boolean;
  };
}

const PaymentPage = () => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 42000, // This could be 150000 for hotel booking
    paymentMethod: 'card',
    cardDetails: {
      nameOnCard: 'John Doe',
      cardNumber: '0000 0000 0000 0000',
      expiryDate: 'MM/YY',
      cvv: '',
      email: 'your@email.com',
      saveCard: false
    }
  });

  const paymentMethods = [
    {
      id: 'card' as const,
      name: 'Card Payment',
      icon: CreditCard,
      description: 'Pay with credit or debit card'
    },
    {
      id: 'bank' as const,
      name: 'Bank Transfer',
      icon: Building,
      description: 'Transfer directly from your bank'
    },
    {
      id: 'paystack' as const,
      name: 'Paystack',
      icon: Smartphone,
      description: 'Pay with Paystack gateway'
    }
  ];

  const handleInputChange = (field: keyof PaymentData['cardDetails'], value: string | boolean) => {
    setPaymentData(prev => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        [field]: value
      }
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
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

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b">
        <button>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Make Payment</h1>
      </div>

      {/* Payment Method Tabs */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: method.id }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  paymentData.paymentMethod === method.id
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {method.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Form */}
      <div className="px-4 py-6 space-y-6">
        {paymentData.paymentMethod === 'card' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Name on Card
                  </Label>
                  <Input
                    value={paymentData.cardDetails.nameOnCard}
                    onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                    placeholder="John Doe"
                    className="border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Card Number
                  </Label>
                  <Input
                    value={paymentData.cardDetails.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="border-gray-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Expiry Date
                    </Label>
                    <Input
                      value={paymentData.cardDetails.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="border-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      CVV
                    </Label>
                    <Input
                      value={paymentData.cardDetails.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="border-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Email Address (For receipt)
                  </Label>
                  <Input
                    type="email"
                    value={paymentData.cardDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="border-gray-200"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveCard"
                    checked={paymentData.cardDetails.saveCard}
                    onCheckedChange={(checked) => handleInputChange('saveCard', checked as boolean)}
                  />
                  <Label htmlFor="saveCard" className="text-sm text-gray-600">
                    Save card for future reservations
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentData.paymentMethod === 'bank' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Bank Transfer Details</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Transfer the amount to the bank details below:
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Bank:</strong> GTBank</div>
                  <div><strong>Account Number:</strong> 0123456789</div>
                  <div><strong>Account Name:</strong> Restaurant Holdings Ltd</div>
                  <div><strong>Amount:</strong> ₦{paymentData.amount.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentData.paymentMethod === 'paystack' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Paystack Payment</h3>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-green-800 mb-2">
                  You will be redirected to Paystack to complete your payment securely.
                </p>
                <p className="text-xs text-green-600">
                  Amount: ₦{paymentData.amount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-4 right-4 space-y-3">
        {paymentData.paymentMethod === 'card' && (
          <>
            <button className="w-full py-3 text-gray-600 font-medium">
              Exit
            </button>
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
              Pay ₦{paymentData.amount.toLocaleString()} now
            </Button>
          </>
        )}
        
        {paymentData.paymentMethod === 'bank' && (
          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
            I have made the transfer
          </Button>
        )}
        
        {paymentData.paymentMethod === 'paystack' && (
          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
            Continue to Paystack
          </Button>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PaymentPage;
