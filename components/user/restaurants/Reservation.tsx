"use client";
import PreSelectMeal from "@/components/user/restaurants/PreSelectMeal";
import ReservationDetails from "@/components/user/restaurants/ReservationDetails";
import { useReservations } from "@/contexts/restaurant/ReservationContext";
import { useSearchParams } from "next/navigation";
import React from "react";

const Reservation = ({ id }: { id: string }) => {
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

  return <div className="">{page === 1 ? <PreSelectMeal id={id} /> : <ReservationDetails id={id} searchQuery={searchQuery} />}</div>;
};

export default Reservation;
