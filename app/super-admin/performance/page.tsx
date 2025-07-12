'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { TrendingUp, Users, DollarSign, Building2 } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const API_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api/'

interface MonthlyData {
  period: string
  total: number
  hotel: number
  restaurant: number
  growth: number
}

interface Vendor {
  id: string
  name: string
  type: 'hotel' | 'restaurant'
  // Add other relevant fields as needed
}

interface VendorAnalytics {
  totalVendors: number
  totalHotels: number
  totalRestaurants: number
  vendors?: Vendor[]
}

interface RevenueAnalytics {
  totalRevenue: number
  hotelRevenue: number
  restaurantRevenue: number
  monthly?: MonthlyData[]
}

interface Chain {
  id: string
  name: string
  description: string
  owner: string
  locationCount: number
}

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true)
  // const [sidebarOpen, setSidebarOpen] = useState(false)
  const [vendorAnalytics, setVendorAnalytics] = useState<VendorAnalytics>({
    totalVendors: 0,
    totalHotels: 0,
    totalRestaurants: 0,
    vendors: [],
  })
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics>({
    totalRevenue: 0,
    hotelRevenue: 0,
    restaurantRevenue: 0,
    monthly: [],
  })
  const [chains, setChains] = useState<Chain[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [vendorRes, revenueRes, chainsRes] = await Promise.all([
          axios.get(`${API_URL}/super-admin/analytics/vendors`),
          axios.get(`${API_URL}/super-admin/analytics/revenue`),
          axios.get(`${API_URL}/super-admin/chains`),
        ])
        setVendorAnalytics(vendorRes.data.data)
        setRevenueAnalytics(revenueRes.data.data)
        setChains(chainsRes.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // const { SidebarProvider } = require('@/app/components/ui/sidebar')

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

  const monthly = revenueAnalytics.monthly || []
  const chartData = {
    labels: monthly.map((m) => m.period),
    datasets: [
      {
        label: 'Total Revenue',
        data: monthly.map((m) => m.total),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        tension: 0.4,
      },
      {
        label: 'Hotel Revenue',
        data: monthly.map((m) => m.hotel),
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20,184,166,0.2)',
        tension: 0.4,
      },
      {
        label: 'Restaurant Revenue',
        data: monthly.map((m) => m.restaurant),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6,182,212,0.2)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff' } },
      title: {
        display: true,
        text: 'Revenue Trends',
        color: '#fff',
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 relative">
      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4 md:p-8 lg:p-10 max-w-7xl mx-auto text-white w-full relative">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 flex items-center gap-2 mt-16 md:mt-0">
            <TrendingUp className="h-7 w-7 text-emerald-400" /> Dashboard Overview
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm text-gray-200">Total Vendors</CardTitle>
                <Users className="h-4 w-4 text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold">{vendorAnalytics.totalVendors}</div>
                <p className="text-xs text-gray-300 mt-1">{vendorAnalytics.totalHotels} Hotels, {vendorAnalytics.totalRestaurants} Restaurants</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm text-gray-200">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold">${revenueAnalytics.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-gray-300 mt-1">All-time revenue</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm text-gray-200">Total Chains</CardTitle>
                <Building2 className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl font-bold">{chains.length}</div>
                <p className="text-xs text-gray-300 mt-1">Chains on platform</p>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-5 w-5 text-emerald-400" /> Revenue Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-2 sm:p-4 w-full flex items-center justify-center" style={{ minHeight: 200, height: '28vw', maxHeight: 350 }}>
                <div className="w-full" style={{ height: '100%' }}>
                  <Line
                    data={chartData}
                    options={{
                      ...chartOptions,
                      maintainAspectRatio: false,
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
              <div className="block sm:hidden text-xs text-gray-400 mt-2 text-center">
                Pinch or swipe to explore the chart
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  )
}
