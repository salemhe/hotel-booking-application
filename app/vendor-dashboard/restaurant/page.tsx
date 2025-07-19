"use client";
import { useState } from "react"
import { Search, Bell, Calendar, Users, TrendingUp, DollarSign, Clock, Eye, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RestaurantDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data for reservations
  const reservations = [
    { id: 1, name: "Emily Johnson", date: "June 5, 2024", time: "6:00 - 7:00 pm", guests: 4, status: "Upcoming" },
    { id: 2, name: "Emily Johnson", date: "June 5, 2024", time: "6:00 - 7:00 pm", guests: 4, status: "Upcoming" },
    { id: 3, name: "Emily Johnson", date: "June 5, 2024", time: "6:00 - 7:00 pm", guests: 4, status: "In 30 mins" },
    { id: 4, name: "Emily Johnson", date: "June 5, 2024", time: "6:00 - 7:00 pm", guests: 4, status: "In 30 mins" },
    { id: 5, name: "Emily Johnson", date: "June 5, 2024", time: "6:00 - 7:00 pm", guests: 4, status: "In 30 mins" },
  ]

  // Sample data for charts
  const reservationTrends = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 52 },
    { day: "Wed", value: 38 },
    { day: "Thu", value: 65 },
    { day: "Fri", value: 78 },
    { day: "Sat", value: 85 },
    { day: "Sun", value: 72 },
  ]

  const menuCategories = [
    { category: "Main Dish", revenue: 2847, percentage: 45 },
    { category: "Drinks", revenue: 1523, percentage: 24 },
    { category: "Starters", revenue: 1205, percentage: 19 },
    { category: "Desserts", revenue: 756, percentage: 12 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Branch Home page</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <Button variant="ghost" size="sm" className="p-2 rounded-full">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Restaurant | HQ</span>
              <Avatar className="h-8 w-8">
                <AvatarFallback>JC</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-semibold">JC</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Josh Chicken &apos; Grill - Ikeja</h2>
              <p className="text-gray-500 text-sm">���� 123 Ikeja Street, Lagos</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Edit Branch Info
            </Button>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              Add New Branch
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Yesterday Walk Visits</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-gray-500">↑ 12% vs last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Repeat Reservations</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-gray-500">↑ 8% vs last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Enhanced Guests Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">80</div>
              <p className="text-xs text-gray-500">↑ 15% vs last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,546.00</div>
              <p className="text-xs text-gray-500">↑ 23% vs last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today&apos;s Reservations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Today&apos;s Reservations</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>EJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{reservation.name}</p>
                          <p className="text-sm text-gray-500">
                            {reservation.date} • {reservation.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">{reservation.guests} Guests</span>
                        <Badge
                          variant={reservation.status === "Upcoming" ? "secondary" : "default"}
                          className={reservation.status === "In 30 mins" ? "bg-orange-100 text-orange-800" : ""}
                        >
                          {reservation.status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Free walk</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reservations Trends Chart */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Reservations Trends</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reservationTrends.map((item) => (
                    <div key={item.day} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.day}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full"
                            style={{ width: `${(item.value / 100) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Frequency */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Customer Frequency</CardTitle>
              <Select defaultValue="weekly">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
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
                      stroke="#14b8a6"
                      strokeWidth="3"
                      strokeDasharray="60, 40"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">60%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span className="text-sm">New Customers</span>
                  </div>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm">Returning Customers</span>
                  </div>
                  <span className="text-sm font-medium">40%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Menu Category */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Revenue Menu Category</CardTitle>
              <Select defaultValue="weekly">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">$220,500</div>
              <p className="text-sm text-gray-500 mb-4">↑ 15% vs last week</p>
              <div className="space-y-3">
                {menuCategories.map((item, idx) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.category}</span>
                      <span className="text-sm font-medium">
                        {item.percentage}% (${item.revenue})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          idx === 0
                            ? "bg-blue-500"
                            : idx === 1
                              ? "bg-green-500"
                              : idx === 2
                                ? "bg-yellow-500"
                                : "bg-purple-500"
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Registration Source */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Registration Source</CardTitle>
              <Select defaultValue="weekly">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
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
                      stroke="#14b8a6"
                      strokeWidth="3"
                      strokeDasharray="70, 30"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">70%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span className="text-sm">Online</span>
                  </div>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm">Walk-in</span>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>📱 25 referrals</span>
                <span>🌐 30 referrals</span>
                <span>📧 20 walk-in</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
