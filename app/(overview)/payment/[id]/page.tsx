"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Payment methods enum
enum PaymentMethod {
  CARD = "card",
  PAYSTACK = "paystack", 
  TRANSFER = "transfer"
}

export default function PaymentPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CARD);
  const [bookingDetails, setBookingDetails] = useState({
    venue: "Ocean Basket",
    location: "2 Days at Blue Origin Farms, Galle, Sri Lanka",
    totalAmount: 50000
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    bank: "",
    expiryDate: "",
    cvv: ""
  });

  const [diningTime, setDiningTime] = useState(150); // 2hrs 30min in minutes

  const handleCardDetailsChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const adjustDiningTime = (minutes: number) => {
    const newTime = Math.max(30, Math.min(300, diningTime + minutes));
    setDiningTime(newTime);
  };

  const formatDiningTime = () => {
    const hours = Math.floor(diningTime / 60);
    const mins = diningTime % 60;
    return `${hours}hrs ${mins}min`;
  };

  const validateCardDetails = () => {
    const { cardNumber, bank, expiryDate, cvv } = cardDetails;
    
    if (!cardNumber || cardNumber.length < 16) return false;
    if (!bank) return false;
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
    if (!cvv || cvv.length < 3) return false;

    return true;
  };

  const handlePayment = () => {
    if (paymentMethod === PaymentMethod.CARD && !validateCardDetails()) {
      alert("Please fill in all card details correctly");
      return;
    }

    // Simulate payment processing
    const paymentSuccessful = Math.random() > 0.2;

    if (paymentSuccessful) {
      setCurrentStep(3);
    } else {
      alert("Payment failed. Please try again.");
    }
  };

  const renderPaymentMethodTabs = () => (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {Object.values(PaymentMethod).map((method) => (
        <Button
          key={method}
          variant={paymentMethod === method ? "default" : "outline"}
          onClick={() => setPaymentMethod(method)}
          className="capitalize"
        >
          {method}
        </Button>
      ))}
    </div>
  );

  const renderPaymentMethodDetails = () => {
    switch(paymentMethod) {
      case PaymentMethod.CARD:
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <Label>Card Number</Label>
              <Input 
                placeholder="Payment card number"
                value={cardDetails.cardNumber}
                onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <Label>Bank</Label>
              <Select 
                value={cardDetails.bank}
                onValueChange={(value) => handleCardDetailsChange('bank', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent>
                  {["Access Bank", "Zenith Bank", "First Bank", "GTBank", "UBA"].map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Exp Date</Label>
                <Input 
                  placeholder="Validation date"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleCardDetailsChange('expiryDate', e.target.value)}
                />
              </div>
              <div>
                <Label>CVV</Label>
                <Input 
                  placeholder="Delete the card"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case PaymentMethod.PAYSTACK:
        return (
          <div className="text-center py-4">
            <p>You will be redirected to Paystack for payment</p>
          </div>
        );
      case PaymentMethod.TRANSFER:
        return (
          <div className="space-y-4">
            <p>Transfer OceanBasket:</p>
            <div className="bg-gray-100 p-4 rounded">
              <p>Bank Details:</p>
              <p>Account Number: [Bank Account Number]</p>
              <p>Total Amount: ₦{bookingDetails.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        );
    }
  };

  const renderBookingInformationStep = () => (
    <div className="max-w-md mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">Booking Information</h1>
        <p className="text-gray-500 text-sm">Please fill up the blank fields below</p>
      </div>

      <div className="mb-4">
        <div className="restaurant-image mb-4">
          <img 
            src="/path/to/ocean-basket-image.jpg" 
            alt="Ocean Basket" 
            className="w-full rounded-lg"
          />
          <div className="text-center text-blue-500 mt-2">Ocean Basket</div>
          <div className="text-center text-gray-500 text-sm">Victoria Island</div>
        </div>

        <div className="dining-time mb-4">
          <label className="block mb-2">Choose your expected dining time</label>
          <div className="flex items-center justify-between">
            <button 
              className="bg-red-500 text-white rounded-md px-3 py-1"
              onClick={() => adjustDiningTime('subtract')}
            >
              -
            </button>
            <span>{diningTime}</span>
            <button 
              className="bg-black text-white rounded-md px-3 py-1"
              onClick={() => adjustDiningTime('add')}
            >
              +
            </button>
          </div>
        </div>

        <div className="date-picker mb-4">
          <label className="block mb-2">Pick a Date</label>
          <div className="border rounded-md p-2 text-gray-500">
            14 Feb
          </div>
        </div>

        <div className="pricing text-right font-bold mb-4">
          You will pay ₦50,000 Naira per Table
        </div>

        <button className="w-full bg-black text-white py-2 rounded-md">
          Next
        </button>
      </div>

      <div className="step-indicators flex justify-center space-x-2 mt-4">
        <div className="w-4 h-4 bg-black rounded-full"></div>
        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );;

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <Label className="block mb-2">Select Payment Method</Label>
      {renderPaymentMethodTabs()}
      
      <div className="mt-4">
        {renderPaymentMethodDetails()}
      </div>
      
      <Button 
        className="w-full mt-4" 
        onClick={handlePayment}
      >
        Pay Now
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full mt-2"
        onClick={() => setCurrentStep(1)}
      >
        Cancel
      </Button>
    </div>
  );

  const renderPaymentCompletedStep = () => (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 rounded-full p-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="green" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold">Yay! Payment Completed</h2>
      
      <p>Please check your email & phone Message</p>
      <p>We have sent all the Information</p>
      
      <Button 
        className="w-full" 
        onClick={() => router.push("/home")}
      >
        Back to Home
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => router.push("/dashboard")}
      >
        Go to Dashboard
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto max-w-md py-8 px-4">
      <div className=" rounded-lg  p-6">
        <div className="flex justify-center mb-6">
          {[1, 2, 3].map((step) => (
            <div 
              key={step} 
              className={`w-8 h-8 rounded-full mx-2 flex items-center justify-center ${
                currentStep >= step 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">
          {currentStep === 1 ? "Booking Information" : 
           currentStep === 2 ? "Payment" : 
           "Yay! Payment Completed"}
        </h1>

        {currentStep === 1 && renderBookingInformationStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderPaymentCompletedStep()}
      </div>
    </div>
  );
}