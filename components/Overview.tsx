"use client"; // Ensures rendering happens on the client side

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { delay } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useState } from "react";

async function fetchOverviewData() {
  await delay(2000); // Simulate network delay
  return [
    { day: "Mon", total: 68 },
    { day: "Tue", total: 75 },
    { day: "Wed", total: 82 },
    { day: "Thu", total: 78 },
    { day: "Fri", total: 95 },
    { day: "Sat", total: 112 },
    { day: "Sun", total: 103 },
  ];
}

const chartConfig = {
  total: {
    label: "Total",
    color: "#22c55e",
  },
} satisfies ChartConfig;

export function Overview() {
  const [data, setData] = useState<{ day: string; total: number }[]>([]);

  useEffect(() => {
    async function loadData() {
      const fetchedData = await fetchOverviewData();
      setData(fetchedData);
    }
    loadData();
  }, []);

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-600">
          Orders Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[80%]">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill={chartConfig.total.color} radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
