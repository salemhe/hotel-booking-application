'use client';

import PaymentForm from '@/app/components/PaymentForm';
import MealSelectionSummary from '@/app/components/MealSelectionSummary';

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Thank you for your meal selection
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Your pre-selected meals have been confirmed for your upcoming reservation
        </p>

        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 text-center mb-6">
          💡 Would you like to pre-pay for your meal? <br />
          Payment is optional, but helps the restaurant prepare your meal ahead of time. Your payment is
          subject to refunds according to the restaurants cancellation policy.
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <label className="block font-medium text-gray-700 mb-1">Amount to pay:</label>
          <div className="text-lg font-bold text-gray-900">₦42,000</div>
        </div>

        <div className="mb-6">
          <PaymentForm />
        </div>

        <div>
          <MealSelectionSummary />
        </div>
      </div>
    </main>
  );
}
