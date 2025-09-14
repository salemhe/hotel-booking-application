import TrackPayments from "@/components/TrackPayments";
import { Suspense } from "react";

export default function Payment() {
  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  className="aspect-video animate-pulse rounded-xl bg-gray-100"
                  key={i}
                />
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="aspect-video col-span-2 animate-pulse rounded-xl bg-gray-100" />
              <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
            </div>
          </>
        }
      >
        <TrackPayments />
      </Suspense>
    </div>
  );
}
