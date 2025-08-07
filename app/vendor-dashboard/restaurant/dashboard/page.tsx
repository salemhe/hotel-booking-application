'use client'

import { useState, useEffect } from 'react'

// Define interfaces for our data structures
interface Reservation {
  id: string;
  customerName: string;
  customerAvatar?: string;
  customerInitials?: string;
  name?: string;
  date: string | Date;
  time: string;
  guests: number;
  status: string;
}

interface ChartDataPoint {
  day: string;
  value1: number;
  value2: number;
  value3: number;
}

interface MenuCategory {
  name: string;
  percentage: number;
  amount: string | number;
  color: string;
}
import { 
  getDashboardStats, 
  getTodayReservations, 
  getReservationTrends,
  getCustomerFrequency,
  getRevenueByCategory,
  getReservationSources,
  getUpcomingReservations,
  getUserProfile
} from '@/app/lib/api-service'
import {
  Search, Bell, ChevronDown, X, Plus, TrendingDown, TrendingUp,
  Calendar, CreditCard, Users, DollarSign
} from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NativeSelect as Select } from '@/components/ui/select'

export default function Dashboard() {
  const [showNotification, setShowNotification] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for upcoming reservations notification
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([])
  
  // State for user profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    role: '',
    avatar: '',
    initials: ''
  })
  
  // State for dashboard data
  const [stats, setStats] = useState({
    reservationsToday: 0,
    prepaidReservations: 0,
    expectedGuests: 0,
    pendingPayments: 0,
    pendingPaymentsTrend: 0,
    reservationsTrend: 0,
    prepaidTrend: 0,
    guestsTrend: 0
  })
  const [reservations, setReservations] = useState<Record<string, unknown>[]>([])
  const [chartData, setChartData] = useState<Record<string, unknown>[]>([])
