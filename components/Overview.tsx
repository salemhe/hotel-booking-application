import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { delay } from "@/lib/utils";
import Chart from "./chart";

async function fetchOverviewData() {
  await delay(2000); // Simulate network delay
  return [
    { day: "Mon", total: 68 },
    { day: "Tue", total: 75 },
    { day: "Wed", total: 82 },
    { day: "Thu", total: 78 },
    { day: "Fri", total: 95 },
    { day: "Sat", total: 0 },
    { day: "Sun", total: 0 },
  ];
}

export async function Overview() {
  const data = await fetchOverviewData()


  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-600">
          Orders Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Chart data={data} />
      </CardContent>
    </Card>
  );
}
