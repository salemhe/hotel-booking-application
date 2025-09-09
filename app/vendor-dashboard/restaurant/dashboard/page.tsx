"use client";

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend
} from 'chart.js';

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/sammys-ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useVendorDashboardSocket } from '@/app/hooks/useVendorDashboardSocket';
import { API_URL } from '@/app/config';
import DashboardLoader from '@/app/components/DashboardLoader';

export default function Dashboard() {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || API_URL;
  const { dashboardData, loading } = useVendorDashboardSocket(API_URL, socketUrl);

  console.log("Dashboard Data:", dashboardData);

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

  // CHARTS STYLE
  const data = {
    labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Walk-in",
        data: dashboardData?.reservationTrends?.walkIn || [],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Reservations Trends',
      },
    },
  };

  const chartData = [
    { name: 'New', value: dashboardData?.customerFrequency?.new || 0, color: '#0088FE' },
    { name: 'Returning', value: dashboardData?.customerFrequency?.returning || 0, color: '#00C49F' },
  ];

  const totalRevenue = dashboardData?.revenueByCategory?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0;

  const revenueColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const ReservationChartData = [
    { name: 'Website', value: dashboardData?.reservationSource?.website || 0, color: '#0088FE' },
    { name: 'Mobile', value: dashboardData?.reservationSource?.mobile || 0, color: '#00C49F' },
    { name: 'Walk-in', value: dashboardData?.reservationSource?.walkIn || 0, color: '#FFBB28' },
  ];

  return (
    <div className="flex-1 min-w-[300px] h-[348px] rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden">
      {/* bar chart */}
      <div className="h-[220px] px-5">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