const [reservations, setReservations] = useState<Reservation[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [customerData, setCustomerData] = useState({
    newCustomers: 0,
    returningCustomers: 0,
    totalCustomers: 0
  })
  const [reservationSources, setReservationSources] = useState({
    website: 0,
    mobile: 0,
    walkIn: 0,
    total: 0
  })
  const [selectedPeriod, setSelectedPeriod] = useState('weekly')

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch all dashboard data in parallel
        const [statsData, todayReservations, trendsData, frequencyData, revenueData, sourcesData] = await Promise.all([
          getDashboardStats(),
          getTodayReservations(),
          getReservationTrends(selectedPeriod),
          getCustomerFrequency(selectedPeriod),
          getRevenueByCategory(selectedPeriod),
          getReservationSources(selectedPeriod)
        ])
        
        // Update state with fetched data
        setStats({
          reservationsToday: statsData.reservationsToday || 0,
          prepaidReservations: statsData.prepaidReservations || 0,
          expectedGuests: statsData.expectedGuests || 0,
          pendingPayments: statsData.pendingPayments || 0,
          pendingPaymentsTrend: statsData.pendingPaymentsTrend || 0,
          reservationsTrend: statsData.reservationsTrend || 0,
          prepaidTrend: statsData.prepaidTrend || 0,
          guestsTrend: statsData.guestsTrend || 0
        })
        
        setReservations(todayReservations || [])
        setChartData(trendsData?.chartData || [])
        
        setCustomerData({
          newCustomers: frequencyData?.newCustomers || 0,
          returningCustomers: frequencyData?.returningCustomers || 0,
          totalCustomers: frequencyData?.totalCustomers || 0
        })
        
        setMenuCategories(revenueData?.categories || [])
        
        setReservationSources({
          website: sourcesData?.website || 0,
          mobile: sourcesData?.mobile || 0,
          walkIn: sourcesData?.walkIn || 0,
          total: sourcesData?.total || 0
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [selectedPeriod])
  
  // Handler for period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JE</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Joseph Eyebiokin</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {showNotification && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mx-4 sm:mx-6 lg:mx-8 mt-4 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 text-yellow-400">⏰</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  3 Reservations commencing in the next 30 minutes
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotification(false)}
              className="text-yellow-800 hover:text-yellow-900"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back, Joseph!</h1>
            <p className="text-gray-600 mt-1">{"Here's what is happening today."}</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reservations made today</p>
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '-' : stats.reservationsToday}</p>
                  <div className="flex items-center mt-2">
                    {stats.reservationsTrend >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{stats.reservationsTrend}% vs last week</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-500">{Math.abs(stats.reservationsTrend)}% vs last week</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prepaid Reservations</p>
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '-' : stats.prepaidReservations}</p>
                  <div className="flex items-center mt-2">
                    {stats.prepaidTrend >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{stats.prepaidTrend}% vs last week</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-500">{Math.abs(stats.prepaidTrend)}% vs last week</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expected Guests Today</p>
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '-' : stats.expectedGuests}</p>
                  <div className="flex items-center mt-2">
                    {stats.guestsTrend >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{stats.guestsTrend}% vs last week</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-500">{Math.abs(stats.guestsTrend)}% vs last week</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? '-' : `₦${stats.pendingPayments.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                  </p>
                  <div className="flex items-center mt-2">
                    {stats.pendingPaymentsTrend >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{stats.pendingPaymentsTrend}% vs last week</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-500">{Math.abs(stats.pendingPaymentsTrend)}% vs last week</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Today's Reservations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{"Today's Reservation"}</CardTitle>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                  View All →
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-48">
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500">No reservations for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={reservation.customerAvatar || "/placeholder.svg?height=40&width=40"} />
                            <AvatarFallback>{reservation.customerInitials || reservation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{reservation.customerName}</p>
                            <p className="text-sm text-gray-500">ID: {reservation.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{new Date(reservation.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Time: {reservation.time}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{reservation.guests} Guests</p>
                        </div>
                        <Badge
                          variant={reservation.status === 'Upcoming' ? 'secondary' : 'default'}
                          className={reservation.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {reservation.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reservations Trends */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Reservations Trends</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    View All →
                  </Button>
                  <Select 
                    value={selectedPeriod} 
                    onChange={handlePeriodChange}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>{isLoading ? (
                <div className="flex justify-center items-center h-32 mb-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold">{chartData.reduce((sum, item) => sum + item.value1, 0)}</div>
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">8% vs last week</span>
                  </div>
                </div>
              )}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">This week</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">Last week</span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-32 space-x-2">
                  {chartData.length === 0 && !isLoading ? (
                    <div className="w-full flex items-center justify-center h-24">
                      <p className="text-gray-500 text-sm">No data available</p>
                    </div>
                  ) : (
                    chartData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full flex flex-col justify-end h-24 space-y-1">
                          <div
                            className="w-full bg-blue-400 rounded-t"
                            style={{ height: `${Math.max((data.value1 / (chartData.length ? Math.max(...chartData.map(d => d.value1)) : 1)) * 100, 5)}%` }}
                          ></div>
                          <div
                            className="w-full bg-teal-600 rounded"
                            style={{ height: `${Math.max((data.value2 / (chartData.length ? Math.max(...chartData.map(d => d.value2)) : 1)) * 100, 5)}%` }}
                          ></div>
                          <div
                            className="w-full bg-yellow-400 rounded-b"
                            style={{ height: `${Math.max((data.value3 / (chartData.length ? Math.max(...chartData.map(d => d.value3)) : 1)) * 100, 5)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{data.day}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Frequency */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Customer Frequency</CardTitle>
              <Select 
                value={selectedPeriod} 
                onChange={handlePeriodChange}
                className="w-24"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#0d9488"
                          strokeWidth="3"
                          strokeDasharray={`${(customerData.newCustomers / customerData.totalCustomers) * 100}, 100`}
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eab308"
                          strokeWidth="3"
                          strokeDasharray={`${(customerData.returningCustomers / customerData.totalCustomers) * 100}, 100`}
                          strokeDashoffset={`-${(customerData.newCustomers / customerData.totalCustomers) * 100}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-500">Total Customers</span>
                        <span className="text-xl font-bold">{customerData.totalCustomers}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                        <span className="text-sm">New Customers</span>
                      </div>
                      <span className="text-sm font-medium">
                        {customerData.totalCustomers ? 
                          Math.round((customerData.newCustomers / customerData.totalCustomers) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm">Returning Customers</span>
                      </div>
                      <span className="text-sm font-medium">
                        {customerData.totalCustomers ? 
                          Math.round((customerData.returningCustomers / customerData.totalCustomers) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Revenue by Menu Category */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue (Menu Category)</CardTitle>
              <Select 
                value={selectedPeriod} 
                onChange={handlePeriodChange}
                className="w-24"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="text-2xl font-bold">₦{menuCategories.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">8% vs last week</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {menuCategories.length === 0 ? (
                      <p className="text-gray-500 text-sm">No data available</p>
                    ) : (
                      menuCategories.map((category, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">{category.name}</span>
                            <div className="text-right">
                              <span className="text-sm font-medium">{category.percentage}%</span>
                              <span className="text-xs text-gray-500 ml-2">(₦{category.amount.toLocaleString()})</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${category.color} h-2 rounded-full`}
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Reservation Source */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reservation Source</CardTitle>
              <Select 
                value={selectedPeriod} 
                onChange={handlePeriodChange}
                className="w-24"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#0d9488"
                          strokeWidth="3"
                          strokeDasharray={`${(reservationSources.website / reservationSources.total) * 100}, 100`}
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eab308"
                          strokeWidth="3"
                          strokeDasharray={`${(reservationSources.mobile / reservationSources.total) * 100}, 100`}
                          strokeDashoffset={`-${(reservationSources.website / reservationSources.total) * 100}`}
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray={`${(reservationSources.walkIn / reservationSources.total) * 100}, 100`}
                          strokeDashoffset={`-${((reservationSources.website + reservationSources.mobile) / reservationSources.total) * 100}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-500">Total Reservations</span>
                        <span className="text-xl font-bold">{reservationSources.total}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                        <span className="text-sm">{reservationSources.website} website</span>
                      </div>
                      <span className="text-sm font-medium">
                        {reservationSources.total ? 
                          Math.round((reservationSources.website / reservationSources.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm">{reservationSources.mobile} mobile</span>
                      </div>
                      <span className="text-sm font-medium">
                        {reservationSources.total ? 
                          Math.round((reservationSources.mobile / reservationSources.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm">{reservationSources.walkIn} walk-in</span>
                      </div>
                      <span className="text-sm font-medium">
                        {reservationSources.total ? 
                          Math.round((reservationSources.walkIn / reservationSources.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}