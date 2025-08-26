
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

// Copied from payments/page.tsx - consider moving to a shared types file
interface Account {
  id: string;
  bankName: string;
  accountNumber: string;
  type: string;
  accountName: string;
  bankLogoUrl?: string;
}

interface Stats {
  totalEarnings?: number;
  earningsVsLastYear?: string;
  earningsThisWeek?: number;
  earningsVsLastWeek?: string;
  completedPayments?: number;
  completedVsLastWeek?: string;
  pendingPayments?: number;
  pendingVsLastWeek?: string;
  availableBalance?: number;
  lastPaymentProcessed?: string;
  chartData?: ChartData[];
}

interface Transaction {
  date: string;
  transactionId: string;
  customer: string;
  branch: string;
  method: string;
  status: string;
}

interface ChartData {
  name: string;
  value: number;
}

interface DashboardData {
    reservationsMadeToday: number;
    prepaidReservations: number;
    expectedGuestsToday: number;
    pendingPayments: number;
    todaysReservations: any[];
    reservationTrends: any;
    customerFrequency: any;
    revenueByCategory: any;
    reservationSource: any;
    vendorName?: string;
    vendorProfilePictureUrl?: string;
}

let socket: Socket | null = null;

export function useVendorDashboardSocket(apiUrl: string, socketUrl: string) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const fetchOptions: RequestInit = { credentials: "include" };
    if (token) {
      fetchOptions.headers = { Authorization: `Bearer ${token}` };
    }

    // Fetch initial data
    Promise.all([
        fetch(`${apiUrl}/api/vendors/accounts`, fetchOptions).then(res => res.json()),
        fetch(`${apiUrl}/api/vendors/payments/stats`, fetchOptions).then(res => res.json()),
        fetch(`${apiUrl}/api/vendors/payments/transactions`, fetchOptions).then(res => res.json()),
        fetch(`${apiUrl}/api/vendors/dashboard`, fetchOptions).then(res => res.json())
    ]).then(([accountsRes, statsRes, transactionsRes, dashboardRes]) => {
        setAccounts(Array.isArray(accountsRes) ? accountsRes : (accountsRes?.accounts || []));
        setStats(statsRes);
        setTransactions(Array.isArray(transactionsRes) ? transactionsRes : (transactionsRes?.transactions || []));
        setDashboardData(dashboardRes);
        setLoading(false);
    }).catch(error => {
        console.error("Failed to fetch initial data", error);
        setLoading(false);
    });


    // Connect to socket.io
    if (!socket) {
      socket = io(socketUrl);
    }

    // Listen for updates
    socket.on("vendor:stats:update", (updatedStats: Stats) => {
      setStats(updatedStats);
    });

    socket.on("vendor:transactions:new", (newTransaction: Transaction) => {
      setTransactions((prev) => [newTransaction, ...prev]);
    });

    socket.on("vendor:transactions:update", (updatedTransaction: Transaction) => {
        setTransactions((prev) =>
            prev.map((t) => (t.transactionId === updatedTransaction.transactionId ? updatedTransaction : t))
        );
    });

    socket.on("vendor:accounts:update", (updatedAccounts: Account[]) => {
        setAccounts(updatedAccounts);
    });

    socket.on("vendor:dashboard:update", (updatedDashboardData: DashboardData) => {
        setDashboardData(updatedDashboardData);
    });


    return () => {
      if (socket) {
        socket.off("vendor:stats:update");
        socket.off("vendor:transactions:new");
        socket.off("vendor:transactions:update");
        socket.off("vendor:accounts:update");
        socket.off("vendor:dashboard:update");
      }
    };
  }, [apiUrl, socketUrl]);

  return { accounts, stats, transactions, dashboardData, loading };
}
