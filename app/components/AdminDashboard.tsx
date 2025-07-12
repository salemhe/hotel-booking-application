"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Overview } from "@/app/components/adminOverview";
import { RecentTransactions } from "@/app/components/recentTransactions";
import {
  DollarSign,
  Users,
  Store,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Data {
  grossSales: number;
  totalUsers: number;
  totalVendors: number;
  totalBookings: number;
  netSales: number;
  crossSales: number;
  balances: number;
}

export default function AdminDashboard() {
    const [data, setData] = useState<Data>({
    grossSales: 0,
    totalUsers: 0,
    totalVendors: 0,
    totalBookings: 0,
    netSales: 0,
    crossSales: 0,
    balances: 0,
  });

  // Removed unused router and pathname

  useEffect(() => {
    getMetrics();
  }, []);

  const getMetrics = async () => {
    try {
            const res = await axios.get(
        "https://hotel-booking-app-backend-30q1.onrender.com/api/admin/metrics"
      );
      setData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
          }
  };

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-screen">
      <div className="w-full flex-1 space-y-4 px-2 sm:px-8 xl:px-16 pt-6 pb-8 overflow-auto">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
  <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
  </div>
  <Tabs defaultValue="overview" className="space-y-4">
  <TabsList>
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview" className="space-y-4">
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  <CardTitle className="text-sm font-medium">
  Total Revenue
  </CardTitle>
  <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
  <div className="text-2xl font-bold">
  ₦{data.grossSales.toLocaleString()}
  </div>
  <p className="text-xs text-muted-foreground">
  +20.1% from last month
  </p>
  </CardContent>
  </Card>
  <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  <CardTitle className="text-sm font-medium">
  Total Users
  </CardTitle>
  <Users className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
  <div className="text-2xl font-bold">
  {data.totalUsers.toLocaleString()}
  </div>
  <p className="text-xs text-muted-foreground">
  +180 new users this month
  </p>
  </CardContent>
  </Card>
  <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  <CardTitle className="text-sm font-medium">
  Total Vendors
  </CardTitle>
  <Store className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
  <div className="text-2xl font-bold">{data.totalVendors}</div>
  <p className="text-xs text-muted-foreground">
  +7 new vendors this month
  </p>
  </CardContent>
  </Card>
  <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  <CardTitle className="text-sm font-medium">
  Total Bookings
  </CardTitle>
  <CreditCard className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
  <div className="text-2xl font-bold">{data.totalBookings}</div>
  <p className="text-xs text-muted-foreground">
  +19% from last month
  </p>
  </CardContent>
  </Card>
  </div>
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
  <Card className="col-span-1 md:col-span-2 lg:col-span-4">
  <CardHeader>
  <CardTitle>Revenue Overview</CardTitle>
  </CardHeader>
  <CardContent className="pl-2">
  <Overview />
  </CardContent>
  </Card>
  <Card className="col-span-1 md:col-span-2 lg:col-span-3">
  <CardHeader>
  <CardTitle>Recent Transactions</CardTitle>
  </CardHeader>
  <CardContent>
  <RecentTransactions />
  </CardContent>
  </Card>
  </div>
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0">
  <CardTitle className="text-sm font-medium">Net Sales</CardTitle>
  <TrendingUp className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
  <div className="text-2xl font-bold">
  ₦{data.netSales.toLocaleString()}
  </div>
  <div className="mt-4 h-1 w-full bg-gray-200 rounded">
  <div
  className="h-1 bg-green-500 rounded"
  style={{
  width: `${(data.netSales / data.grossSales) * 100}%`,
  }}
  ></div>
  </div>
  <p className="text-xs text-muted-foreground mt-2">
  {((data.netSales / data.grossSales) * 100).toFixed(1)}% of
  gross sales
  </p>
  </CardContent>
  </Card>
  <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0">
  <CardTitle className="text-sm font-medium">
  Cross Sales
  </CardTitle>
  <TrendingUp className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
  <div className="text-2xl font-bold">
  ₦{data.crossSales.toLocaleString()}
  </div>
  <div className="mt-4 h-1 w-full bg-gray-200 rounded">
  <div
  className="h-1 bg-blue-500 rounded"
  style={{
  width: `${(data.crossSales / data.grossSales) * 100}%`,
  }}
  ></div>
  </div>
  <p className="text-xs text-muted-foreground mt-2">
  {((data.crossSales / data.grossSales) * 100).toFixed(1)}% of
  gross sales
  </p>
  </CardContent>
  </Card>
  <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0">
  <CardTitle className="text-sm font-medium">
  Account Balance
  </CardTitle>
  <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
  <div className="text-2xl font-bold">
  ₦{data.balances.toLocaleString()}
  </div>
  <div className="mt-4 h-1 w-full bg-gray-200 rounded">
  <div className="h-1 bg-purple-500 rounded" style={{ width: "100%" }}></div>
  </div>
  <p className="text-xs text-muted-foreground mt-2">
  Available for withdrawal
  </p>
  </CardContent>
  </Card>
  </div>
  </TabsContent>
  <TabsContent value="analytics" className="space-y-4">
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
  <Card className="col-span-1 md:col-span-2 lg:col-span-4">
  <CardHeader>
  <CardTitle>Monthly Trends</CardTitle>
  </CardHeader>
  <CardContent className="pl-2">
  <Overview />
  </CardContent>
  </Card>
  <Card className="col-span-1 md:col-span-2 lg:col-span-3">
  <CardHeader>
  <CardTitle>Top Vendors</CardTitle>
  </CardHeader>
  <CardContent>
  <p>Analytics content will be displayed here.</p>
  </CardContent>
  </Card>
  </div>
  </TabsContent>
  </Tabs>
  </div>
  </div>
  );
  }
                                                                                                                                    