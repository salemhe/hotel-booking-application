"use client";
import { ArrowUpRightFromSquare, EyeClosed } from "lucide-react";
import React, { useState } from "react";
import { FaMoneyBill } from "react-icons/fa6";

const Page = () => {
  const [tab, setTab] = useState<"Vendor's Earnings" | "Payout History">(
    "Vendor's Earnings"
  );
  const tabs: Array<"Vendor's Earnings" | "Payout History"> = [
    "Vendor's Earnings",
    "Payout History",
  ];

  const rightNav =
    tab === "Vendor's Earnings"
      ? [
          {
            icon: <EyeClosed className="text-[#606368]" />,
            title: "Hide Charts",
            variance: "white",
            onclick: () => {},
          },
          {
            icon: <ArrowUpRightFromSquare />,
            title: "Export",
            variance: "white",
            onclick: () => {},
          },
          {
            icon: <FaMoneyBill />,
            title: "Initiate Payout",
            variance: "green",
            onclick: () => {},
          },
        ]
      : [
          {
            icon: <EyeClosed className="text-[#606368]" />,
            title: "Hide Charts",
            variance: "white",
            onclick: () => {},
          },
          {
            icon: <ArrowUpRightFromSquare />,
            title: "Export",
            variance: "white",
            onclick: () => {},
          },
        ];

  return (
    <div className="space-y-6 w-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
        <div className="flex items-center gap-2 p-1 border border-[#E7F0F0] bg-white rounded-xl">
          {tabs.map((item, i) => (
            <button
              key={i}
              onClick={() => setTab(item)}
              className={`${
                item === tab
                  ? "border-[#B3D1D2] bg-[#E7F0F0] text-[#111827]"
                  : "border-transparent bg-transparent text-[#606368]"
              } border p-2 font-medium text-sm rounded-sm cursor-pointer`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex w-full md:w-auto flex-col md:flex-row items-center gap-6">
          {rightNav.map((item, i) => (
            <button
              key={i}
              onClick={item.onclick}
              className={`flex items-center gap-2 py-2.5 px-3 border rounded-xl text-sm font-medium cursor-pointer ${
                item.variance === "white"
                  ? "text-[#111827] border-[#E5E7EB] bg-white"
                  : "text-white border-[#0A6C6D] bg-[#0A6C6D]"
              }`}
            >
              {item.icon}
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Row */}
        <DashboardCard
          title="Completed Payments"
          value="₦372,556.00"
          stat="6% vs last week"
          trend="up"
        />
        <DashboardCard
          title="Completed Payments"
          value="₦372,556.00"
          stat="6% vs last week"
          trend="up"
        />
        <DashboardCard
          title="Completed Payments"
          value="₦372,556.00"
          stat="6% vs last week"
          trend="up"
        />
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  stat: string;
  trend: "up" | "down";
  large?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  stat,
  trend,
  large = false,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <h2 className="text-gray-500 text-sm font-medium mb-2">{title}</h2>
      <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        {value}
      </p>
      <div className="flex items-center">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            trend === "up"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {trend === "up" ? (
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {stat}
        </span>
      </div>
    </div>
  );
};

export default Page;
