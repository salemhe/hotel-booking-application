'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

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
  }, [])

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
        <h1 className="text-4xl font-bold text-white">
          Super Admin Dashboard
        </h1>
        <p className="mb-8 text-white">Manage your entire platform from one place</p>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 bg-white/10 border border-white/20">
            {['overview', 'vendors', 'chains', 'locations', 'revenue'].map(v => (
              <TabsTrigger
                key={v}
                value={v}
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-white"
              >
                {v[0].toUpperCase() + v.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 1. Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border border-white/20 text-white">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm text-white">Total Vendors</CardTitle>
                  <Users className="h-4 w-4 text-teal-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {vendorAnalytics.totalVendors}
                  </div>
                  <p className="text-xs text-white mt-1">
                    {vendorAnalytics.totalHotels} Hotels, {vendorAnalytics.totalRestaurants}{' '}
                    Restaurants
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border border-white/20 text-white">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm text-white">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${revenueAnalytics.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-white mt-1">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border border-white/20 text-white">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm text-white">Total Chains</CardTitle>
                  <Building2 className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{chains.length}</div>
                  <p className="text-xs text-white mt-1">
                    Across {locations.length} locations
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white">No recent activity to display</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. Vendors */}
          <TabsContent value="vendors" className="space-y-6">
            <Card className="bg-white/10 border border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
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
                        <TableHead key={h} className="text-white">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorAnalytics.vendors?.map(v => (
                      <TableRow key={v.id}>
                        <TableCell className="text-white">{v.id}</TableCell>
                        <TableCell className="text-white">{v.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{v.type}</Badge>
                        </TableCell>
                        <TableCell className="text-white">{v.chain}</TableCell>
                        <TableCell className="text-white">{v.location}</TableCell>
                        <TableCell className="text-white">${v.revenue.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/super-admin/vendor/${v.id}?vendorType=${v.type}`
                              )
                            }
                            className="text-white border-white"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!vendorAnalytics.vendors?.length && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-white">
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
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                <Building2 className="h-6 w-6 text-cyan-400" /> Manage Chains
              </h2>
              <Button onClick={() => router.push('/super-admin/chains/create')} className="text-white border-white">
                <Plus className="mr-2 h-4 w-4" />
                Add New Chain
              </Button>
            </div>
            <Card className="bg-white/10 border border-white/20 text-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {['Chain ID', 'Name', 'Description', 'Owner', 'Locations', 'Actions'].map(
                        h => (
                          <TableHead key={h} className="text-white">{h}</TableHead>
                        )
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chains.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="text-white">{c.id}</TableCell>
                        <TableCell className="text-white">{c.name}</TableCell>
                        <TableCell className="text-white">{c.description}</TableCell>
                        <TableCell className="text-white">{c.owner}</TableCell>
                        <TableCell className="text-white">{c.locationCount}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/super-admin/chains/${c.id}`)}
                            className="text-white border-white"
                          >
                            <Edit className="mr-1 h-4 w-4" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!chains.length && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-white">
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
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                <MapPin className="h-6 w-6 text-emerald-400" /> Manage Locations
              </h2>
              <Button onClick={() => router.push('/super-admin/locations/create')} className="text-white border-white">
                <Plus className="mr-2 h-4 w-4" />
                Add New Location
              </Button>
            </div>
            <Card className="bg-white/10 border border-white/20 text-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {['Location ID', 'Name', 'Address', 'City', 'Chain', 'Actions'].map(h => (
                        <TableHead key={h} className="text-white">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map(l => (
                      <TableRow key={l.id}>
                        <TableCell className="text-white">{l.id}</TableCell>
                        <TableCell className="text-white">{l.name}</TableCell>
                        <TableCell className="text-white">{l.address}</TableCell>
                        <TableCell className="text-white">{l.city}</TableCell>
                        <TableCell className="text-white">{l.chain?.name ?? '-'}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/super-admin/locations/${l.id}`)}
                            className="text-white border-white"
                          >
                            <Edit className="mr-1 h-4 w-4" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!locations.length && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-white">
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
            <Card className="bg-white/10 border border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5 text-emerald-400" /> Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                  <div>
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <p className="text-2xl font-bold">${revenueAnalytics.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Hotel Revenue</h3>
                    <p className="text-2xl font-bold">${revenueAnalytics.hotelRevenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Restaurant Revenue</h3>
                    <p className="text-2xl font-bold">${revenueAnalytics.restaurantRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-white">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                {revenueAnalytics.monthly?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {['Period', 'Total', 'Hotel', 'Restaurant', 'Growth %'].map(h => (
                          <TableHead key={h} className="text-white">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueAnalytics.monthly.map(month => (
                        <TableRow key={month.period}>
                          <TableCell className="text-white">{month.period}</TableCell>
                          <TableCell className="text-white">${month.total.toFixed(2)}</TableCell>
                          <TableCell className="text-white">${month.hotel.toFixed(2)}</TableCell>
                          <TableCell className="text-white">${month.restaurant.toFixed(2)}</TableCell>
                          <TableCell className="text-white">{month.growth.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-white">No monthly revenue data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
