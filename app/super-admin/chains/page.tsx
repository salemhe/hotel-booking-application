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
import { Building2, Edit, Trash2, Plus } from "lucide-react";
import SuperAdminSidebar from "@/app/components/sidebars/SuperAdminSidebar";
import { SidebarProvider } from "@/app/components/ui/sidebar";
const API_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api/';

interface Chain {
  id: string;
  name: string;
  description: string;
  owner: string;
  locationCount: number;
}

export default function ChainsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [chains, setChains] = useState<Chain[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const chainsRes = await axios.get(`${API_URL}/super-admin/chains`);
        setChains(chainsRes.data.data);
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
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 overflow-x-hidden relative">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        <div className={`z-50 fixed md:static inset-y-0 left-0 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-4/5 max-w-xs md:w-64 bg-slate-900 md:bg-transparent h-full md:h-auto flex flex-col`} style={{ color: 'white' }}>
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
          <div className="relative z-10 w-full px-2 sm:px-4 md:px-8 py-4 flex-1 flex flex-col">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 lg:mb-8 flex items-center gap-2 mt-16 md:mt-0">
              <Building2 className="h-7 w-7 text-cyan-400" /> Chains
            </h1>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <Button onClick={() => router.push('/super-admin/chains/create')} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Chain
              </Button>
            </div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-0">
                <div className="overflow-x-auto w-full">
                  <Table className="min-w-[600px] w-full text-xs sm:text-sm">
                    <TableHeader>
                      <TableRow>
                        {["Chain ID", "Name", "Description", "Owner", "Locations", "Actions"].map(
                          (h) => (
                            <TableHead key={h} className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{h}</TableHead>
                          )
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chains.map((c) => (
                        <TableRow key={c.id} className="hover:bg-white/5 transition-colors">
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{c.id}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{c.name}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{c.description}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{c.owner}</TableCell>
                          <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{c.locationCount}</TableCell>
                          <TableCell className="flex gap-2 px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/super-admin/chains/${c.id}/edit`)}
                            >
                              <Edit className="mr-1 h-3 w-3" /> Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-300">
                              <Trash2 className="mr-1 h-3 w-3" /> Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!chains.length && (
                        <TableRow>
                          <TableCell colSpan={6} className="py-8 text-center text-gray-400">
                            No chains found
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
