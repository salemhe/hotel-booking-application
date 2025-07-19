"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  MapPin,
  Star,
  Clock,
  Grid3X3,
  List,
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
import { useRouter } from "next/navigation";

interface Branch {
  id: string;
  name: string;
  location: string;
  reservationsToday: number;
  todaysRevenue: number;
  seatsFilledToday: number;
  averageRating: number;
  status: "opened" | "closed";
}

const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Josh Chicken & Grill - Ikeja",
    location: "Ikeja",
    reservationsToday: 28,
    todaysRevenue: 120000,
    seatsFilledToday: 24,
    averageRating: 4.8,
    status: "opened",
  },
  {
    id: "2",
    name: "Josh Chicken & Grill - Ikorudu",
    location: "Ikorudu",
    reservationsToday: 28,
    todaysRevenue: 120000,
    seatsFilledToday: 52,
    averageRating: 4.8,
    status: "closed",
  },
  {
    id: "3",
    name: "Josh Chicken & Grill - Ketu",
    location: "Ketu",
    reservationsToday: 28,
    todaysRevenue: 120000,
    seatsFilledToday: 36,
    averageRating: 4.8,
    status: "opened",
  },
  {
    id: "4",
    name: "Josh Chicken & Grill - Surulere",
    location: "Surulere",
    reservationsToday: 28,
    todaysRevenue: 120000,
    seatsFilledToday: 24,
    averageRating: 4.8,
    status: "opened",
  },
];

export default function BranchesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filteredBranches = mockBranches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "all" ||
      (() => {
        switch (selectedTab) {
          case "active":
            return branch.status === "opened";
          case "inactive":
            return branch.status === "closed";
          default:
            return true;
        }
      })();

    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "opened":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Opened
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Closed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const BranchCard = ({ branch }: { branch: Branch }) => {
    return (
      <Card className="relative">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Branch
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Branch
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Branch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  branch.status === "opened" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full ${
                    branch.status === "opened" ? "bg-green-600" : "bg-red-600"
                  }`}
                ></div>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm font-medium ${
                    branch.status === "opened"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getStatusBadge(branch.status)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">{branch.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Today's Reservation</div>
                <div className="font-semibold">{branch.reservationsToday}</div>
              </div>
              <div>
                <div className="text-gray-600">Today's Revenue</div>
                <div className="font-semibold">
                  ₦{branch.todaysRevenue.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Seats Filled Today</div>
                <div className="font-semibold">
                  {branch.seatsFilledToday} guests seated
                </div>
              </div>
              <div>
                <div className="text-gray-600">Average Rating</div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{branch.averageRating}</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              className="text-teal-600 hover:text-teal-700 p-0"
            >
              View Branch
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BranchTableRow = ({ branch }: { branch: Branch }) => {
    return (
      <TableRow>
        <TableCell>
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                branch.status === "opened" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  branch.status === "opened" ? "bg-green-600" : "bg-red-600"
                }`}
              ></div>
            </div>
            <div className="font-medium">{branch.name}</div>
          </div>
        </TableCell>
        <TableCell>{branch.location}</TableCell>
        <TableCell>{branch.reservationsToday}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{branch.averageRating}</span>
          </div>
        </TableCell>
        <TableCell>{getStatusBadge(branch.status)}</TableCell>
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
                View Branch
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Branch
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Branch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Restaurant 1 - HQ</span>
            <span className="text-gray-400">•</span>
            <span>2</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Branches</h1>
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
            onClick={() => router.push("/vendorDashboard/branches/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Branch
          </Button>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search branches"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={
                    viewMode === "table" ? "bg-gray-900 text-white" : ""
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid" ? "bg-gray-900 text-white" : ""
                  }
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      {viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Reservations Today</TableHead>
                  <TableHead>Ratings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => (
                  <BranchTableRow key={branch.id} branch={branch} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      )}

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
