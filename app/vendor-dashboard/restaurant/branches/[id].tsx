"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Bell, Search, ChevronDown, Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";

interface Branch {
  id: string;
  branchName: string;
  active?: boolean;
  reservationsToday?: number;
  repeatReservations?: number;
  confirmedGuestsToday?: number;
  totalRevenue?: number;
  revenueMenuCategory?: string;
  menuCategoryData?: { category: string; percentage: string; amount: string }[];
}
interface Reservation {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}

export default function BranchDetailPage() {
  const params = useParams();
  const branchId = params?.id as string;

  const [branch, setBranch] = useState<Branch | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBranchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const branchRes = await fetch(`/api/branches/${branchId}`);
        if (!branchRes.ok) throw new Error("Failed to fetch branch details");
        const branchData = await branchRes.json();
        setBranch(branchData);

        const resRes = await fetch(`/api/branches/${branchId}/reservations`);
        if (!resRes.ok) throw new Error("Failed to fetch reservations");
        const reservationsData = await resRes.json();
        setReservations(reservationsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "An error occurred");
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    if (branchId) fetchBranchDetails();
  }, [branchId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Branch Home page</h1>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search..." className="pl-10 w-full sm:w-64 bg-gray-50 border-gray-200" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{branch?.branchName || "Branch"}</span>
              <div className={`w-2 h-2 rounded-full ${branch?.active ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-xs text-gray-500">{branch?.active ? "Online" : "Offline"}</span>
            </div>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <span className="text-sm">Restaurant | HQ</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Switch Branch</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">JD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">John Doe</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Add Branch Info</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading branch details...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Reservations Made Today</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{branch?.reservationsToday ?? 0}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />↑ 25% vs last week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Repeat Reservations</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{branch?.repeatReservations ?? 0}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />↑ 8% vs last week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Confirmed Guests Today</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{branch?.confirmedGuestsToday ?? 0}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />↑ 8% vs last week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">${branch?.totalRevenue?.toLocaleString() ?? '0.00'}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />↑ 6.2% vs last week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Reservations and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Reservations */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Today&apos;s Reservations</CardTitle>
                  <Button variant="ghost" size="sm" className="text-teal-600">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Date &amp; Time</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((reservation, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gray-200">{reservation.name?.[0] || "G"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{reservation.name}</div>
                                <div className="text-sm text-gray-500">{reservation.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{reservation.date}</div>
                              <div className="text-sm text-gray-500">{reservation.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>{reservation.guests} Guests</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                reservation.status === "Upcoming"
                                  ? "secondary"
                                  : reservation.status === "Confirmed"
                                  ? "default"
                                  : undefined
                              }
                              className={
                                reservation.status === "Upcoming"
                                  ? "bg-blue-100 text-blue-800"
                                  : reservation.status === "Confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {reservation.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Reservations Trends */}
              {/* You can implement a real chart here if you have chart data from backend */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Reservations Trends</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-teal-600">
                      View All
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Weekly <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Daily</DropdownMenuItem>
                        <DropdownMenuItem>Weekly</DropdownMenuItem>
                        <DropdownMenuItem>Monthly</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-400 py-12">(Chart coming soon)</div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Frequency */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Customer Frequency</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Weekly <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Daily</DropdownMenuItem>
                      <DropdownMenuItem>Weekly</DropdownMenuItem>
                      <DropdownMenuItem>Monthly</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#14b8a6" strokeWidth="3" strokeDasharray="60, 40" />
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
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Weekly <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Daily</DropdownMenuItem>
                      <DropdownMenuItem>Weekly</DropdownMenuItem>
                      <DropdownMenuItem>Monthly</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold">#{branch?.revenueMenuCategory ?? '0'}</div>
                    <div className="text-sm text-gray-500">↑ 8.1% vs last week</div>
                  </div>
                  <div className="space-y-3">
                    {(branch?.menuCategoryData || []).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{item.percentage}</span>
                          <span className="text-xs text-gray-500">{item.amount}</span>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Weekly <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Daily</DropdownMenuItem>
                      <DropdownMenuItem>Weekly</DropdownMenuItem>
                      <DropdownMenuItem>Monthly</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#14b8a6" strokeWidth="3" strokeDasharray="50, 100" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="30, 100" strokeDashoffset="-50" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="20, 100" strokeDashoffset="-80" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">100</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                        <span className="text-sm">Website</span>
                      </div>
                      <span className="text-sm font-medium">50%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Social Media</span>
                      </div>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm">Walk-in</span>
                      </div>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
