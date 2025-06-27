"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import Image from "next/image"

const schema = z.object({
  dishName: z.string().min(1, "Dish name is required"),
  category: z.string().min(1, "Category is required"),
  cuisineType: z.string().min(1, "Cuisine type is required"),
  description: z.string().min(1, "Description is required"),
  itemImage: z.any().optional(),
  itemName: z.any().optional(),
});

type BasicInfoProps = {
  onNext: (data: z.infer<typeof schema>) => void;
  initialData: Partial<z.infer<typeof schema>>;
};

export function BasicInfo({ onNext, initialData }: BasicInfoProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData.itemImage || null
  );
  const [image, setImage] = useState<File | null>(
    initialData.itemImage || null
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dishName: initialData.dishName ?? "", // Ensure it's always a string
      category: initialData.category ?? "",
      cuisineType: initialData.cuisineType ?? "",
      itemImage: initialData.itemImage ?? null, // Default to null for optional fields
      description: initialData.description ?? "",
      itemName: "", 
    },
  });

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    }
  }, [image])

  const onSubmit = (data: z.infer<typeof schema>) => {
    onNext({ ...data, itemImage: image });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Ensure file is a JPG
    if (file.type !== "image/jpeg") {
      alert("Only JPG images are allowed.");
      return;
    }
  
    setImage(file);
  };
  
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="dishName">Dish Name</Label>
        <Input
          id="dishName"
          {...register("dishName")}
          placeholder="Enter Dish name"
        />
        {errors.dishName && (
          <p className="text-red-500 text-sm mt-1">{errors.dishName.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Appetizer">Appetizer</SelectItem>
                <SelectItem value="Main Course">Main Course</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Drinks">Drinks</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="cuisineType">Cuisine Type</Label>
        <Controller
          name="cuisineType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nigerian">Nigerian</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="fastFood">Fast Food</SelectItem>
                <SelectItem value="continental">Continental</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.cuisineType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.cuisineType.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea placeholder="Enter description" id="description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="image">Image Upload</Label>
        <div
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                width={200}
                height={200}
                className="mx-auto h-32 w-32 object-cover rounded-md"
              />
            ) : (
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-hidden focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>{imagePreview ? "Change image" : "Upload an image"}</span>
                <input
                  id="image-upload"
                  name="image-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
          </div>
        </div>
      </div>
      <Button type="submit">Next</Button>
    </form>
  );
}
