import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { delay } from "@/lib/utils";
import { CheckCircle2, CircleDollarSign, LucideChartColumnIncreasing } from "lucide-react";

async function fetchPaymentStats() {
  await delay(2000); // Simulate network delay
  return {
      totalEarnings: 12628,
    pendingPayouts: 17,
    completedPayments: 78,
  };
}

export async function PaymentStats() {
  const stats = await fetchPaymentStats();

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Earnings
          </CardTitle>
          <CircleDollarSign className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            ₦{stats.totalEarnings.toLocaleString()}
          </div>
          <p className="text-xs text-green-500">+15% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">
            Pending Payouts
          </CardTitle>
          <LucideChartColumnIncreasing className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {stats.pendingPayouts}
          </div>
          <p className="text-xs text-green-500">+10% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">
            Completed Payments
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {stats.completedPayments}
          </div>
          <p className="text-xs text-green-500">+20.1% from yesterday</p>
        </CardContent>
      </Card>
    </div>
  );
}
