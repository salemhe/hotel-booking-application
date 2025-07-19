"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Download,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowLeft,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { useRouter } from "next/navigation";

interface Reservation {
  id: string;
  customer: {
    name: string;
    image?: string;
    id: string;
  };
  date: string;
  time: string;
  guests: number;
  mealPreselected: boolean;
  paymentStatus: "paid" | "pay-at-restaurant";
  reservationStatus:
    | "upcoming"
    | "in-30-mins"
    | "in-1-hour"
    | "completed"
    | "cancelled";
}

const mockReservations: Reservation[] = [
  {
    id: "RES12345",
    customer: { name: "Emily Johnson", id: "#12345" },
    date: "June 5, 2025",
    time: "7:30 pm",
    guests: 4,
    mealPreselected: true,
    paymentStatus: "paid",
    reservationStatus: "upcoming",
  },
  {
    id: "RES12346",
    customer: { name: "Emily Johnson", id: "#12346" },
    date: "June 5, 2025",
    time: "8:00 pm",
    guests: 3,
    mealPreselected: false,
    paymentStatus: "pay-at-restaurant",
    reservationStatus: "upcoming",
  },
  {
    id: "RES12347",
    customer: { name: "Emily Johnson", id: "#12347" },
    date: "June 5, 2025",
    time: "6:30 pm",
    guests: 2,
    mealPreselected: true,
    paymentStatus: "pay-at-restaurant",
    reservationStatus: "in-30-mins",
  },
  {
    id: "RES12348",
    customer: { name: "Emily Johnson", id: "#12348" },
    date: "June 5, 2025",
    time: "7:00 pm",
    guests: 1,
    mealPreselected: false,
    paymentStatus: "pay-at-restaurant",
    reservationStatus: "in-30-mins",
  },
  {
    id: "RES12349",
    customer: { name: "Emily Johnson", id: "#12349" },
    date: "June 5, 2025",
    time: "8:30 pm",
    guests: 1,
    mealPreselected: false,
    paymentStatus: "pay-at-restaurant",
    reservationStatus: "in-30-mins",
  },
  {
    id: "RES12350",
    customer: { name: "Emily Johnson", id: "#12350" },
    date: "June 5, 2025",
    time: "7:30 pm",
    guests: 2,
    mealPreselected: true,
    paymentStatus: "paid",
    reservationStatus: "in-1-hour",
  },
];

