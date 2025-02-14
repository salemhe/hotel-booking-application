import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { delay } from "@/lib/utils"

async function fetchRecentOrders() {
  await delay(2200) // Simulate network delay
  return [
    {
      id: "1",
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      total: "₦79.00",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      total: "₦45.50",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      total: "₦92.25",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "William Kim",
      email: "will.kim@email.com",
      total: "₦63.75",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]
}

export async function RecentOrders() {
  const recentOrders = await fetchRecentOrders()

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-600">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={order.avatar} alt="Avatar" />
                <AvatarFallback>{order.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{order.name}</p>
                <p className="text-sm text-gray-500">{order.email}</p>
              </div>
              <div className="ml-auto font-medium text-green-500">{order.total}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

