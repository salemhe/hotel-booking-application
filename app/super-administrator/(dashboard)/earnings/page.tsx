'use client'

import React, { useState, useEffect } from 'react'
import { apiFetcher } from '@/lib/fetcher'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DollarSign, Hotel, UtensilsCrossed } from 'lucide-react'

// API_URL removed, use apiFetcher

interface MonthlyData {
  period: string
  total: number
  hotel: number
  restaurant: number
  growth: number
}

interface EarningsAnalytics {
  totalRevenue: number
  hotelRevenue: number
  restaurantRevenue: number
  monthly?: MonthlyData[]
}

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true)
  // const [sidebarOpen, setSidebarOpen] = useState(false)
  const [earningsAnalytics, setEarningsAnalytics] = useState<EarningsAnalytics>({
    totalRevenue: 0,
    hotelRevenue: 0,
    restaurantRevenue: 0,
    monthly: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const earningsRes = await apiFetcher(`/api/super-admin/analytics/revenue`)
        setEarningsAnalytics(earningsRes.data)
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

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 relative">
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto text-white overflow-y-visible relative">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 flex items-center gap-2 mt-16 md:mt-0">
            <DollarSign className="h-7 w-7 text-emerald-400" /> Earnings Analytics
          </h1>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 min-h-[110px]">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm md:text-base text-gray-200">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  ${earningsAnalytics.totalRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm md:text-base text-gray-200">Hotel Earnings</CardTitle>
                <Hotel className="h-4 w-4 text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  ${earningsAnalytics.hotelRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm md:text-base text-gray-200">Restaurant Earnings</CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  ${earningsAnalytics.restaurantRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-8">
            <CardHeader>
              <CardTitle className="text-white text-lg">Monthly Earnings Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[600px] text-xs sm:text-sm">
                  <TableHeader>
                    <TableRow>
                      {['Period', 'Total', 'Hotel', 'Restaurant', 'Growth'].map((h) => (
                        <TableHead key={h} className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {earningsAnalytics.monthly?.map((m, i) => (
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
                          {m.growth > 0 ? '+' : ''}{m.growth.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                    {!earningsAnalytics.monthly?.length && (
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
        </main>
      </div>
  )
}
