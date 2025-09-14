
import { delay } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"


async function fetchDashboardStats() {
  await delay(2000) // Simulate network delay
  return {
    totalMenuItems: 142,
    dailyOrders: 78,
    totalProfit: 12628,
    activeTables: 18,
  }
}

export async function DashboardStats() {
  const stats = await fetchDashboardStats()

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">Total Menu Items</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-500"
          >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.totalMenuItems}</div>
          <p className="text-xs text-green-500">+10% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">Daily Orders</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-500"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.dailyOrders}</div>
          <p className="text-xs text-green-500">+20.1% from yesterday</p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">Total Profit</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-500"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">₦{stats.totalProfit.toLocaleString()}</div>
          <p className="text-xs text-green-500">+15% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-600">Active Tables</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-500"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.activeTables}</div>
          <p className="text-xs text-green-500">+2 from last hour</p>
        </CardContent>
      </Card>
    </div>
  )
}

