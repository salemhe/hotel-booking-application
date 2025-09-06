"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/sammys-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/sammys-ui/table";
import { Badge } from "@/app/components/sammys-ui/badge";
import { Users, MapPin, CreditCard, Calendar } from "lucide-react";
import { BookingService } from "@/app/lib/api/services/bookings.service";
import { DashboardService } from "@/app/lib/api/services/dashboard.service";
import { ProfileProvider, useProfile } from "../ProfileContext";
// import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function SuperAdminDashboard() {
  return (
    <ProfileProvider>
      <SuperAdminDashboardContent />
    </ProfileProvider>
  );
}

function SuperAdminDashboardContent() {
  const { profile } = useProfile();
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [branches, setBranches] = useState<Record<string, unknown>[]>([]);
  const [staff, setStaff] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  // const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Authentication handled by layout.tsx - no need for additional checks here

  // Data fetching
  useEffect(() => {
    if (!user || user.role !== "super-admin") return;
    async function fetchData() {
      setLoading(true);
      try {
        // TypeScript knows user is not null here due to the guard above
        const bookingsData = await BookingService.getBookings({ vendorId: user!.id });
        setBookings(bookingsData || []);
        const [paymentsData, branchesData, staffData] = await Promise.all([
          DashboardService.getPayments(user!.id),
          DashboardService.getBranches(user!.id),
          DashboardService.getStaff(user!.id),
        ]);
        setPayments(paymentsData || []);
        setBranches(branchesData || []);
        setStaff(staffData || []);
      } catch {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (authLoading || !isAuthenticated || !user || user.role !== "super-admin" || loading) {
    return <div className="w-full max-w-7xl mx-auto py-8 px-2 sm:px-4 md:px-6 lg:px-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Super Admin Dashboard Overview</h1>
      {profile && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Welcome, {profile.businessName} ({profile.email})</h2>
          <div className="text-gray-700">Business Type: {profile.businessType}</div>
          <div className="text-gray-700">Address: {profile.address}</div>
          <div className="text-gray-700">Phone: {profile.phone}</div>
        </div>
      )}
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
                <TableRow key={String(b._id)}>
                  <TableCell>{String(b.user)}</TableCell>
                  <TableCell>{String(b.vendor)}</TableCell>
                  <TableCell>{b.bookingDate ? new Date(b.bookingDate as string).toLocaleDateString() : ''}</TableCell>
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
                  <TableCell>{p.date ? new Date(p.date as string).toLocaleDateString() : ''}</TableCell>
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
