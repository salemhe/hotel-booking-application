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
];

export default function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showTabs, setShowTabs] = useState(false);

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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Reservations</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Reservation
          </Button>
        </div>
      </div>

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

              <Button variant="outline" onClick={() => setShowTabs(!showTabs)}>
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      {showTabs && (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="no-shows">No shows</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

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
}
