// import MenuCard from "@/components/MenuCard";
// import React from "react";

// function Page() {
//   return (
//     <div className="flex flex-col gap-4 p-4">
//       <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//         {/* <div className="aspect-video animate-pulse rounded-xl bg-gray-100" /> */}
//         <MenuCard
//           menuItems={[
//             { name: "Jollof Rice", price: 1500, discountPrice: 1200 },
//             { name: "Pasta", price: 12.5 },
//             { name: "Pizza", price: 15.0, discountPrice: 12.99 },
//             { name: "Salad", price: 7.99 },
//             { name: "Sushi", price: 18.0, discountPrice: 14.5 },
//           ]}
//           isLoading={false}
//         />

//         <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
//         <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
//       </div>
//       <div className="min-h-[100vh] animate-pulse flex-1 rounded-xl bg-gray-100" />
//     </div>
//   );
// }

// export default Page;
import { Suspense } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { Overview } from "@/components/Overview";
import { RecentOrders } from "@/components/RecentOrders";
import { TopSellingItems } from "@/components/TopSellingItems";
import {MenuCard}  from "@/components/MenuCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-blue-600">
        Restaurant Dashboard
      </h1>
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
