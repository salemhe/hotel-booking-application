"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
type CategoryFilterProps = {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full min-w-max cursor-pointer ${
            activeCategory === category
              ? "bg-[#0A6C6D] text-white"
              : "bg-transparent text-gray-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
type MenuItemCardProps = {
  type: string;
  name: string;
  price: number;
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ type, name, price }) => {
  return (
    <div className="bg-white p-6 rounded-xl border w-full max-w-sm flex flex-col justify-between">
      <div>
        <p className="font-semibold uppercase text-gray-500 mb-2">
          {type}
        </p>
        <h3 className="font-bold text-gray-800">{name}</h3>
      </div>
      <p className="font-semibold text-gray-900 mt-4">
        #{price.toLocaleString()}
      </p>
    </div>
  );
};

// pages/index.js (or a dedicated menu page)

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [itemsToShow, setItemsToShow] = useState(3);
  const LOAD_MORE_STEP = 3;

  const menuItems = [
    {
      id: 1,
      category: "Main Course",
      name: "Grilled Lamb Kofta with Couscous",
      price: 15000,
    },
    {
      id: 2,
      category: "Desserts",
      name: "Turkish Delight Trio",
      price: 3500,
    },
    {
      id: 3,
      category: "Drinks",
      name: "Pomegranate Fizz",
      price: 3000,
    },
    {
      id: 4,
      category: "Main Course",
      name: "Spicy Chicken Tagine",
      price: 16000,
    },
    {
      id: 5,
      category: "Appetizers",
      name: "Hummus with Pita Bread",
      price: 4000,
    },
    {
      id: 6,
      category: "Desserts",
      name: "Baklava Assortment",
      price: 5000,
    },
    {
      id: 7,
      category: "Main Course",
      name: "Vegetable Couscous",
      price: 14000,
    },
    {
      id: 8,
      category: "Drinks",
      name: "Mint Lemonade",
      price: 2500,
    },
  ];

  const categories = ["All", "Main Course", "Appetizers", "Desserts", "Drinks"];
  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  // Determine which items to actually display based on `itemsToShow`
  const displayedItems = filteredItems.slice(0, itemsToShow);

  // Check if there are more items than currently displayed
  const hasMore = filteredItems.length > itemsToShow;

  const handleShowMore = () => {
    // Increase the number of items to show, but don't exceed the total filtered items
    setItemsToShow((prev) =>
      Math.min(prev + LOAD_MORE_STEP, filteredItems.length)
    );
  };

  // Reset itemsToShow when the category changes
  interface HandleCategoryChange {
    (category: string): void;
  }

  const handleCategoryChange: HandleCategoryChange = (category) => {
    setActiveCategory(category);
    setItemsToShow(3); // Reset to initial display count when category changes
  };

  return (
    <div className="">
      <div className="w-full">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange} // Use the new handler
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {displayedItems.map((item) => (
          <MenuItemCard
            key={item.id}
            type={item.category}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

      {hasMore && ( // Conditionally render the "Show more" button
        <div className="mt-8">
          <button
            onClick={handleShowMore}
            className="text-[#0A6C6D] hover:underline flex items-center gap-2"
          >
            Show more <ChevronDown className="
            h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
