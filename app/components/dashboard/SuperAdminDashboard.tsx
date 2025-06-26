'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import SuperAdminSidebar from '../sidebars/SuperAdminSidebar'
import { Users, DollarSign, Building2, TrendingUp } from 'lucide-react'

const API_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api/'

interface VendorAnalytics {
  totalVendors: number
  totalHotels: number
  totalRestaurants: number
}

interface RevenueAnalytics {
  totalRevenue: number
}

interface Chain {
  id: string
  name: string
  description: string
  owner: string
  locationCount: number
}

interface Location {
  id: string
  name: string
  address: string
  city: string
  chain?: { name: string }
}

export default function SuperAdminDashboard() {
  const { user, token, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [vendorAnalytics, setVendorAnalytics] = useState<VendorAnalytics>({
    totalVendors: 0,
    totalHotels: 0,
    totalRestaurants: 0,
  })
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics>({
    totalRevenue: 0,
  })
  const [chains, setChains] = useState<Chain[]>([])
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [
          vendorRes,
          revenueRes,
          chainsRes,
          locationsRes,
        ] = await Promise.all([
          axios.get(`${API_URL}/super-admin/analytics/vendors`),
          axios.get(`${API_URL}/super-admin/analytics/revenue`),
          axios.get(`${API_URL}/super-admin/chains`),
          axios.get(`${API_URL}/super-admin/locations`),
        ])
        setVendorAnalytics(vendorRes.data.data)
        setRevenueAnalytics(revenueRes.data.data)
        setChains(chainsRes.data.data)
        setLocations(locationsRes.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const { SidebarProvider } = require("@/app/components/ui/sidebar")

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
    )
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 overflow-x-hidden relative">
        {/* Sidebar */}
        <div
          className={`z-30 fixed md:static inset-y-0 left-0 transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 w-4/5 max-w-xs md:w-64 bg-slate-900 md:bg-transparent h-full md:h-auto`}
        >
          <SuperAdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full min-h-screen relative">
          {/* Collapse Button */}
          <button
            className="fixed top-4 left-4 z-40 md:hidden bg-slate-800 text-white p-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>

          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>

          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>

          <div className="relative z-10 w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 flex-1 flex flex-col">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-16 md:mt-0">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-300 mb-3 sm:mb-4 lg:mb-8 text-xs sm:text-base">
              Manage your entire platform from one place
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white min-h-[120px]">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm text-gray-200">Total Vendors</CardTitle>
                  <Users className="h-4 w-4 text-teal-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl font-bold">
                    {vendorAnalytics.totalVendors}
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    {vendorAnalytics.totalHotels} Hotels, {vendorAnalytics.totalRestaurants} Restaurants
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 min-h-[120px]">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm text-gray-200">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl font-bold">
                    ${revenueAnalytics.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-300 mt-1">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 min-h-[120px]">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm text-gray-200">Total Chains</CardTitle>
                  <Building2 className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl font-bold">{chains.length}</div>
                  <p className="text-xs text-gray-300 mt-1">
                    Across {locations.length} locations
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-3 sm:mt-4 lg:mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-xs sm:text-base">No recent activity to display</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}