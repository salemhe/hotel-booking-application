import { Suspense } from "react";
import { PaymentStats } from "@/components/PaymentStats";
import { PaymentBreakdown } from "@/components/PaymentBreakdown";

export default function Payment() {
  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
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
