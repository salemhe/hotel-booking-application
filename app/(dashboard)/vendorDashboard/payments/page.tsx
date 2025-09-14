"use client";

import { Suspense } from "react";
import { PaymentStats } from "@/components/PaymentStats";
import { PaymentBreakdown } from "@/components/PaymentBreakdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Withdraw from "@/components/Withdraw";
import FinancialOverview from "./FinancialOverview";
import InitializePayment from "./initializePayment";
import SplitSetup from "@/components/form-sections/SplitSetup";
import BankDetailsForm from "./BankDetailsForm";
// import InitializePayment from "@/app/";
// import BankDetailsForm from "/BankDetailsForm";
// import SplitSetup from "@/app/components/SplitSetup";
// import FinancialOverview from "@/app/components/FinancialOverview";

export default function PaymentPage() {
  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-col lg:flex-row">
        <div>
          <h1 className="text-2xl font-semibold">Payments & Earnings</h1>
          <p className="text-gray-700">
            View your payment statistics, link accounts, manage withdrawals and monitor financial health.
          </p>
        </div>
        <Button
          className="px-4 py-2 text-sm font-medium border-blue-700 border transition-all duration-300 hover:text-blue-700 text-white hover:bg-white rounded-full bg-blue-700 w-full cursor-pointer lg:w-auto"
          asChild
          size="lg"
        >
          <Link href="/vendorDashboard/settings/commissionSettings">Edit Commission</Link>
        </Button>
      </div>

      {/* Financial Overview (balance, commission, etc.) */}
      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-xl" />}>
        <FinancialOverview />
      </Suspense>

      {/* Initialize New Payment */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Initialize a Payment</h2>
        <InitializePayment />
      </div>

      {/* Split Payment Setup */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Split Payment Setup</h2>
        <SplitSetup />
      </div>

      {/* Bank Details Form */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Bank Account Details</h2>
        <BankDetailsForm />
      </div>

      {/* Withdraw Funds */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Withdraw Funds</h2>
        <Withdraw />
      </div>

      {/* Stats & Breakdown */}
      <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><div className="h-32 bg-gray-100 animate-pulse rounded-xl" /></div>}>
        <PaymentStats />
      </Suspense>

      <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6 w-full grid-cols-1">
        <Suspense fallback={<div className="aspect-video animate-pulse rounded-xl bg-gray-100" />}>
          <PaymentBreakdown />
        </Suspense>
      </div>
    </div>
  );
}
