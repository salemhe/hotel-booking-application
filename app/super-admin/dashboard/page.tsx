"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, CreditCard, Calendar } from "lucide-react";

export default function SuperAdminDashboard() {
  // Simulated data for demo
  const [bookings, setBookings] = useState<Array<Record<string, unknown>>>([]);
  const [payments, setPayments] = useState<Array<Record<string, unknown>>>([]);
  const [branches, setBranches] = useState<Array<Record<string, unknown>>>([]);
  const [staff, setStaff] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      setBookings([
        { id: 1, guest: "John Doe", branch: "Lagos HQ", date: "2024-06-01", status: "Upcoming" },
        { id: 2, guest: "Jane Smith", branch: "Abuja Central", date: "2024-06-02", status: "Completed" },
        { id: 3, guest: "Mike Johnson", branch: "Kano North", date: "2024-06-03", status: "Cancelled" },
      ]);
      setPayments([
        { id: 1, payer: "John Doe", branch: "Lagos HQ", amount: 50000, status: "Paid", date: "2024-06-01" },
        { id: 2, payer: "Jane Smith", branch: "Abuja Central", amount: 75000, status: "Pending", date: "2024-06-02" },
      ]);
      setBranches([
        { id: 1, name: "Lagos HQ", location: "Lagos", status: "Active" },
        { id: 2, name: "Abuja Central", location: "Abuja", status: "Active" },
        { id: 3, name: "Kano North", location: "Kano", status: "Inactive" },
      ]);
      setStaff([
        { id: 1, name: "Alice Brown", role: "Manager", branch: "Lagos HQ", status: "Active" },
        { id: 2, name: "Bob Green", role: "Receptionist", branch: "Abuja Central", status: "Active" },
        { id: 3, name: "Carol White", role: "Chef", branch: "Kano North", status: "Inactive" },
      ]);
    }, 500);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Super Admin Dashboard Overview</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CreditCard className="w-6 h-6 text-green-500" />
            <CardTitle>Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-500" />
            <CardTitle>Total Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="w-6 h-6 text-orange-500" />
            <CardTitle>Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
          </CardContent>
        </Card>
      </div>
      {/* Bookings Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Bookings/Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={String(b.id)}>
                  <TableCell>{String(b.guest)}</TableCell>
                  <TableCell>{String(b.branch)}</TableCell>
                  <TableCell>{String(b.date)}</TableCell>
                  <TableCell>
                    <Badge className={
                      b.status === "Upcoming" ? "bg-blue-100 text-blue-800" :
                      b.status === "Completed" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }>{String(b.status)}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Payments Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payer</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.payer}</TableCell>
                  <TableCell>{p.branch}</TableCell>
                  <TableCell>₦{p.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={p.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{p.status}</Badge>
                  </TableCell>
                  <TableCell>{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Branches Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Branches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((br) => (
                <TableRow key={br.id}>
                  <TableCell>{br.name}</TableCell>
                  <TableCell>{br.location}</TableCell>
                  <TableCell>
                    <Badge className={br.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{br.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>{s.branch}</TableCell>
                  <TableCell>
                    <Badge className={s.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{s.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
