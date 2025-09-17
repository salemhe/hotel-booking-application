"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RestaurantRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/vendor-dashboard/restaurant/dashboard");
  }, [router]);
  return null;
}
