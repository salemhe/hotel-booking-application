import MenuCard from "@/components/MenuCard";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {/* <div className="aspect-video animate-pulse rounded-xl bg-gray-100" /> */}
        <MenuCard
          menuItems={[
            { name: "Jollof Rice", price: 1500, discountPrice: 1200 },
            { name: "Pasta", price: 12.5 },
            { name: "Pizza", price: 15.0, discountPrice: 12.99 },
            { name: "Salad", price: 7.99 },
            { name: "Sushi", price: 18.0, discountPrice: 14.5 },
          ]}
          isLoading={false}
        />

        <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
        <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
      </div>
      <div className="min-h-[100vh] animate-pulse flex-1 rounded-xl bg-gray-100" />
    </div>
  );
}

export default Page;
