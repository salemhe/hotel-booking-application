import { Suspense } from "react";
import VendorLoginClient from "./VendorLoginClient";

export default function VendorLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VendorLoginClient />
    </Suspense>
  );
}
