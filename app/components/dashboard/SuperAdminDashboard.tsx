"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  Home,
  MapPin,
  MenuIcon,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Download,
  Plus,
  Filter,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = "https://hotel-booking-app-backend-30q1.onrender.com/api";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [reservations, setReservations] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch reservations
        const reservationsRes = await axios.get(`${API_URL}/super-admin/reservations/today`);
        setReservations(reservationsRes.data.data || []);

        // Fetch chart data (example endpoint, adjust as needed)
        const chartRes = await axios.get(`${API_URL}/super-admin/analytics/reservations-trend`);
        setChartData(chartRes.data.data || []);

        // Fetch stats (example endpoint, adjust as needed)
        const statsRes = await axios.get(`${API_URL}/super-admin/analytics/summary`);
        setStats(statsRes.data.data || {});
      } catch (err) {
        // fallback to empty data
        setReservations([]);
        setChartData([]);
        setStats({});
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/super-admin/dashboard" },
    { id: "reservations", label: "Reservations", icon: Calendar, href: "/super-admin/reservations" },
    { id: "branches", label: "Branches", icon: MapPin, href: "/super-admin/branches" },
    { id: "menu", label: "Menu Management", icon: MenuIcon, href: "/super-admin/menu" },
    { id: "reports", label: "Reports", icon: FileText, href: "/super-admin/reports" },
        { id: "settings", label: "Settings", icon: Settings, href: "/super-admin/settings" },
    { id: "logout", label: "Logout", icon: LogOut, href: "/logout" },
  ];

  const SimpleChart = ({ data }: { data: typeof chartData }) => (
    <div className="flex items-end justify-between h-32 gap-1">
      {data.map((item, index) => (
        <div key={item.name} className="flex flex-col items-center gap-1">
          <div
            className={`w-8 rounded-t ${
              index % 3 === 0
                ? "bg-blue-500"
                : index % 3 === 1
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
            style={{ height: `${(item.value / 70) * 100}%` }}
          />
          <span className="text-xs text-gray-600">{item.name}</span>
        </div>
      ))}
    </div>
  );

  const DonutChart = ({ percentage, color, label }: { percentage: number; color: string; label: string }) => (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${percentage}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold">{percentage}%</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <svg className="animate-spin h-10 w-10 text-teal-600" viewBox="0 0 24 24">
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-teal-800 text-white flex flex-col">
        <div className="p-6 border-b border-teal-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-800 font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold">Bookies</span>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={index}>
                  <button
                    onClick={() => router.push(item.href)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                      isActive ? "bg-teal-700 text-white" : "text-teal-100 hover:bg-teal-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-teal-700">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => router.push("/super-admin/settings")}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-100 hover:bg-teal-700 hover:text-white transition-colors w-full text-left"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/logout")}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-100 hover:bg-teal-700 hover:text-white transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search" className="pl-10 w-80" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>JE</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="text-sm font-medium">Joseph Eyebolam</div>
                      <div className="text-xs text-gray-500">Admin</div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Alert Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800">{reservations.filter(r => r.status === "In 30 mins").length} Reservations commencing in the next 30 minutes</span>
            </div>
            <Button variant="ghost" size="sm" className="text-yellow-600">
              ×
            </Button>
          </div>
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back, Joseph!</h1>
              <p className="text-gray-600">{"Here's what is happening today."}</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">+ New Reservation</Button>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Reservations made today</p>
                    <p className="text-2xl font-bold">{stats.reservationsToday || 0}</p>
                    <p className="text-xs text-gray-500">↑ {stats.reservationsChange || 0}% vs last week</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Prepaid Reservations</p>
                    <p className="text-2xl font-bold">{stats.prepaidReservations || 0}</p>
                    <p className="text-xs text-gray-500">↑ {stats.prepaidChange || 0}% vs last week</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Expected Guests Today</p>
                    <p className="text-2xl font-bold">{stats.guestsToday || 0}</p>
                    <p className="text-xs text-gray-500">↑ {stats.guestsChange || 0}% vs last week</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                    <p className="text-2xl font-bold">${stats.pendingPayments || 0}</p>
                    <p className="text-xs text-gray-500">↓ {stats.paymentsChange || 0}% vs last week</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reservations Table - Responsive and Feature-rich */}
            <div className="lg:col-span-2">
              <Card className="overflow-x-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Reservation List</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-teal-600">
                      <Download className="w-4 h-4 mr-1" /> Export
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> New Reservation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Filters and Search */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md">All</Button>
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Upcoming</Button>
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Completed</Button>
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Canceled</Button>
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">No shows</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search by guest name or ID"
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-48 md:w-64"
                        />
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                      </select>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>Payment Status</option>
                        <option>Paid</option>
                        <option>Pending</option>
                      </select>
                      <Button size="sm" variant="ghost" className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                        <span>Advanced Filter</span>
                      </Button>
                    </div>
                  </div>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input type="checkbox" className="rounded border-gray-300" />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No of Guests</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal Preselected</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.map((reservation) => (
                          <tr key={reservation.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <input type="checkbox" className="rounded border-gray-300" />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-medium">
                                    {reservation.name?.split(" ").map((n: string) => n[0]).join("")}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                                  <div className="text-sm text-gray-500">{reservation.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{reservation.date}</div>
                              <div className="text-sm text-gray-500">{reservation.time}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.guests}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {reservation.mealPreselected ? (
                                <Check className="w-5 h-5 text-green-500" />
                              ) : (
                                <X className="w-5 h-5 text-red-500" />
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  reservation.paymentStatus === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : reservation.paymentStatus === "Pay at Restaurant"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {reservation.paymentStatus}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  reservation.reservationStatus === "Upcoming"
                                    ? "bg-blue-100 text-blue-800"
                                    : reservation.reservationStatus === "In 30 mins"
                                    ? "bg-orange-100 text-orange-800"
                                    : reservation.reservationStatus === "In 1 hour"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {reservation.reservationStatus}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  <div className="px-6 py-3 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-2">
                    <div className="text-sm text-gray-500">Page 1 of 20</div>
                    <div className="flex flex-wrap items-center space-x-2">
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">1</Button>
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">2</Button>
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">3</Button>
                      <span className="px-3 py-1 text-sm text-gray-500">...</span>
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">10</Button>
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">11</Button>
                      <Button size="sm" variant="ghost" className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">12</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Reservations Trends */}
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Reservations Trends</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      Weekly
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-2xl font-bold">{stats.reservationsThisWeek || 0}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      {stats.reservationsTrend || 0}% vs last week
                    </div>
                  </div>
                  <SimpleChart data={chartData} />
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    <span>This week</span>
                    <span>Last week</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Bottom Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Customer Frequency */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customer Frequency</CardTitle>
                <Button variant="ghost" size="sm">
                  Weekly
                </Button>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <DonutChart percentage={64} color="#3b82f6" label="New Customers" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">New Customers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Return</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Revenue Menu Category */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Revenue (Menu Category)</CardTitle>
                <Button variant="ghost" size="sm">
                  Weekly
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-lg font-bold">#220,500</div>
                  <div className="text-sm text-gray-500">8.4% vs last week</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Main Dish</span>
                      <span>50% (₦110,250)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Drinks</span>
                      <span>22.7% (₦50,000)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "22.7%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Starters</span>
                      <span>18.6% (₦41,013)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "18.6%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Desserts</span>
                      <span>8.2% (₦18,081)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "8.2%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Reservation Source */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Reservation Source</CardTitle>
                <Button variant="ghost" size="sm">
                  Weekly
                </Button>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <DonutChart percentage={58} color="#10b981" label="Total online orders" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">58% website</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">30 mobile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">20 walk in</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
