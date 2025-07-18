"use client";

import React from "react";
import {
  Clock,
  Plus,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const todaysReservations = [
  {
    id: "RES12345",
    customer: { name: "Emily Johnson", id: "#12345" },
    date: "June 5, 2025",
    time: "7:30 pm",
    guests: 4,
    status: "upcoming",
  },
  {
    id: "RES12346",
    customer: { name: "Emily Johnson", id: "#12346" },
    date: "June 5, 2025",
    time: "8:00 pm",
    guests: 4,
    status: "upcoming",
  },
  {
    id: "RES12347",
    customer: { name: "Emily Johnson", id: "#12347" },
    date: "June 5, 2025",
    time: "6:30 pm",
    guests: 4,
    status: "in-30-mins",
  },
  {
    id: "RES12348",
    customer: { name: "Emily Johnson", id: "#12348" },
    date: "June 5, 2025",
    time: "7:00 pm",
    guests: 4,
    status: "in-30-mins",
  },
  {
    id: "RES12349",
    customer: { name: "Emily Johnson", id: "#12349" },
    date: "June 5, 2025",
    time: "8:30 pm",
    guests: 4,
    status: "in-30-mins",
  },
];

const weeklyData = [
  { name: "Mon", reservations: 20 },
  { name: "Tues", reservations: 40 },
  { name: "Wed", reservations: 30 },
  { name: "Thurs", reservations: 60 },
  { name: "Fri", reservations: 80 },
  { name: "Sat", reservations: 90 },
  { name: "Sun", reservations: 70 },
];

const customerFrequencyData = [
  { name: "New Customers", value: 45, color: "#4F9CF9" },
  { name: "Returning Customers", value: 55, color: "#68D391" },
];

const revenueData = [
  { category: "Main Dish", percentage: 50, amount: "₦110,000" },
  { category: "Drinks", percentage: 22.7, amount: "₦45,000" },
  { category: "Starters", percentage: 13.6, amount: "₦35,000" },
  { category: "Desserts", percentage: 9.3, amount: "₦20,500" },
  { category: "Sides", percentage: 4.2, amount: "₦10,500" },
];

const reservationSourceData = [
  { name: "70 websites", value: 70, color: "#4F9CF9" },
  { name: "30 mobile", value: 20, color: "#68D391" },
  { name: "20 walk-in", value: 10, color: "#F6AD55" },
];

export default function DashboardPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Upcoming
          </Badge>
        );
      case "in-30-mins":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            In 30 mins
          </Badge>
        );
      case "in-1-hour":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            In 1 hour
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800 font-medium">
            3 Reservations commencing in the next 30 minutes
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-yellow-600 hover:text-yellow-700"
        >
          ×
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back, Joseph!
          </h1>
          <p className="text-gray-600">Here's what is happening today.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">
                  Reservations made today
                </div>
                <div className="text-2xl font-bold text-gray-900">32</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  12% vs last week
                </div>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">
                  Prepaid Reservations
                </div>
                <div className="text-2xl font-bold text-gray-900">16</div>
                <div className="text-sm text-red-600 flex items-center mt-1">
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                  8% vs last week
                </div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">
                  Expected Guests Today
                </div>
                <div className="text-2xl font-bold text-gray-900">80</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  8% vs last week
                </div>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Pending Payments</div>
                <div className="text-2xl font-bold text-gray-900">
                  ₦2,546.00
                </div>
                <div className="text-sm text-red-600 flex items-center mt-1">
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                  6% vs last week
                </div>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Reservations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Reservation</CardTitle>
            <Button variant="ghost" size="sm" className="text-teal-600">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {reservation.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {reservation.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.customer.id}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{reservation.date}</div>
                    <div className="text-sm text-gray-500">
                      Time: {reservation.time}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{reservation.guests}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">Yes</span>
                  </div>
                  <div>{getStatusBadge(reservation.status)}</div>
                  <Button variant="ghost" size="sm" className="text-teal-600">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-500 mt-4">
              Showing 1 of 5
            </div>
          </CardContent>
        </Card>

        {/* Reservations Trends */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reservations Trends</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Weekly
                  <MoreHorizontal className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Weekly</DropdownMenuItem>
                <DropdownMenuItem>Monthly</DropdownMenuItem>
                <DropdownMenuItem>Yearly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-2xl font-bold">104</div>
              <div className="text-sm text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                7.1% vs last week
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar
                  dataKey="reservations"
                  fill="#4F9CF9"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Frequency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customer Frequency</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Weekly
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Weekly</DropdownMenuItem>
                <DropdownMenuItem>Monthly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width={150} height={150}>
                <PieChart>
                  <Pie
                    data={customerFrequencyData}
                    cx={75}
                    cy={75}
                    innerRadius={30}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {customerFrequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">New Customers</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Returning Customers</span>
                </div>
                <span className="text-sm font-medium">55%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue (Menu Category) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue (Menu Category)</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Weekly
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Weekly</DropdownMenuItem>
                <DropdownMenuItem>Monthly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-2xl font-bold">#220,500</div>
              <div className="text-sm text-green-600">This week week</div>
            </div>
            <div className="space-y-3">
              {revenueData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span className="font-medium">
                      {item.percentage}% ({item.amount})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reservation Source */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reservation Source</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Weekly
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Weekly</DropdownMenuItem>
                <DropdownMenuItem>Monthly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width={150} height={150}>
                <PieChart>
                  <Pie
                    data={reservationSourceData}
                    cx={75}
                    cy={75}
                    innerRadius={30}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {reservationSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">70 websites</span>
                </div>
                <span className="text-sm font-medium">70%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">30 mobile</span>
                </div>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">20 walk-in</span>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
