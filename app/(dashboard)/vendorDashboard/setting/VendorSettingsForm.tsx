"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { apiFetcher } from "@/app/lib/fetcher";

export default function VendorSettingsForm() {
  const [formData, setFormData] = useState({
    openingTime: "",
    closingTime: "",
    location: "",
    cuisine: "",
    priceRange: "",
    images: [] as File[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: Array.from(e.target.files as FileList) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("openingTime", formData.openingTime);
    form.append("closingTime", formData.closingTime);
    form.append("location", formData.location);
    form.append("cuisine", formData.cuisine);
    form.append("priceRange", formData.priceRange);
    formData.images.forEach((file) => form.append("images", file));

    try {
      await apiFetcher("/api/restaurant/update", {
        method: "POST",
        body: form,
      });
      toast.success("Restaurant info updated successfully!");
    } catch (error) {
      console.error(error)
      toast.error("Failed to upload data")
      alert("Error uploading data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Opening Time</Label>
          <Input type="time" name="openingTime" onChange={handleChange} required />
        </div>
        <div>
          <Label>Closing Time</Label>
          <Input type="time" name="closingTime" onChange={handleChange} required />
        </div>
      </div>

      <div>
        <Label>Location</Label>
        <Input type="text" name="location" onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Cuisine</Label>
          <Input type="text" name="cuisine" onChange={handleChange} required />
        </div>
        <div>
          <Label>Price Range</Label>
          <Input type="text" name="priceRange" onChange={handleChange} required />
        </div>
      </div>

      <div>
        <Label>Upload Images</Label>
        <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
      </div>

      <Button type="submit" className="w-full">Update Info</Button>
    </form>
  );
}
