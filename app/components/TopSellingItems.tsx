import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { delay } from "@/lib/utils"

async function fetchTopSellingItems() {
  await delay(2000) // Simulate network delay
  return [
    {
      id: "1",
      name: "Margherita Pizza",
      category: "Pizza",
      price: 12.99,
      unitsSold: 145,
    },
    {
      id: "2",
      name: "Caesar Salad",
      category: "Salad",
      price: 8.99,
      unitsSold: 120,
    },
    {
      id: "3",
      name: "Grilled Salmon",
      category: "Main Course",
      price: 18.99,
      unitsSold: 98,
    },
    {
      id: "4",
      name: "Chocolate Lava Cake",
      category: "Dessert",
      price: 7.99,
      unitsSold: 87,
    },
    {
      id: "5",
      name: "Garlic Bread",
      category: "Appetizer",
      price: 4.99,
      unitsSold: 76,
    },
  ]
}

export async function TopSellingItems() {
  const topSellingItems = await fetchTopSellingItems()

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-600">Top Selling Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topSellingItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-green-500">₦{item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{item.unitsSold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

