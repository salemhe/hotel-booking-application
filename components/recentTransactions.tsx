"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdError } from "react-icons/md";

export function RecentTransactions() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<{
    id: string;
    user: string;
    amount: number;
  }[] | null>(null);
  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getTransactions();
      if (data) {
        setTransactions(data);
      }
    };
    fetchTransactions();
  }, []);

  async function getTransactions() {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://hotel-booking-app-backend-30q1.onrender.com/api/admin/transactions"
      );
      if (res.status === 200) {
        return res.data.transactions;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching Transactions", error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full flex aspect-video bg-gray-200 rounded-2xl animate-pulse flex-col items-center justify-center"></div>
    );
  }

  if (!transactions) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <MdError />
        An error occured pls try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {[...transactions]
        .slice(-5)
        .reverse()
        .map((data, i) => (
          <div key={i} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{data.user}</p>
              <p className="text-sm text-muted-foreground">
                Booking #{data.id}
              </p>
            </div>
            <div className="ml-auto font-medium">
              +₦{data.amount.toLocaleString()}
            </div>
          </div>
        ))}
    </div>
  );
}
