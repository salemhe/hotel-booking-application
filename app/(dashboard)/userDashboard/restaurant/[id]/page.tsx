"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Card, CardContent } from '@/app/components/sammys-ui/card';
import { Badge } from '@/app/components/sammys-ui/badge';

// Simulate fetching menus from the super admin (shared state or backend)
const fetchMenus = () => {
  if (typeof window !== 'undefined') {
    // Try to get from localStorage (simulate real-time update)
    const menus = localStorage.getItem('superAdminMenus');
    if (menus) return JSON.parse(menus);
  }
  // Fallback to static
  return [
    {
      id: 1,
      name: "Joe's Platter",
      price: 425000,
      type: "A la Carte",
      mealTimes: ["Lunch", "Dinner"],
      items: 6,
      tags: ["Grill order", "Sweet", "Savory"],
      status: true,
      image: "/placeholder.svg?height=40&width=40",
    },
  ];
};

interface Menu {
  id: string | number;
  name: string;
  price: number;
  type: string;
  mealTimes: string[];
  items: number;
  tags: string[];
  status: boolean;
  image?: string;
}

const UserRestaurantMenuPage = () => {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    setMenus(fetchMenus());
    // Listen for changes (simulate real-time)
    const handler = () => setMenus(fetchMenus());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Available Menus</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
        {menus.map((menu, i) => (
          <Card key={menu.id || i} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={menu.image || "/placeholder.svg"}
                alt={menu.name}
                className="w-full h-32 object-cover"
                width={300}
                height={128}
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{menu.name}</h3>
              <div className="mb-2 text-gray-600">Type: {menu.type}</div>
              <div className="mb-2 text-gray-600">Price: ₦{menu.price?.toLocaleString()}</div>
              <div className="mb-2 text-gray-600">Meal Times: {Array.isArray(menu.mealTimes) ? menu.mealTimes.join(', ') : ''}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {menu.tags?.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs text-black">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-500">Status: {menu.status ? 'Active' : 'Inactive'}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserRestaurantMenuPage;
