"use client";
import ReservationDetails from "@/components/user/clubs/ReservationDetails";
import { useReservations } from "@/contexts/club/ReservationContext";
import { useSearchParams } from "next/navigation";
import React from "react";
import ReservationSummary from "./ReservationSummary";

const Reservation = ({ id }: { id: string }) => {
  const { page } = useReservations();
const searchParams = useSearchParams();
const date = searchParams.get("date");
const time = searchParams.get("time");
const table = searchParams.get("table");
const guests = searchParams.get("guests");
const specialRequest= searchParams.get("specialRequest");
const searchQuery = {
    date: date ?? "",
    time: time ?? "",
    table: table ?? "",
    guests: guests ?? "",
    specialRequest: specialRequest ?? ""
}

  return <div className="">{page === 1 ? <ReservationSummary id={id} /> : <ReservationDetails id={id} searchQuery={searchQuery} />}</div>;
};

export default Reservation;
