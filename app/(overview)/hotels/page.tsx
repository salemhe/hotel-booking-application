import Hotels from "@/components/hotels/Hotels";
import Loading from "@/components/loading";
import { Suspense } from "react";

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Hotels />
    </Suspense>
  );
}
