import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export interface Reservation {
  id: string;
  guestName: string;
  type: "in-house" | "external";
  meals?: string[];
  rooms?: string[];
  [key: string]: any; // For extensibility
}

let socket: Socket | null = null;

export function useReservationsSocket(apiUrl: string, socketUrl: string) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial reservations
    fetch(`${apiUrl}/reservations`)
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
        setLoading(false);
      });

    // Connect to socket.io
    if (!socket) {
      socket = io(socketUrl);
    }

    // Listen for new/updated reservations
    socket.on("reservation:new", (reservation: Reservation) => {
      setReservations((prev) => [reservation, ...prev]);
    });

    socket.on("reservation:update", (updated: Reservation) => {
      setReservations((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
    });

    socket.on("reservation:delete", (deletedId: string) => {
      setReservations((prev) => prev.filter((r) => r.id !== deletedId));
    });

    return () => {
      if (socket) {
        socket.off("reservation:new");
        socket.off("reservation:update");
        socket.off("reservation:delete");
      }
    };
  }, [apiUrl, socketUrl]);

  return { reservations, loading };
}