import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

type Menu = {
  _id: string;
  vendor: string;
  dishName: string;
  description: string;
  price: number;
  category: string;
  dishImage: string;
  itemImage: string;
  itemName: string;
};

interface ItemSelectorProps {
  onSelectionChange: (selected: Menu[], foods: string[]) => void;
  items?: Menu[];
}

export default function ItemSelector({
  onSelectionChange,
  items,
}: ItemSelectorProps) {
  const [selectedItems, setSelectedItems] = useState<Menu[]>([]);

  // Update parent whenever selection changes
  useEffect(() => {
    const foodNames = selectedItems.map((item) => {
      return item.dishName || item.itemName || "Item";
    });
    onSelectionChange(selectedItems, foodNames);
  }, [selectedItems, onSelectionChange]);

  const toggleSelection = (item: Menu) => {
    setSelectedItems(
      (prev) =>
        prev.includes(item)
          ? prev.filter((i) => i !== item) // Remove if already selected
          : [...prev, item] // Add if not selected
    );
  };

  const removeItem = (item: Menu) => {
    setSelectedItems((prev) => prev.filter((i) => i._id !== item._id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <ScrollArea className="h-72 rounded-md">
        <div className="grid gap-2">
          {items &&
            items.length > 0 &&
            items.map((item) => (
              <Button
                type="button"
                key={item._id}
                variant={selectedItems.includes(item) ? "default" : "outline"}
                onClick={() => toggleSelection(item)}
                
              >
                {item.dishName || item.itemName || "Item"} - ₦
                {item.price.toLocaleString() || "N/A"}
              </Button>
            ))}
        </div>
      </ScrollArea>

      {/* Selection Buttons */}

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <Card className="border border-gray-500 shadow-lg">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Selected Items:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <Badge
                  key={item._id}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800"
                >
                  {item.dishName || item.itemName || "Item"} - ₦
                  {item.price.toLocaleString() || "N/A"}
                  <X
                    className="w-4 h-4 cursor-pointer hover:text-red-600"
                    onClick={() => removeItem(item)}
                  />
                </Badge>
              ))}
            </div>
            <Button
              type="button"
              variant="destructive"
              className="mt-3 w-full"
              onClick={clearSelection}
            >
              Clear All
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
