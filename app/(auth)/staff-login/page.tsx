import { Suspense } from "react";
import StaffLoginClient from "./StaffLoginClient";
export default function StaffLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffLoginClient />
    </Suspense>
  );
}
