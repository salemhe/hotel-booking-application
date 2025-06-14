"use client";
import PreSelectMeal from "@/app/components/reservation/PreSelectMeal";
import ReservationDetails from "@/app/components/reservation/ReservationDetails";
import { useReservations } from "@/app/contexts/ReservationContext";
import { useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { page } = useReservations();
const searchParams = useSearchParams();
const date = searchParams.get("date");
const time = searchParams.get("time");
const guests = searchParams.get("guests");
const specialRequest= searchParams.get("specialRequest");
const searchQuery = {
    date: date ?? "",
    time: time ?? "",
    guests: guests ?? "",
    specialRequest: specialRequest ?? ""
}

  return <div className="">{page === 1 ? <PreSelectMeal /> : <ReservationDetails searchQuery={searchQuery} />}</div>;
};

export default Page;
