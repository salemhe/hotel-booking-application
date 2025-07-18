"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, X, Plus, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { useRouter } from "next/navigation";

interface MenuItemForm {
  name: string;
  description: string;
  price: string;
  category: string;
  images: File[];
  ingredients: string[];
  allergens: string[];
  dietary: string[];
  preparationTime: string;
  status: "available" | "unavailable";
  isSpecialOffer: boolean;
  originalPrice: string;
}

export default function AddMenuItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<MenuItemForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    ingredients: [],
    allergens: [],
    dietary: [],
    preparationTime: "",
    status: "available",
    isSpecialOffer: false,
    originalPrice: "",
  });

  const [newIngredient, setNewIngredient] = useState("");
  const [newAllergen, setNewAllergen] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const categories = [
    "Starters",
    "Main Course",
    "Desserts",
    "Beverages",
    "Appetizers",
    "Salads",
    "Soups",
  ];

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Halal",
    "Kosher",
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, 4), // Max 4 images
      }));

      // Create preview URLs
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]); // Clean up URL
      return prev.filter((_, i) => i !== index);
    });
  };

  const addIngredient = () => {
    if (
      newIngredient.trim() &&
      !formData.ingredients.includes(newIngredient.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }));
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((item) => item !== ingredient),
    }));
  };

  const addAllergen = () => {
    if (
      newAllergen.trim() &&
      !formData.allergens.includes(newAllergen.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()],
      }));
      setNewAllergen("");
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.filter((item) => item !== allergen),
    }));
  };

  const toggleDietary = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter((item) => item !== option)
        : [...prev.dietary, option],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form data:", formData);
    router.push("/vendorDashboard/menu");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Menu Item
          </h1>
          <p className="text-gray-600">
            Create a new item for your restaurant menu
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your menu item"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category.toLowerCase().replace(" ", "-")}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preparation Time (minutes)
                    </label>
                    <Input
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preparationTime: e.target.value,
                        }))
                      }
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="special-offer"
                    checked={formData.isSpecialOffer}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isSpecialOffer: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label
                    htmlFor="special-offer"
                    className="text-sm font-medium"
                  >
                    This is a special offer
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₦) *
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="0"
                      required
                    />
                  </div>

                  {formData.isSpecialOffer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price (₦)
                      </label>
                      <Input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            originalPrice: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {previewUrls.length < 4 && (
                      <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <Upload className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">
                          Upload Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload up to 4 images. First image will be the main display
                    image.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients & Allergens */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients & Allergens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      placeholder="Add ingredient"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addIngredient())
                      }
                    />
                    <Button type="button" onClick={addIngredient} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.ingredients.map((ingredient) => (
                      <Badge
                        key={ingredient}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {ingredient}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeIngredient(ingredient)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergens
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newAllergen}
                      onChange={(e) => setNewAllergen(e.target.value)}
                      placeholder="Add allergen"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addAllergen())
                      }
                    />
                    <Button type="button" onClick={addAllergen} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.allergens.map((allergen) => (
                      <Badge
                        key={allergen}
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        {allergen}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeAllergen(allergen)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Information
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dietaryOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={option}
                          checked={formData.dietary.includes(option)}
                          onChange={() => toggleDietary(option)}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label htmlFor={option} className="text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="available"
                      name="status"
                      value="available"
                      checked={formData.status === "available"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as "available",
                        }))
                      }
                    />
                    <label htmlFor="available" className="text-sm">
                      Available
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="unavailable"
                      name="status"
                      value="unavailable"
                      checked={formData.status === "unavailable"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as "unavailable",
                        }))
                      }
                    />
                    <label htmlFor="unavailable" className="text-sm">
                      Unavailable
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {previewUrls[0] && (
                    <img
                      src={previewUrls[0]}
                      alt="Main preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {formData.name || "Item Name"}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {formData.description || "Item description"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {formData.isSpecialOffer && formData.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₦{parseInt(formData.originalPrice).toLocaleString()}
                        </span>
                      )}
                      <span className="font-bold">
                        ���
                        {formData.price
                          ? parseInt(formData.price).toLocaleString()
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Add Menu Item
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
