"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { apiFetcher } from "@/app/lib/fetcher";

// Mock data for menu analytics
const MOCK_BEST_SELLING = [
  { name: "Jollof Rice & Chicken", value: 124, revenue: 186000 },
  { name: "Fried Rice & Turkey", value: 85, revenue: 127500 },
  { name: "Pasta Bolognese", value: 67, revenue: 87100 },
  { name: "Chicken Burger", value: 56, revenue: 61600 },
  { name: "Beef Suya", value: 43, revenue: 64500 },
];

const MOCK_REVENUE_BY_CATEGORY = [
  { name: "Main Dish", value: 450000 },
  { name: "Starters", value: 120000 },
  { name: "Desserts", value: 80000 },
  { name: "Beverages", value: 200000 },
  { name: "Sides", value: 90000 },
];

const MOCK_MONTHLY_SALES = [
  { name: "Jan", sales: 120000 },
  { name: "Feb", sales: 150000 },
  { name: "Mar", sales: 180000 },
  { name: "Apr", sales: 170000 },
  { name: "May", sales: 190000 },
  { name: "Jun", sales: 220000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function MenuAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [bestSelling, setBestSelling] = useState(MOCK_BEST_SELLING);
  const [revenueByCategory, setRevenueByCategory] = useState(MOCK_REVENUE_BY_CATEGORY);
  const [monthlySales, setMonthlySales] = useState(MOCK_MONTHLY_SALES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch data from your API
        // const data = await apiFetcher(`/api/vendor/menu-analytics?timeRange=${timeRange}`);
        // setBestSelling(data.bestSelling);
        // setRevenueByCategory(data.revenueByCategory);
        // setMonthlySales(data.monthlySales);
        
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate different data for different time ranges
        if (timeRange === "week") {
          setBestSelling(MOCK_BEST_SELLING.map(item => ({ ...item, value: Math.floor(item.value / 4), revenue: Math.floor(item.revenue / 4) })));
        } else if (timeRange === "year") {
          setBestSelling(MOCK_BEST_SELLING.map(item => ({ ...item, value: item.value * 12, revenue: item.revenue * 12 })));
        } else {
          setBestSelling(MOCK_BEST_SELLING);
        }
      } catch (error) {
        console.error("Failed to fetch menu analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Analytics</h1>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bestSelling} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value} orders`, 'Orders']} />
                  <Bar dataKey="value" fill="#0088FE" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Sales Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p>Loading...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Sales']} />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Item Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Item Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-right py-3 px-4">Orders</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">Avg. Rating</th>
                  <th className="text-right py-3 px-4">Profit Margin</th>
                </tr>
              </thead>
              <tbody>
                {bestSelling.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="text-right py-3 px-4">{item.value}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(item.revenue)}</td>
                    <td className="text-right py-3 px-4">4.{Math.floor(Math.random() * 10)}</td>
                    <td className="text-right py-3 px-4">{Math.floor(30 + Math.random() * 20)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}