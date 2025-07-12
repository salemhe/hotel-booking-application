"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removed unused Badge import

const API_URL = "https://hotel-booking-app-backend-30q1.onrender.com/api";

export default function VendorDashboard({ vendorId, vendorType }: { vendorId: string; vendorType: string }) {
  const [vendor, setVendor] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Array<Record<string, unknown>>>([]);
  const [stats, setStats] = useState<Record<string, unknown>>({});
  const [chartData, setChartData] = useState<Array<{ month: string; revenue: number }>>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch vendor details
        const vendorRes = await axios.get(`${API_URL}/super-admin/analytics/vendor/${vendorId}?vendorType=${vendorType}`);
        setVendor(vendorRes.data.data);
        // Fetch reservations for this vendor
        const reservationsRes = await axios.get(`${API_URL}/vendor/${vendorId}/reservations`);
        setReservations(reservationsRes.data.data || []);
        // Fetch stats (if available)
        setStats({
          totalRevenue: vendorRes.data.data.totalRevenue,
          totalBookings: vendorRes.data.data.totalBookings,
          activeBookings: vendorRes.data.data.activeBookings,
          monthlyAverage: vendorRes.data.data.monthlyAverage,
          platformFee: vendorRes.data.data.platformFee,
        });
        // Fetch chart data (if available)
        setChartData(vendorRes.data.data.monthlyRevenue || []);
      } catch {
        setVendor(null);
        setReservations([]);
        setStats({});
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // Optionally, poll every 30 seconds for live updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [vendorId, vendorType]);

  const SimpleChart = ({ data }: { data: typeof chartData }) => (
    <div className="flex items-end justify-between h-32 gap-1">
      {data.map((item, index) => (
        <div key={item.month} className="flex flex-col items-center gap-1">
          <div
            className={`w-8 rounded-t ${
              index % 3 === 0
                ? "bg-blue-500"
                : index % 3 === 1
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
            style={{ height: `${(item.revenue / Math.max(...data.map(d => d.revenue), 1)) * 100}%` }}
          />
          <span className="text-xs text-gray-600">{item.month}</span>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <svg className="animate-spin h-10 w-10 text-teal-600" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Vendor not found</h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for vendor navigation - teal background, improved layout */}
      <aside className="w-64 bg-teal-800 text-white flex flex-col">
        <div className="p-6 border-b border-teal-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-800 font-bold text-lg">V</span>
          </div>
          <span className="font-semibold text-xl">Vendor Panel</span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors bg-teal-700 text-white font-semibold">
                <Calendar className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-teal-700 hover:text-white text-teal-100">
                <Users className="w-5 h-5" />
                <span>Reservations</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-teal-700 hover:text-white text-teal-100">
                <DollarSign className="w-5 h-5" />
                <span>Financials</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {typeof vendor.name === "string" ? vendor.name : ""}</h1>
              <p className="text-gray-600">Here is your current performance overview.</p>
            </div>
          </div>
        </header>
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">${typeof stats.totalRevenue === "number" ? stats.totalRevenue.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold">{stats.totalBookings || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
                    <p className="text-2xl font-bold">{stats.activeBookings || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Average</p>
                    <p className="text-2xl font-bold">${typeof stats.monthlyAverage === "number" ? stats.monthlyAverage.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Trends Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleChart data={chartData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Active: {stats.activeBookings || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    <span>Completed: {stats.totalBookings - stats.activeBookings || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Reservations Table */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">{typeof reservation.name === "string" ? reservation.name : ""}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{typeof reservation.date === "string" ? reservation.date : ""} {typeof reservation.time === "string" ? reservation.time : ""}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{typeof reservation.guests === "number" ? reservation.guests : ""}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{typeof reservation.status === "string" ? reservation.status : ""}</td>
                    </tr>
                  ))}
                  {!reservations.length && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">No reservations found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
