import React, { useEffect, useRef } from "react";
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

// Register Chart.js components only on client side
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

type MonthlyRevenue = {
  period: string;
  total: number;
  hotel: number;
  restaurant: number;
};

interface ChartComponentProps {
  data: MonthlyRevenue[];
  darkMode: boolean;
  showPoints: boolean;
  chartBg: string;
  chartText: string;
  chartGrid: string;
}

export default function ChartComponent({
  data,
  darkMode,
  showPoints,
//   chartBg,
  chartText,
  chartGrid,
}: ChartComponentProps) {
  const chartRef = useRef<ChartJS<"line">>(null);

  useEffect(() => {
    const handleDownload = () => {
      if (chartRef.current && chartRef.current.canvas) {
        const link = document.createElement("a");
        link.download = "analytics-report.png";
        link.href = chartRef.current.canvas.toDataURL("image/png");
        link.click();
      }
    };

    const handleResetZoom = () => {
      if (chartRef.current) {
        chartRef.current.resetZoom();
      }
    };

    window.addEventListener('downloadChart', handleDownload);
    window.addEventListener('resetZoom', handleResetZoom);

    return () => {
      window.removeEventListener('downloadChart', handleDownload);
      window.removeEventListener('resetZoom', handleResetZoom);
    };
  }, []);

  const chartData = {
    labels: data.map((m) => m.period),
    datasets: [
      {
        label: "Total Revenue",
        data: data.map((m) => m.total),
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
        data: data.map((m) => m.hotel),
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
        data: data.map((m) => m.restaurant),
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
          x: { min: 0, max: data.length - 1 },
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
      y: {
        ticks: { color: chartText },
        grid: { color: chartGrid },
      },
    },
  };

  return (
    <div className="min-w-[350px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] h-[220px] xs:h-[260px] sm:h-[320px]">
      <Line
        ref={chartRef}
        data={chartData}
        options={chartOptions}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}