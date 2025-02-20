import { Suspense } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { Overview } from "@/components/Overview";
import { RecentOrders } from "@/components/RecentOrders";
import { TopSellingItems } from "@/components/TopSellingItems";
import {MenuCard}  from "@/components/MenuCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                className="aspect-video animate-pulse rounded-xl bg-gray-100"
                key={i}
              />
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>
      <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6 grid-cols-1 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <Overview />
        </Suspense>
        <Suspense
          fallback={
            <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <MenuCard />
        </Suspense>
      </div>
      <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6 grid-cols-1 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <RecentOrders />
        </Suspense>
        <Suspense
          fallback={
            <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <TopSellingItems />
        </Suspense>
      </div>
    </div>
  );
}
