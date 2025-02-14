import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { delay } from "@/lib/utils"

interface MenuItem {
  name: string
  price: number
  discountPrice?: number
}

async function fetchMenuItems() {
  await delay(1800) // Simulate network delay
  return [
    { name: "Spaghetti Carbonara", price: 12.99 },
    { name: "Margherita Pizza", price: 10.99, discountPrice: 8.99 },
    { name: "Caesar Salad", price: 8.99 },
    { name: "Grilled Chicken", price: 15.99 },
    { name: "Tiramisu", price: 6.99 },
  ]
}

export async function MenuCard() {
  const menuItems = await fetchMenuItems()

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-600">Your Menu</CardTitle>
      </CardHeader>
      <CardContent>
        {menuItems.length > 0 ? (
          <ul className="space-y-3">
            {menuItems.slice(0, 5).map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.name}</span>
                <div className="text-right">
                  {item.discountPrice && item.discountPrice < item.price ? (
                    <div>
                      <span className="text-sm text-gray-500 line-through">₦{item.price.toFixed(2)}</span>
                      <span className="text-green-500 font-semibold ml-2">₦{item.discountPrice.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-900">₦{item.price.toFixed(2)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No menu items available.</p>
        )}

        <div className="mt-4 text-right">
          <Link href="/vendorDashboard/menu" className="text-blue-600 hover:underline">
            View More →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

