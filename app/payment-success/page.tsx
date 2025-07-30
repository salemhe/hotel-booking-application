"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Mail,
  Phone,
  Download,
  Share2,
  Star,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


interface CompletedReservation {
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
  total: number;
  reservationId: string;
  paymentData: {
    method: string;
    reference: string;
    amount: number;
  };
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [reservation, setReservation] = useState<CompletedReservation | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Load completed reservation data
    const storedData = localStorage.getItem('completedReservation');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setReservation({
          ...parsed,
          reservationId: `BK${Date.now().toString().slice(-6)}` // Generate booking ID
        });
      } catch (error) {
        console.error('Error parsing reservation data:', error);
      }
    }

    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadReceipt = () => {
    // Generate and download PDF receipt
    toast.success('Receipt download started');
    // In a real app, you would generate a PDF here
  };

  const handleShareReservation = () => {
    if (navigator.share && reservation) {
      navigator.share({
        title: 'My Restaurant Reservation',
        text: `I just booked a table at ${reservation.restaurantName} for ${reservation.date} at ${reservation.time}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Reservation link copied to clipboard');
    }
  };

  const handleViewBookings = () => {
    router.push('/userDashboard/booking');
  };

  const handleRateExperience = () => {
    // Navigate to rating page
    router.push(`/restaurants/${reservation?.reservationId}/review`);
  };

  if (!reservation) {
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-green-500 rounded-full animate-bounce opacity-80"></div>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-yellow-500 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-10 left-1/3 w-2 h-2 bg-red-500 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-10 left-2/3 w-2 h-2 bg-purple-500 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            Your reservation has been confirmed
          </p>
          <p className="text-sm text-gray-500">
            Booking ID: <span className="font-medium">#{reservation.reservationId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reservation Details */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {reservation.restaurantName}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {reservation.location}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Confirmed
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{reservation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">{reservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-medium">{reservation.guests} people</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium text-green-600">Confirmed</p>
                    </div>
                  </div>
                </div>

                {/* Selected Meals */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Your Order</h4>
                  <div className="space-y-2">
                    {reservation.meals.map((meal, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {meal.name} <span className="text-xs">×{meal.quantity}</span>
                        </span>
                        <span className="font-medium">
                          ₦{(meal.price * meal.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total Paid</span>
                        <span className="text-green-600">₦{reservation.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Payment Confirmed
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium capitalize">{reservation.paymentData.method} Payment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference</span>
                    <span className="font-medium">{reservation.paymentData.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">₦{reservation.paymentData.amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">What&apos;s Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <Mail className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Confirmation Email</p>
                      <p className="text-sm text-blue-700">You&apos;ll receive a confirmation email shortly with all details</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 mr-3 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Arrival Time</p>
                      <p className="text-sm text-green-700">Please arrive 10 minutes before your reservation time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <Phone className="w-5 h-5 mr-3 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Need Changes?</p>
                      <p className="text-sm text-yellow-700">Contact the restaurant at least 2 hours before your reservation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleDownloadReceipt}
                variant="outline" 
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              
              <Button 
                onClick={handleShareReservation}
                variant="outline" 
                className="w-full justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Reservation
              </Button>
              
              <Button 
                onClick={handleViewBookings}
                variant="outline" 
                className="w-full justify-start"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View All Bookings
              </Button>
              
              <Button 
                onClick={handleRateExperience}
                className="w-full bg-teal-600 hover:bg-teal-700 justify-center"
              >
                <Star className="w-4 h-4 mr-2" />
                Rate Your Experience
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Back to Home */}
            <Button 
              onClick={() => router.push('/')}
              variant="ghost" 
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
