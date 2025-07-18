"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// API endpoints to be implemented by backend:
// GET /api/super-admin/vendors (list all vendors)
// GET /api/super-admin/payments (all vendor payments, filterable)
// GET /api/super-admin/payments?vendorId=... (payments for a specific vendor)

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

export default function SuperAdminPayments() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [stats, setStats] = useState<any>({});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchVendors();
    fetchPayments();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [selectedVendor]);

  async function fetchVendors() {
    try {
      const res = await fetch("/api/super-admin/vendors");
      const data = await res.json();
      setVendors(data || []);
    } catch {
      setVendors([]);
    }
  }

  async function fetchPayments() {
    try {
      let url = "/api/super-admin/payments";
      if (selectedVendor) url += `?vendorId=${selectedVendor}`;
      const res = await fetch(url);
      const data = await res.json();
      setStats(data.stats || {});
      setTransactions(data.transactions || []);
      setChartData(data.chartData || []);
    } catch {
      setStats({});
      setTransactions([]);
      setChartData([]);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search" className="pl-10 w-80" />
              </div>
              {/* Vendor Filter Dropdown */}
              <select
                className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedVendor}
                onChange={e => setSelectedVendor(e.target.value)}
              >
                <option value="">All Vendors</option>
                {vendors.map((vendor: any) => (
                  <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">Super Admin</div>
                  <div className="text-gray-500">Admin</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
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
                <div className="text-2xl font-bold text-gray-900">{stats.totalEarnings ? `₦${stats.totalEarnings.toLocaleString()}` : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.earningsVsLastYear || "-"}</p>
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
                <div className="text-2xl font-bold text-gray-900">{stats.earningsThisWeek ? `₦${stats.earningsThisWeek.toLocaleString()}` : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.earningsVsLastWeek || "-"}</p>
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
                <div className="text-2xl font-bold text-gray-900">{stats.completedPayments ? `₦${stats.completedPayments.toLocaleString()}` : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.completedVsLastWeek || "-"}</p>
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
                <div className="text-2xl font-bold text-gray-900">{stats.pendingPayments ? `₦${stats.pendingPayments.toLocaleString()}` : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.pendingVsLastWeek || "-"}</p>
              </CardContent>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>
          {/* Earnings Trends Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-3">
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
                      <Button variant="ghost" size="sm">
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
                      <Button variant="ghost" size="sm">
                        Status <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All</DropdownMenuItem>
                      <DropdownMenuItem>Paid</DropdownMenuItem>
                      <DropdownMenuItem>Pending</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="sm">
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
                      <TableHead>Vendor</TableHead>
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
                        <TableCell>{transaction.vendorName}</TableCell>
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
                          <Button variant="ghost" size="sm">
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
