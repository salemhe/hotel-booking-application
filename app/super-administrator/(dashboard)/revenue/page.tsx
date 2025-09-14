"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Hotel, UtensilsCrossed } from "lucide-react";
import SuperAdminSidebar from "@/components/SuperAdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { apiFetcher } from "@/lib/fetcher";
// API_URL removed, use apiFetcher with path only

interface MonthlyData {
  period: string;
  total: number;
  hotel: number;
  restaurant: number;
  growth: number;
}

interface RevenueAnalytics {
  totalRevenue: number;
  hotelRevenue: number;
  restaurantRevenue: number;
  monthly?: MonthlyData[];
}

export default function RevenuePage() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics>({
    totalRevenue: 0,
    hotelRevenue: 0,
    restaurantRevenue: 0,
    monthly: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await apiFetcher(`/api/super-admin/analytics/revenue`);
        setRevenueAnalytics(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // const { SidebarProvider } = require("@/app/components/ui/sidebar");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 relative">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        <div
          className={`z-50 fixed md:static inset-y-0 left-0 transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 w-4/5 max-w-xs md:w-64 bg-slate-900 md:bg-transparent h-full md:h-auto flex flex-col`}
          style={{ color: 'white' }}
        >
          <SuperAdminSidebar />
        </div>
        <div className="flex-1 relative p-2 sm:p-4 md:p-8 max-w-7xl mx-auto text-white w-full">
          {/* Collapse Button */}
          <button
            className="fixed top-3 left-3 z-50 md:hidden bg-slate-800 text-white p-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-6 flex items-center gap-2 mt-16 md:mt-0">
            <DollarSign className="h-7 w-7 text-emerald-400" /> Revenue Analytics
          </h1>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 w-full">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 min-h-[110px]">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm md:text-base text-gray-200">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-base sm:text-lg md:text-xl font-bold">
                  ${revenueAnalytics.totalRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 min-h-[110px]">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm md:text-base text-gray-200">Hotel Revenue</CardTitle>
                <Hotel className="h-4 w-4 text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-base sm:text-lg md:text-xl font-bold">
                  ${revenueAnalytics.hotelRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 min-h-[110px]">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm md:text-base text-gray-200">Restaurant Revenue</CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-base sm:text-lg md:text-xl font-bold">
                  ${revenueAnalytics.restaurantRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-8">
            <CardHeader>
              <CardTitle className="text-white text-lg">Monthly Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[600px] text-xs sm:text-sm">
                  <TableHeader>
                    <TableRow>
                      {["Period", "Total", "Hotel", "Restaurant", "Growth"].map((h) => (
                        <TableHead key={h} className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueAnalytics.monthly?.map((m, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{m.period}</TableCell>
                        <TableCell className="text-emerald-400 font-medium">
                          ${m.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-teal-400">
                          ${m.hotel.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-cyan-400">
                          ${m.restaurant.toFixed(2)}
                        </TableCell>
                        <TableCell className={m.growth > 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {m.growth > 0 ? '+' : ''}
                          {m.growth.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                    {!revenueAnalytics.monthly?.length && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-gray-400">
                          No monthly data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="block sm:hidden text-xs text-gray-400 mt-2 text-center font-semibold bg-black/30 rounded p-2">
                  Swipe left/right to see more columns
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