export default function ReservationsDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentView, setCurrentView] = useState<
    "dashboard" | "all-reservations"
  >("dashboard");
  const [showAlert, setShowAlert] = useState(true);

  const filteredReservations = mockReservations.filter((reservation) => {
    const matchesSearch =
      reservation.customer.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "all" ||
      (() => {
        switch (selectedTab) {
          case "upcoming":
            return reservation.reservationStatus === "upcoming";
          case "completed":
            return reservation.reservationStatus === "completed";
          case "cancelled":
            return reservation.reservationStatus === "cancelled";
          default:
            return true;
        }
      })();

    return matchesSearch && matchesTab;
  });

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
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Paid
          </Badge>
        );
      case "pay-at-restaurant":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Pay at Restaurant
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back, Joseph!
          </h1>
          <p className="text-gray-600">Here's what is happening today.</p>
        </div>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white"
          size="sm"
          onClick={() => router.push("/vendorDashboard/reservations/new")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </Button>
      </div>

      {/* Alert */}
      {showAlert && (
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
            onClick={() => setShowAlert(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reservations made today</p>
                <p className="text-2xl font-bold">32</p>
                <p className="text-xs text-green-600">↑ 12% vs last week</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prepaid Reservations</p>
                <p className="text-2xl font-bold">16</p>
                <p className="text-xs text-green-600">↑ 8% vs last week</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expected Guests Today</p>
                <p className="text-2xl font-bold">80</p>
                <p className="text-xs text-green-600">↑ 5% vs last week</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold">₦2,546.00</p>
                <p className="text-xs text-red-600">↓ 2% vs last week</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Reservation</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("all-reservations")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReservations.slice(0, 6).map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={reservation.customer.image} />
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
                  <div className="text-center">
                    <div className="font-medium">{reservation.date}</div>
                    <div className="text-sm text-gray-500">
                      Time: {reservation.time}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">
                      {reservation.guests} Guests
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {reservation.mealPreselected ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>{getPaymentBadge(reservation.paymentStatus)}</div>
                  <div>{getStatusBadge(reservation.reservationStatus)}</div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">Showing 1 of 5</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservations Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>104</span>
                <span className="text-sm text-gray-500">9.1% vs last week</span>
              </div>

              {/* Chart placeholder */}
              <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-end justify-center space-x-1 p-4">
                {[40, 60, 45, 80, 70, 90, 85].map((height, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                    style={{ height: `${height}%`, width: "20px" }}
                  />
                ))}
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Source sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customer Frequency</CardTitle>
            <select className="text-sm border rounded px-2 py-1">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">100</div>
              </div>

              {/* Pie chart placeholder */}
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-400 via-blue-400 to-yellow-400"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold">45%</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">New Customers</span>
                  </div>
                  <span className="text-sm">55%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-500 rounded"></div>
                    <span className="text-sm">Returning Customers</span>
                  </div>
                  <span className="text-sm">45%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue (Menu Category)</CardTitle>
            <select className="text-sm border rounded px-2 py-1">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">₦220,500</div>
              <div className="text-sm text-green-600">This week, last week</div>

              <div className="space-y-3">
                {[
                  {
                    category: "Main Dish",
                    percentage: 50,
                    amount: "₦110,000",
                    color: "bg-blue-500",
                  },
                  {
                    category: "Drinks",
                    percentage: 22.7,
                    amount: "₦50,000",
                    color: "bg-red-500",
                  },
                  {
                    category: "Starters",
                    percentage: 13.6,
                    amount: "₦30,000",
                    color: "bg-green-500",
                  },
                  {
                    category: "Desserts",
                    percentage: 9.3,
                    amount: "₦20,500",
                    color: "bg-yellow-500",
                  },
                  {
                    category: "Sides",
                    percentage: 4.7,
                    amount: "₦10,000",
                    color: "bg-purple-500",
                  },
                ].map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${item.color} rounded`}></div>
                      <span className="text-sm">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {item.percentage}%
                      </div>
                      <div className="text-xs text-gray-500">{item.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reservation Source</CardTitle>
            <select className="text-sm border rounded px-2 py-1">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold">100</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">50 websites</span>
                  </div>
                  <span className="text-sm">50%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-sm">30 mobile</span>
                  </div>
                  <span className="text-sm">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-500 rounded"></div>
                    <span className="text-sm">20 walk-in</span>
                  </div>
                  <span className="text-sm">20%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAllReservations = () => (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              All Reservations
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            size="sm"
            onClick={() => router.push("/vendorDashboard/reservations/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Reservation
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by guest name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={selectedTab}
                onChange={(e) => setSelectedTab(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[150px]"
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-shows">No shows</option>
              </select>

              <select className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[150px]">
                <option>Payment Status</option>
                <option>Paid</option>
                <option>Pay at Restaurant</option>
              </select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Customer name</TableHead>
                <TableHead className="font-semibold">Date & Time</TableHead>
                <TableHead className="font-semibold">No of Guests</TableHead>
                <TableHead className="font-semibold">
                  Meal Preselected
                </TableHead>
                <TableHead className="font-semibold">Payment Status</TableHead>
                <TableHead className="font-semibold">
                  Reservation Status
                </TableHead>
                <TableHead className="font-semibold w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reservation.customer.image} />
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
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reservation.date}</div>
                      <div className="text-sm text-gray-500">
                        Time: {reservation.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{reservation.guests}</span>
                  </TableCell>
                  <TableCell>
                    {reservation.mealPreselected ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">Yes</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-600 font-medium">No</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getPaymentBadge(reservation.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reservation.reservationStatus)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Reservation</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Cancel Reservation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Page 1 of 30</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <div className="flex space-x-1">
            {[1, 2, 3, "...", 10, 11, 12].map((page, index) => (
              <Button
                key={index}
                variant={page === 1 ? "default" : "ghost"}
                size="sm"
                className={page === 1 ? "bg-teal-600 hover:bg-teal-700" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "dashboard"
        ? renderDashboard()
        : renderAllReservations()}
    </div>
  );
}
