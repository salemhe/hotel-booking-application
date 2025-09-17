"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetcher } from "@/lib/fetcher";

export default function AddMenuPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "main-dish",
    status: "available",
    menuType: "A la Carte",
    mealTimes: "Lunch",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetcher("/api/vendor/menus", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          mealTimes: form.mealTimes.split(",").map((s) => s.trim()),
          tags: form.tags.split(",").map((s) => s.trim()),
        }),
      });
      if (!res || res.error || res.status === false) throw new Error("Failed to add menu");
      router.push("/vendor-dashboard/restaurant/menu");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error adding menu");
      } else {
        setError("Error adding menu");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Add New Menu</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" placeholder="Menu Name" value={form.name} onChange={handleChange} required />
            <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            <Input name="price" type="number" placeholder="Price (₦)" value={form.price} onChange={handleChange} required />
            <Input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
            <Input name="category" placeholder="Category (e.g. main-dish)" value={form.category} onChange={handleChange} required />
            <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <Input name="menuType" placeholder="Menu Type (e.g. A la Carte)" value={form.menuType} onChange={handleChange} required />
            <Input name="mealTimes" placeholder="Meal Times (comma separated)" value={form.mealTimes} onChange={handleChange} required />
            <Input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-2">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white" disabled={loading}>
                {loading ? "Adding..." : "Add Menu"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
