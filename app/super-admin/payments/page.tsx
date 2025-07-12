"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  Home,
  Calendar,
  Star,
  Menu as MenuIcon,
  CreditCard,
  Settings,
  LogOut,
  Edit,
  Plus,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import SuperAdminSidebar from "@/app/components/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const sidebarItems = [
  { name: "Dashboard", icon: Home, href: "/super-admin/dashboard" },
  { name: "Reservations", icon: Calendar, href: "/super-admin/reservations" },
  { name: "Reviews", icon: Star, href: "/super-admin/reviews" },
  { name: "Menu Management", icon: MenuIcon, href: "/super-admin/menu" },
  { name: "Payments", icon: CreditCard, href: "/super-admin/payments" },
  { name: "Staff", icon: Users, href: "/super-admin/staff" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "Partly paid":
      return "bg-yellow-100 text-yellow-800";
    case "Current":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function BookiesDashboard() {
  // Removed unused variable 'pathname'
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch chart data and transactions from backend
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [chartRes, transRes] = await Promise.all([
          fetch("https://hotel-booking-app-backend-30q1.onrender.com/api/super-admin/payments/chart"),
          fetch("https://hotel-booking-app-backend-30q1.onrender.com/api/super-admin/payments/transactions"),
        ]);
        const chartJson = await chartRes.json();
        const transJson = await transRes.json();
        if (isMounted) {
          setChartData(chartJson);
          setTransactions(transJson);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar removed: now handled by layout.tsx */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search" className="pl-10 w-80" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JE</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">Joseph Eyitolorun</div>
                  <div className="text-gray-500">Admin</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Payments & Earnings</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Hide charts
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">₦2,567,456.00</div>
                <p className="text-xs text-gray-500 mt-1">₦ 100 vs last year</p>
              </CardContent>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Earnings this Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">₦525,345.00</div>
                <p className="text-xs text-gray-500 mt-1">₦ 8% vs last week</p>
              </CardContent>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">₦372,556.00</div>
                <p className="text-xs text-gray-500 mt-1">₦ 1% vs last week</p>
              </CardContent>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">₦152,789.00</div>
                <p className="text-xs text-gray-500 mt-1">₦ 12% vs last week</p>
              </CardContent>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Available Balance Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-4">₦567,456.00</div>
                <p className="text-sm text-gray-500 mb-6">Last payment processed on May 21st, 2024</p>
                <div className="bg-gray-900 rounded-lg p-4 text-white relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm opacity-75">Zenith Bank</div>
                      <div className="text-xs opacity-60">Savings Account</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mb-4">
                    <div className="text-lg font-mono">••••••123456</div>
                    <div className="text-xs opacity-60">Joseph Eyitolorun</div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Plus className="h-6 w-6 opacity-50" />
                  </div>
                </div>
                <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </CardContent>
            </Card>
            {/* Earnings Trends Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Earnings Trends</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Weekly <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Daily</DropdownMenuItem>
                        <DropdownMenuItem>Weekly</DropdownMenuItem>
                        <DropdownMenuItem>Monthly</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="text-2xl font-bold">{chartData.length}</div>
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    ↗ 8% vs last week
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                      <YAxis hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot={false}
                        fill="url(#colorGradient)"
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Transaction History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search transactions" className="pl-10 w-64" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Date <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Today</DropdownMenuItem>
                      <DropdownMenuItem>This Week</DropdownMenuItem>
                      <DropdownMenuItem>This Month</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Status <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All</DropdownMenuItem>
                      <DropdownMenuItem>Paid</DropdownMenuItem>
                      <DropdownMenuItem>Pending</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{transaction.date}</TableCell>
                        <TableCell>{transaction.transactionId}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">EJ</AvatarFallback>
                            </Avatar>
                            <span>{transaction.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.branch}</TableCell>
                        <TableCell>{transaction.method}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
