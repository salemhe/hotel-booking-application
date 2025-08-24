"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HotelRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/vendor-dashboard/hotel/dashboard");
  }, [router]);
  return null;
}
