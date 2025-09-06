import { Suspense } from "react";
import VerifyStaffClient from "./VerifyStaffClient";
export default function StaffLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyStaffClient />
    </Suspense>
  );
}
