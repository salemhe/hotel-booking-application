'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/app/contexts/AuthContext'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import {
  Building2,
  Users,
  DollarSign,
  MapPin,
  TrendingUp,
  Hotel,
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react'

const API_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api/'

interface Vendor {
  id: string
  name: string
  type: string
  chain: string
  location: string
  revenue: number
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

interface MonthlyData {
  period: string
  total: number
  hotel: number
  restaurant: number
  growth: number
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

export default function SuperAdminDashboard() {
  const { user, token, isAuthenticated } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [vendorAnalytics, setVendorAnalytics] = useState<VendorAnalytics>({
    totalVendors: 0,
    totalHotels: 0,
    totalRestaurants: 0,
  })
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics>({
    totalRevenue: 0,
    hotelRevenue: 0,
    restaurantRevenue: 0,
  })
  const [chains, setChains] = useState<Chain[]>([])
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/vendor-signup')
      return
    }
    if (user?.role !== 'super-admin') {
      if (user?.role === 'hotel-admin') {
        router.push('/hotel-dashboard')
      } else if (user?.role === 'restaurant-admin') {
        router.push('/restaurant-dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'super-admin') return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [
          vendorRes,
          revenueRes,
          chainsRes,
          locationsRes,
        ] = await Promise.all([
          axios.get(`${API_URL}/super-admin/analytics/vendors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/super-admin/analytics/revenue`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/super-admin/chains`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/super-admin/locations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
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
  }, [isAuthenticated, user, token])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Redirecting to vendor signup…
      </div>
    )
  }

  if (user?.role !== 'super-admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-white">
        <h2 className="text-2xl font-bold">Permission Denied</h2>
        <p>You don&apos;t have access to the Super Admin Dashboard.</p>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          <Button variant="outline" onClick={() => router.push('/vendor-signup')}>
            Register as Vendor
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto text-white">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-300 mb-8">Manage your entire platform from one place</p>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 bg-white/10 backdrop-blur-sm border border-white/20">
            {['overview', 'vendors', 'chains', 'locations', 'revenue'].map(v => (
              <TabsTrigger
                key={v}
                value={v}
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-300"
              >
                {v[0].toUpperCase() + v.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 1. Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm text-gray-200">Total Vendors</CardTitle>
                  <Users className="h-4 w-4 text-teal-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {vendorAnalytics.totalVendors}
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    {vendorAnalytics.totalHotels} Hotels, {vendorAnalytics.totalRestaurants}{' '}
                    Restaurants
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm text-gray-200">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${revenueAnalytics.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-300 mt-1">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm text-gray-200">Total Chains</CardTitle>
                  <Building2 className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{chains.length}</div>
                  <p className="text-xs text-gray-300 mt-1">
                    Across {locations.length} locations
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">No recent activity to display</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. Vendors */}
          <TabsContent value="vendors" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-400" />
                  Vendor Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[
                        'Vendor ID',
                        'Name',
                        'Type',
                        'Chain',
                        'Location',
                        'Revenue',
                        'Actions',
                      ].map(h => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorAnalytics.vendors?.map(v => (
                      <TableRow key={v.id}>
                        <TableCell>{v.id}</TableCell>
                        <TableCell>{v.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{v.type}</Badge>
                        </TableCell>
                        <TableCell>{v.chain}</TableCell>
                        <TableCell>{v.location}</TableCell>
                        <TableCell>${v.revenue.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/super-admin/vendor/${v.id}?vendorType=${v.type}`
                              )
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. Chains */}
          <TabsContent value="chains" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-6 w-6 text-cyan-400" /> Manage Chains
              </h2>
              <Button onClick={() => router.push('/super-admin/chains/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Chain
              </Button>
            </div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {['Chain ID', 'Name', 'Description', 'Owner', 'Locations', 'Actions'].map(
                        h => (
                          <TableHead key={h}>{h}</TableHead>
                        )
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chains.map(c => (
                      <TableRow key={c.id}>
                        <TableCell>{c.id}</TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.description}</TableCell>
                        <TableCell>{c.owner}</TableCell>
                        <TableCell>{c.locationCount}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/super-admin/chains/${c.id}/edit`)
                            }
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Locations */}
          <TabsContent value="locations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="h-6 w-6 text-teal-400" /> Manage Locations
              </h2>
              <Button onClick={() => router.push('/super-admin/locations/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Location
              </Button>
            </div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {['Location ID', 'Name', 'Address', 'City', 'Chain', 'Actions'].map(h => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map(l => (
                      <TableRow key={l.id}>
                        <TableCell>{l.id}</TableCell>
                        <TableCell>{l.name}</TableCell>
                        <TableCell>{l.address}</TableCell>
                        <TableCell>{l.city}</TableCell>
                        <TableCell>{l.chain?.name || 'N/A'}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/super-admin/locations/${l.id}/edit`)
                            }
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5. Revenue */}
          <TabsContent value="revenue" className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-emerald-400" /> Revenue Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm text-gray-200">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${revenueAnalytics.totalRevenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm text-gray-200">Hotel Revenue</CardTitle>
                  <Hotel className="h-4 w-4 text-teal-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${revenueAnalytics.hotelRevenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm text-gray-200">Restaurant Revenue</CardTitle>
                  <UtensilsCrossed className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${revenueAnalytics.restaurantRevenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Monthly Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {['Period', 'Total', 'Hotel', 'Restaurant', 'Growth'].map(h => (
                        <TableHead key={h}>{h}</TableHead>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
