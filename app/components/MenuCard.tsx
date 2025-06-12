// import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { delay } from "@/app/lib/utils";

async function fetchMenuItems() {
  await delay(2000); // Simulate network delay
  return [
    { name: "Jollof Rice", price: 1500, discountPrice: 1200 },
    { name: "Pasta", price: 12.5 },
    { name: "Pizza", price: 15.0, discountPrice: 12.99 },
    { name: "Salad", price: 7.99 },
    { name: "Sushi", price: 18.0, discountPrice: 14.5 },
    { name: "Salad", price: 7.99 },
    { name: "Sushi", price: 18.0, discountPrice: 14.5 },
  ];
}

export async function MenuCard() {
  const menuItems = await fetchMenuItems();

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-600">
          Your Menu
        </CardTitle>
      </CardHeader>
      <CardContent>
        {menuItems.length > 0 ? (
          <ul className="space-y-8">
            {menuItems.slice(0, 5).map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.name}</span>
                <div className="text-right">
                  {item.discountPrice && item.discountPrice < item.price ? (
                    <div>
                      <span className="text-sm text-gray-500 line-through">
                        ₦{item.price.toFixed(2)}
                      </span>
                      <span className="text-green-500 font-semibold ml-2">
                        ₦{item.discountPrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      ₦{item.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No menu items available.</p>
        )}

        {/* <div className="mt-4 text-right">
          <Link
            href="/vendorDashboard/menu"
            className="text-blue-600 hover:underline"
          >
            View More →
          </Link>
        </div> */}
      </CardContent>
    </Card>
  );
}
