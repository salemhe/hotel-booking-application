"use client";

import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "@/app/components/sidebars/SuperAdminSidebar";
import { TrendingUp, Sun, Moon, Eye, EyeOff } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin,
  TimeScale
);

const API_URL = "https://hotel-booking-app-backend-30q1.onrender.com/api/";

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [loading, setLoading] = useState(true);
  type MonthlyRevenue = {
    period: string;
    total: number;
    hotel: number;
    restaurant: number;
  };
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);
  const [range, setRange] = useState<"7" | "30" | "90" | "all">("30");
  const [darkMode, setDarkMode] = useState(true);
  const [showPoints, setShowPoints] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/super-admin/analytics/revenue`);
        const data = await res.json();
        setMonthly(data.data.monthly || []);
      } catch (err) {
        console.error("Failed to fetch monthly revenue data:", err);
        setMonthly([]);
      }
    };
    fetchData();
  }, []);

  // Filter data by range
  const filtered = React.useMemo(() => {
    if (range === "all") return monthly;
    return monthly.slice(-parseInt(range));
  }, [monthly, range]);

  // Chart color theme
  const chartBg = darkMode ? "#0f172a" : "#fff";
  const chartText = darkMode ? "#fff" : "#222";
  const chartGrid = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  const chartData = {
    labels: filtered.map((m) => m.period),
    datasets: [
      {
        label: "Total Revenue",
        data: filtered.map((m) => m.total),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: showPoints ? 5 : 0,
        pointHoverRadius: showPoints ? 8 : 0,
        pointBackgroundColor: "#fff",
        borderWidth: 3,
      },
      {
        label: "Hotel Revenue",
        data: filtered.map((m) => m.hotel),
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: showPoints ? 5 : 0,
        pointHoverRadius: showPoints ? 8 : 0,
        pointBackgroundColor: "#fff",
        borderWidth: 3,
      },
      {
        label: "Restaurant Revenue",
        data: filtered.map((m) => m.restaurant),
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6,182,212,0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: showPoints ? 5 : 0,
        pointHoverRadius: showPoints ? 8 : 0,
        pointBackgroundColor: "#fff",
        borderWidth: 3,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: chartText,
          font: { size: 13, family: "inherit" },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode ? "#222" : "#fff",
        titleColor: chartText,
        bodyColor: chartText,
        borderColor: "#10b981",
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
        callbacks: {
          label: function (context: import("chart.js").TooltipItem<"line">) {
            return `${
              context.dataset.label
            }: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
        limits: {
          x: { min: 0, max: filtered.length - 1 },
        },
      },
    },
    elements: {
      line: { borderWidth: 3, tension: 0.5 },
      point: {
        radius: showPoints ? 5 : 0,
        hoverRadius: showPoints ? 8 : 0,
        backgroundColor: "#fff",
        borderWidth: 2,
      },
    },
    scales: {
      x: {
        ticks: { color: chartText },
        grid: { color: chartGrid },
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 relative">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`z-50 fixed md:static inset-y-0 left-0 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-4/5 max-w-xs md:w-64 bg-slate-900 md:bg-transparent h-full md:h-auto flex flex-col`}
        style={{ color: "white" }}
      >
        <SuperAdminSidebar />
      </div>
      {/* Main Content */}
      <main className="flex-1 px-2 sm:px-4 md:px-8 lg:px-10 max-w-7xl mx-auto text-white overflow-y-visible relative">
        {/* Collapse Button */}
        <button
          className="fixed top-3 left-3 z-50 md:hidden bg-slate-800 text-white p-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          style={{ minWidth: 44, minHeight: 44 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
        <div className="flex flex-col gap-4 w-full max-w-full mt-16 md:mt-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold flex items-center gap-2">
              <TrendingUp className="h-7 w-7 text-emerald-400" /> Reports &
              Analytics
            </h1>
            <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:gap-2 flex-wrap w-full xs:w-auto">
              <div className="flex gap-2 items-center w-full xs:w-auto">
                <label htmlFor="range" className="text-xs sm:text-sm">
                  Range:
                </label>
                <select
                  id="range"
                  value={range}
                  onChange={(e) =>
                    setRange(e.target.value as "7" | "30" | "90" | "all")
                  }
                  className="rounded bg-slate-800 text-white px-2 py-1 text-xs sm:text-sm border border-slate-700 w-full xs:w-auto"
                >
                  <option value="7">Last 7</option>
                  <option value="30">Last 30</option>
                  <option value="90">Last 90</option>
                  <option value="all">All</option>
                </select>
              </div>
              <div className="flex gap-2 flex-wrap w-full xs:w-auto">
                <button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1 rounded shadow w-full xs:w-auto"
                  onClick={() => {
                    if (typeof window !== "undefined" && typeof document !== "undefined") {
                      const chartInstance = ChartJS.getChart("main-report-chart");
                      if (chartInstance && chartInstance.canvas) {
                        const link = document.createElement("a");
                        link.download = "analytics-report.png";
                        link.href = chartInstance.canvas.toDataURL("image/png");
                        link.click();
                      }
                    }
                  }}
                >
                  Download Chart
                </button>
                <button
                  className="bg-slate-700 hover:bg-slate-800 text-white text-xs px-3 py-1 rounded shadow w-full xs:w-auto"
                  onClick={() => {
                    const chart = ChartJS.getChart("main-report-chart");
                    if (chart) {
                      chart.resetZoom();
                    }
                  }}
                >
                  Reset Zoom
                </button>
                <button
                  className="bg-slate-700 hover:bg-slate-800 text-white text-xs px-3 py-1 rounded shadow flex items-center gap-1 w-full xs:w-auto"
                  onClick={() => setDarkMode((d) => !d)}
                  title="Toggle dark/light mode"
                >
                  {darkMode ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}{" "}
                  {darkMode ? "Light" : "Dark"}
                </button>
                <button
                  className="bg-slate-700 hover:bg-slate-800 text-white text-xs px-3 py-1 rounded shadow flex items-center gap-1 w-full xs:w-auto"
                  onClick={() => setShowPoints((p) => !p)}
                  title="Show/hide data points"
                >
                  {showPoints ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}{" "}
                  {showPoints ? "Hide Points" : "Show Points"}
                </button>
              </div>
            </div>
          </div>
          <div className="w-full max-w-full bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-2 sm:p-4">
            <div
              className="rounded-lg p-2 sm:p-4 overflow-x-auto"
              style={{ background: chartBg }}
            >
              <div className="min-w-[350px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] h-[220px] xs:h-[260px] sm:h-[320px]">
                <Line
                  id="main-report-chart"
                  data={chartData}
                  options={chartOptions}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
            <div className="block sm:hidden text-xs text-gray-400 mt-2 text-center">
              Pinch, zoom, or swipe to explore the chart
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
