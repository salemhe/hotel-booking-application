import { Suspense } from "react";
import { PaymentStats } from "@/components/PaymentStats";
import { PaymentBreakdown } from "@/components/PaymentBreakdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Withdraw from "@/components/Withdraw";

export default function Payment() {
  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 flex-col lg:flex-row">
        <div>
          <h1 className="text-2xl font-semibold">Payment</h1>
          <p className="text-gray-700 mb-4">
            This page provides an overview of your payment statistics and a
            detailed breakdown of transactions.
          </p>
        </div>
        <Button
          className="px-4 py-2 text-sm font-medium border-blue-700 border transition-all duration-300 hover:text-blue-700 text-white hover:bg-white rounded-full bg-blue-700 w-full cursor-pointer lg:w-auto"
          asChild
          size="lg"
        >
          <Link href="/vendorDashboard/setting/payments">Payment Details</Link>
        </Button>
      </div>
      <Suspense
        fallback={
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                className="aspect-video animate-pulse rounded-xl bg-gray-100"
                key={i}
              />
            ))}
          </div>
        }
      >
        <PaymentStats />
      </Suspense>
      <Withdraw />
      <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6 w-full grid-cols-1">
        <Suspense
          fallback={
            <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <PaymentBreakdown />
        </Suspense>
      </div>
    </div>
  );
}
