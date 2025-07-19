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
  Users,
  UserCheck,
  UserX,
  Clock,
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

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  dateAdded: string;
  status: "active" | "inactive";
  image?: string;
}

const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Emily Johnson",
    email: "staffname@gmail.com",
    phone: "+234701234567",
    role: "Chef",
    dateAdded: "25/6/2025",
    status: "active",
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "staffname@gmail.com",
    phone: "+234701234567",
    role: "Chef",
    dateAdded: "25/6/2025",
    status: "active",
  },
  {
    id: "3",
    name: "Emily Johnson",
    email: "staffname@gmail.com",
    phone: "+234701234567",
    role: "Chef",
    dateAdded: "25/6/2025",
    status: "active",
  },
  {
    id: "4",
    name: "Emily Johnson",
    email: "staffname@gmail.com",
    phone: "+234701234567",
    role: "Manager",
    dateAdded: "25/6/2025",
    status: "active",
  },
  {
    id: "5",
    name: "Emily Johnson",
    email: "staffname@gmail.com",
    phone: "+234701234567",
    role: "Waiter",
    dateAdded: "25/6/2025",
    status: "active",
  },
  {
    id: "6",
    name: "Emily Johnson",
    email: "staffname@gmail.com",
    phone: "+234701234567",
    role: "Waiter",
    dateAdded: "25/6/2025",
    status: "active",
  },
  {
    id: "7",
    name: "Emily Johnson",
    email: "staffname@gmail.com",
    phone: "+234701234567",
    role: "Waiter",
    dateAdded: "25/6/2025",
    status: "active",
  },
  {
    id: "8",
    name: "Emily Johnson",
    email: "staffname@gmail.com",
    phone: "+234701234567",
    role: "Waiter",
    dateAdded: "25/6/2025",
    status: "active",
  },
  {
    id: "9",
    name: "Emily Johnson",
    email: "staffname@gmail.com",
    phone: "+234701234567",
    role: "Waiter",
    dateAdded: "25/6/2025",
    status: "active",
  },
];

export default function StaffPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showTabs, setShowTabs] = useState(false);

  const totalStaff = mockStaff.length;
  const activeStaff = mockStaff.filter(
    (staff) => staff.status === "active",
  ).length;
  const inactiveStaff = mockStaff.filter(
    (staff) => staff.status === "inactive",
  ).length;
  const noShowStaff = 1; // Mock data

  const filteredStaff = mockStaff.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "all" ||
      (() => {
        switch (selectedTab) {
          case "active":
            return staff.status === "active";
          case "inactive":
            return staff.status === "inactive";
          default:
            return true;
        }
      })();

    const matchesRole =
      selectedRole === "all" ||
      staff.role.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesTab && matchesRole;
  });

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
            <h1 className="text-2xl font-bold text-gray-900">Staff List</h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTabs(!showTabs)}
          >
            Hide tabs
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            size="sm"
            onClick={() => router.push("/vendorDashboard/staff/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Staff
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalStaff}</p>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-xs text-green-600">↑ 12% vs last week</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{activeStaff}</p>
                <p className="text-sm text-gray-600">Active Staff</p>
                <p className="text-xs text-green-600">↑ 8% vs last week</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{inactiveStaff}</p>
                <p className="text-sm text-gray-600">Inactive Staff</p>
                <p className="text-xs text-red-600">↓ 8% vs last week</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserX className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{noShowStaff}</p>
                <p className="text-sm text-gray-600">No-show Staff</p>
                <p className="text-xs text-yellow-600">↑ 2% vs last week</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[150px]"
              >
                <option value="all">Filter by role</option>
                <option value="chef">Chef</option>
                <option value="manager">Manager</option>
                <option value="waiter">Waiter</option>
                <option value="cashier">Cashier</option>
              </select>

              <Button variant="outline">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Staff name</TableHead>
                <TableHead className="font-semibold">Phone number</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Date Added</TableHead>
                <TableHead className="font-semibold w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={staff.image} />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{staff.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800"
                    >
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{staff.dateAdded}</TableCell>
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
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Staff
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Staff
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
