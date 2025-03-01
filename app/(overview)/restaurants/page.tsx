import Loading from "@/components/loading";
import Restaurants from "@/components/Restaurants";
import { Suspense } from "react";

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Restaurants />
    </Suspense>
  );
}
