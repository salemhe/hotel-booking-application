"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { MapPin, Edit, Trash2, Plus } from "lucide-react";
import SuperAdminSidebar from "@/app/components/sidebars/SuperAdminSidebar";
const API_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api/';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  chain?: { name: string };
}

export default function LocationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const locationsRes = await axios.get(`${API_URL}/super-admin/locations`);
        setLocations(locationsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { SidebarProvider } = require("@/app/components/ui/sidebar");

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
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 lg:mb-8 flex items-center gap-2 mt-16 md:mt-0">
              <MapPin className="h-7 w-7 text-teal-400" /> Locations
            </h1>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <Button onClick={() => router.push('/super-admin/locations/create')} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Location
              </Button>
            </div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-0">
                <div className="overflow-x-auto w-full">
                  <Table className="min-w-[600px] w-full text-xs sm:text-sm">
                    <TableHeader>
                      <TableRow>
                        {["Location ID", "Name", "Address", "City", "Chain", "Actions"].map(
                          (h) => (
                            <TableHead key={h} className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{h}</TableHead>
                          )
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locations.map((l) => (
                        <TableRow key={l.id} className="hover:bg-white/5 transition-colors">
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{l.id}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{l.name}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{l.address}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{l.city}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{l.chain?.name || 'N/A'}</TableCell>
                          <TableCell className="flex gap-2 px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/super-admin/locations/${l.id}/edit`)}
                            >
                              <Edit className="mr-1 h-3 w-3" /> Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-300">
                              <Trash2 className="mr-1 h-3 w-3" /> Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!locations.length && (
                        <TableRow>
                          <TableCell colSpan={6} className="py-8 text-center text-gray-400">
                            No locations found
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
