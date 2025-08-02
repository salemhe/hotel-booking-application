"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/app/lib/api/services/auth.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, CreditCard, Calendar } from "lucide-react";


export default function HotelDashboard() {
  // Types
  interface Overview {
    totalBookings?: number;
    totalPayments?: number;
    totalBranches?: number;
    totalStaff?: number;
  }
  interface Booking {
    id: string;
    guest: string;
    branch: string;
    date: string;
    status: string;
  }
  interface Payment {
    id: string;
    payer: string;
    branch: string;
    amount: number;
    status: string;
    date: string;
  }
  interface Branch {
    id: string;
    name: string;
    location: string;
    status: string;
  }
  interface Staff {
    id: string;
    name: string;
    role: string;
    branch: string;
    status: string;
  }
  // Real-time state
  const [overview, setOverview] = useState<Overview>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  // const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchAll();
    fetchProfile();
  }, []);
  const fetchAll = async () => {
    try {
      const [overviewRes, bookingsRes, paymentsRes, branchesRes, staffRes] = await Promise.all([
        fetch("/api/vendor/hotel-dashboard/overview").then(r => r.json()),
        fetch("/api/vendor/hotel-bookings/recent").then(r => r.json()),
        fetch("/api/vendor/hotel-payments/recent").then(r => r.json()),
        fetch("/api/vendor/hotel-branches").then(r => r.json()),
        fetch("/api/vendor/hotel-staff").then(r => r.json()),
      ]);
      setOverview(overviewRes);
      setBookings(bookingsRes);
      setPayments(paymentsRes);
      setBranches(branchesRes);
      setStaff(staffRes);
    } catch {}
  };

  const fetchProfile = async () => {
    try {
      const { AuthService } = await import("@/app/lib/api/services/auth.service");
      const user = AuthService.getUser();
      if (user && user.id) {
        const realProfile = await AuthService.fetchMyProfile(user.id);
        // if (realProfile) setProfile(realProfile);
      }
    } catch {
      // setProfile(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Hotel Dashboard Overview</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalBookings ?? bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CreditCard className="w-6 h-6 text-green-500" />
            <CardTitle>Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalPayments ?? payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-500" />
            <CardTitle>Total Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalBranches ?? branches.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="w-6 h-6 text-orange-500" />
            <CardTitle>Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalStaff ?? staff.length}</div>
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
                <TableRow key={String(p.id)}>
                  <TableCell>{String(p.payer)}</TableCell>
                  <TableCell>{String(p.branch)}</TableCell>
                  <TableCell>₦{Number(p.amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={String(p.status) === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{String(p.status)}</Badge>
                  </TableCell>
                  <TableCell>{String(p.date)}</TableCell>
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
                <TableRow key={String(br.id)}>
                  <TableCell>{String(br.name)}</TableCell>
                  <TableCell>{String(br.location)}</TableCell>
                  <TableCell>
                    <Badge className={String(br.status) === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{String(br.status)}</Badge>
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
                <TableRow key={String(s.id)}>
                  <TableCell>{String(s.name)}</TableCell>
                  <TableCell>{String(s.role)}</TableCell>
                  <TableCell>{String(s.branch)}</TableCell>
                  <TableCell>
                    <Badge className={String(s.status) === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{String(s.status)}</Badge>
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
