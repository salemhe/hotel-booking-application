"use client";

import React, { useState, useEffect } from "react";
import { apiFetcher } from "@/app/lib/fetcher";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Users } from "lucide-react";
import SuperAdminSidebar from "@/app/components/SuperAdminSidebar";
import { SidebarProvider } from "@/app/components/ui/sidebar";
// API_URL removed, use apiFetcher with path only

interface Vendor {
  id: string;
  name: string;
  type: string;
  chain: string;
  location: string;
  revenue: number;
}

interface VendorAnalytics {
  totalVendors: number;
  totalHotels: number;
  totalRestaurants: number;
  vendors?: Vendor[];
}

export default function VendorsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vendorAnalytics, setVendorAnalytics] = useState<VendorAnalytics>({
    totalVendors: 0,
    totalHotels: 0,
    totalRestaurants: 0,
    vendors: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await apiFetcher(`/api/super-admin/analytics/vendors`);
        setVendorAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 overflow-x-hidden relative">
        {/* Sidebar */}
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
        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full min-h-screen relative">
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
          <div className="relative z-10 w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 flex-1 flex flex-col">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-6 flex items-center gap-2 mt-16 md:mt-0">
              <Users className="h-7 w-7 text-teal-400" /> Vendors
            </h1>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 my-2 sm:my-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg" style={{ color: 'white' }}>
                  <Users className="h-5 w-5 text-teal-400" /> Vendor Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="px-1 sm:px-4 pb-4">
                <div className="overflow-x-auto w-full">
                  <Table className="min-w-[600px] w-full text-xs sm:text-sm">
                    <TableHeader>
                      <TableRow>
                        {[
                          "Vendor ID",
                          "Name",
                          "Type",
                          "Chain",
                          "Location",
                          "Revenue",
                          "Actions",
                        ].map((h) => (
                          <TableHead key={h} className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorAnalytics.vendors?.map((v) => (
                        <TableRow key={v.id} className="hover:bg-white/5 transition-colors">
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{v.id}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{v.name}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                            <Badge variant="secondary">{v.type}</Badge>
                          </TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{v.chain}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{v.location}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">${v.revenue.toFixed(2)}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(`/super-admin/vendor/${v.id}?vendorType=${v.type}`)
                              }
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!vendorAnalytics.vendors?.length && (
                        <TableRow>
                          <TableCell colSpan={7} className="py-8 text-center text-gray-400">
                            No vendors found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <div className="block sm:hidden text-xs text-gray-400 mt-2 text-center">
                    Swipe left/right to see more columns
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
