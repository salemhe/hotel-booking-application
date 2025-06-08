import Loading from "@/app/components/loading";
import Restaurants from "@/app/components/restaurants/Restaurants";
import { Suspense } from "react";

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Restaurants />
    </Suspense>
  );
}
