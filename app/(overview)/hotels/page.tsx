import Hotels from "@/app/components/hotels/Hotels";
import Loading from "@/app/components/loading";
import { Suspense } from "react";

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Hotels />
    </Suspense>
  );
}
