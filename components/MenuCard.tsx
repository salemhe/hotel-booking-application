import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MenuItem {
  name: string;
  price: number;
  discountPrice?: number; // Optional discounted price
}

interface MenuCardProps {
  menuItems: MenuItem[]; // Array of menu items
  isLoading?: boolean;
}

export default function MenuCard({ menuItems, isLoading }: MenuCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Your Menu</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
        ) : menuItems.length > 0 ? (
          <ul className="space-y-3">
            {menuItems.slice(0, 5).map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.name}</span>
                <div className="text-right">
                  {item.discountPrice && item.discountPrice < item.price ? (
                    <div>
                      <span className="text-sm text-gray-500 line-through">${item.price.toFixed(2)}</span>
                      <span className="text-red-600 font-semibold ml-2">${item.discountPrice.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
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
  );
}
