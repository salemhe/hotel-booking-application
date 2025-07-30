"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign,
  Shield,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface ReservationSummary {
  restaurantName: string;
  location: string;
  date: string;
  time: string;
  guests: string;
  meals: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  serviceFee: number;
  total: number;
  reservationId?: string;
}

export default function PaymentSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'mobile' | 'bank'>('card');
  const [loading, setLoading] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationSummary | null>(null);
  
  // Card payment form
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Mobile payment form
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Load reservation data from localStorage or URL params
    const storedData = localStorage.getItem('reservationData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setReservationData(parsed);
      } catch (error) {
        console.error('Error parsing reservation data:', error);
      }
    }
  }, []);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length <= 16) {
        setCardData(prev => ({ ...prev, [field]: formattedValue }));
      }
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      if (formattedValue.length <= 5) {
        setCardData(prev => ({ ...prev, [field]: formattedValue }));
      }
    } else if (field === 'cvv') {
      if (value.length <= 3 && /^\d*$/.test(value)) {
        setCardData(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setCardData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validatePayment = () => {
    if (selectedPaymentMethod === 'card') {
      const { cardNumber, expiryDate, cvv, cardName } = cardData;
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        toast.error('Please fill in all card details');
        return false;
      }
      if (cardNumber.replace(/\s/g, '').length < 13) {
        toast.error('Please enter a valid card number');
        return false;
      }
      if (cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    } else if (selectedPaymentMethod === 'mobile') {
      if (!phoneNumber || phoneNumber.length < 11) {
        toast.error('Please enter a valid phone number');
        return false;
      }
    }
    return true;
  };

  const processPayment = async () => {
    if (!validatePayment()) return;
    
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would integrate with payment gateway here
      const paymentData = {
        method: selectedPaymentMethod,
        amount: reservationData?.total || 0,
        currency: 'NGN',
        reference: `RES_${Date.now()}`,
        ...(selectedPaymentMethod === 'card' && { cardData }),
        ...(selectedPaymentMethod === 'mobile' && { phoneNumber })
      };
      
      console.log('Processing payment:', paymentData);
      
      // Create reservation with payment info
      const reservationPayload = {
        ...reservationData,
        paymentData,
        status: 'confirmed',
        paymentStatus: 'completed'
      };
      
      // Store successful payment data
      localStorage.setItem('completedReservation', JSON.stringify(reservationPayload));
      localStorage.removeItem('reservationData');
      
      toast.success('Payment successful!');
      router.push('/payment-success');
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!reservationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reservation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Complete Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => setSelectedPaymentMethod('card')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedPaymentMethod === 'card'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                          <div>
                            <p className="font-medium">Credit/Debit Card</p>
                            <p className="text-sm text-gray-600">Visa, Mastercard, Verve</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'card' && (
                          <CheckCircle className="h-5 w-5 text-teal-600" />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedPaymentMethod('mobile')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedPaymentMethod === 'mobile'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Smartphone className="h-5 w-5 mr-3 text-gray-600" />
                          <div>
                            <p className="font-medium">Mobile Money</p>
                            <p className="text-sm text-gray-600">MTN, Airtel, 9mobile</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'mobile' && (
                          <CheckCircle className="h-5 w-5 text-teal-600" />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedPaymentMethod('bank')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedPaymentMethod === 'bank'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 mr-3 text-gray-600" />
                          <div>
                            <p className="font-medium">Bank Transfer</p>
                            <p className="text-sm text-gray-600">Direct bank transfer</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'bank' && (
                          <CheckCircle className="h-5 w-5 text-teal-600" />
                        )}
                      </div>
                    </button>
                  </div>

                  <Separator />

                  {/* Payment Form */}
                  {selectedPaymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          value={cardData.cardName}
                          onChange={(e) => handleCardInputChange('cardName', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={cardData.cardNumber}
                          onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            value={cardData.expiryDate}
                            onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={cardData.cvv}
                            onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'mobile' && (
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="08012345678"
                      />
                    </div>
                  )}

                  {selectedPaymentMethod === 'bank' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Account Details:</strong>
                      </p>
                      <p className="text-sm text-blue-700">
                        Account Name: Bookies Restaurant Ltd<br />
                        Account Number: 1234567890<br />
                        Bank: GTBank<br />
                        Amount: ₦{reservationData.total.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reservation Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                    <div>
                      <p className="font-medium">{reservationData.restaurantName}</p>
                      <p className="text-sm text-gray-600">{reservationData.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm">{reservationData.date}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm">{reservationData.time}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm">{reservationData.guests} guests</span>
                  </div>
                </div>

                <Separator />

                {/* Meal Items */}
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Meals</h4>
                  {reservationData.meals.map((meal, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{meal.name} x{meal.quantity}</span>
                      <span>₦{(meal.price * meal.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₦{reservationData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>₦{reservationData.serviceFee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₦{reservationData.total.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={processPayment}
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₦${reservationData.total.toLocaleString()}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
