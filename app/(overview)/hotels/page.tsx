import Hotels from "@/components/user/hotels/Hotels";
import Loading from "@/components/loading";
import { Suspense } from "react";

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Hotels />
    </Suspense>
  );
}
