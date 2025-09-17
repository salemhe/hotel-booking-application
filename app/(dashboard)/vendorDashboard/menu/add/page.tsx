"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { MenuService } from "@/services/menu.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Save,
  Eye,
  ArrowLeft,
  Plus,
  X,
  Info,
  DollarSign,
  Package,
  ChefHat,
  ImageIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const menuSchema = z.object({
  dishName: z.string().min(1, "Dish name is required").max(100, "Dish name must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  category: z.string().min(1, "Category is required"),
  cuisineType: z.string().min(1, "Cuisine type is required"),
  price: z.number().min(1, "Price must be at least ₦1"),
  discountPrice: z.number().optional(),
  preparationTime: z.string().min(1, "Preparation time is required"),
  spiceLevel: z.string().min(1, "Spice level is required"),
  portionSize: z.string().min(1, "Portion size is required"),
  stockQuantity: z.number().min(0, "Stock quantity cannot be negative"),
  maxOrderPerCustomer: z.number().min(1, "Max order per customer must be at least 1"),
  isAvailable: z.boolean().default(true),
  isSpecial: z.boolean().default(false),
  dietaryInfo: z.array(z.string()).default([]),
  addOns: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
});

type MenuFormData = z.infer<typeof menuSchema>;

const categories = [
  "Appetizer", "Main Course", "Dessert", "Beverages", "Soup", "Salad", 
  "Side Dish", "Breakfast", "Lunch", "Dinner", "Snacks", "Seafood", "Vegetarian"
];

const cuisineTypes = [
  "Nigerian", "Italian", "Chinese", "American", "Mexican", "Indian", 
  "Japanese", "French", "Mediterranean", "Thai", "Korean", "Fast Food", "Continental"
];

const spiceLevels = ["Mild", "Medium", "Hot", "Very Hot", "No Spice"];
const portionSizes = ["Small", "Medium", "Large", "Extra Large", "Family Size"];
const preparationTimes = ["5-10 mins", "10-15 mins", "15-20 mins", "20-30 mins", "30-45 mins", "45+ mins"];

const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Halal", "Kosher", 
  "Low-Carb", "Keto", "Paleo", "Sugar-Free", "Organic"
];

const allergenOptions = [
  "Nuts", "Dairy", "Eggs", "Soy", "Wheat", "Fish", "Shellfish", "Sesame"
];

export default function AddMenuPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("basic");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      dishName: "",
      description: "",
      category: "",
      cuisineType: "",
      price: 0,
      preparationTime: "",
      spiceLevel: "",
      portionSize: "",
      stockQuantity: 0,
      maxOrderPerCustomer: 1,
      isAvailable: true,
      isSpecial: false,
      dietaryInfo: [],
      addOns: [],
      tags: [],
      allergens: [],
    },
    mode: "onChange"
  });

  const watchedData = watch();

  useEffect(() => {
    // Load draft from localStorage if exists
    const savedDraft = localStorage.getItem("menuFormDraft");
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft);
      reset(draftData);
      setIsDraft(true);
    }
  }, [reset]);

  useEffect(() => {
    // Auto-save draft every 30 seconds
    const interval = setInterval(() => {
      if (watchedData.dishName || watchedData.description) {
        localStorage.setItem("menuFormDraft", JSON.stringify(watchedData));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [watchedData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addArrayItem = (field: keyof MenuFormData, value: string) => {
    const currentArray = watchedData[field] as string[] || [];
    if (!currentArray.includes(value) && value.trim()) {
      setValue(field, [...currentArray, value.trim()] as string[]);
    }
  };

  const removeArrayItem = (field: keyof MenuFormData, index: number) => {
    const currentArray = watchedData[field] as string[] || [];
    setValue(field, currentArray.filter((_, i) => i !== index) as string[]);
  };

  const saveDraft = () => {
    localStorage.setItem("menuFormDraft", JSON.stringify(watchedData));
    toast.success("Draft saved successfully");
    setIsDraft(true);
  };

  const clearDraft = () => {
    localStorage.removeItem("menuFormDraft");
    reset();
    setIsDraft(false);
    setImageFile(null);
    setImagePreview(null);
    toast.success("Draft cleared");
  };

  const onSubmit = async (data: MenuFormData) => {
    setIsSubmitting(true);

    try {
      console.log("Submitting menu item with data:", data);

      // Create menu item using MenuService
      const createdMenuItem = await MenuService.createMenuItem(data, imageFile || undefined);

      console.log("Menu item created successfully:", createdMenuItem);

      // Clear draft after successful submission
      localStorage.removeItem("menuFormDraft");

      toast.success("Menu item added successfully!");
      router.push("/vendorDashboard/menu");
    } catch (error: unknown) {
      console.error("Error submitting menu:", error);

      // Show specific error message
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to add menu item";
      toast.error(errorMessage);

      // Log detailed error for debugging
      console.error("Server error details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ArrayInput = ({ 
    field, 
    placeholder, 
    suggestions = [] 
  }: { 
    field: keyof MenuFormData; 
    placeholder: string; 
    suggestions?: string[] 
  }) => {
    const [inputValue, setInputValue] = useState("");
    const currentArray = watchedData[field] as string[] || [];

    const handleAdd = () => {
      if (inputValue.trim()) {
        addArrayItem(field, inputValue);
        setInputValue("");
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdd();
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button type="button" onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {suggestions.filter(s => !currentArray.includes(s)).slice(0, 6).map((suggestion) => (
              <Badge 
                key={suggestion}
                variant="outline" 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => addArrayItem(field, suggestion)}
              >
                + {suggestion}
              </Badge>
            ))}
          </div>
        )}
        
        {currentArray.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {currentArray.map((item, index) => (
              <Badge key={index} className="flex items-center gap-1">
                {item}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeArrayItem(field, index)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/vendorDashboard/menu">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Add New Menu Item</h1>
            <p className="text-gray-600">Create a new dish for your restaurant menu</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isDraft && (
            <Button variant="outline" onClick={clearDraft}>
              Clear Draft
            </Button>
          )}
          <Button variant="outline" onClick={saveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      {isDraft && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            <span className="font-medium">Draft Loaded</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Your previously saved draft has been loaded. You can continue editing or clear it to start fresh.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing & Time
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Details & Options
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Media & Tags
            </TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the essential details about your dish
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dishName">Dish Name *</Label>
                    <Input
                      id="dishName"
                      {...register("dishName")}
                      placeholder="e.g., Jollof Rice with Chicken"
                    />
                    {errors.dishName && (
                      <p className="text-red-500 text-sm">{errors.dishName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <p className="text-red-500 text-sm">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisineType">Cuisine Type *</Label>
                  <Controller
                    name="cuisineType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine type" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineTypes.map((cuisine) => (
                            <SelectItem key={cuisine} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.cuisineType && (
                    <p className="text-red-500 text-sm">{errors.cuisineType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe your dish, its ingredients, and what makes it special..."
                    rows={4}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{errors.description?.message}</span>
                    <span>{watchedData.description?.length || 0}/500</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isAvailable"
                      control={control}
                      render={({ field }) => (
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label>Available for orders</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isSpecial"
                      control={control}
                      render={({ field }) => (
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label>Mark as special dish</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing & Time */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Preparation</CardTitle>
                <CardDescription>
                  Set prices and preparation details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦) *</Label>
                    <Input
                      id="price"
                      type="number"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">{errors.price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Discount Price (₦)</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      {...register("discountPrice", { valueAsNumber: true })}
                      placeholder="Optional discount price"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="preparationTime">Preparation Time *</Label>
                    <Controller
                      name="preparationTime"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {preparationTimes.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.preparationTime && (
                      <p className="text-red-500 text-sm">{errors.preparationTime.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spiceLevel">Spice Level *</Label>
                    <Controller
                      name="spiceLevel"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select spice level" />
                          </SelectTrigger>
                          <SelectContent>
                            {spiceLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.spiceLevel && (
                      <p className="text-red-500 text-sm">{errors.spiceLevel.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portionSize">Portion Size *</Label>
                    <Controller
                      name="portionSize"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select portion" />
                          </SelectTrigger>
                          <SelectContent>
                            {portionSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.portionSize && (
                      <p className="text-red-500 text-sm">{errors.portionSize.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      {...register("stockQuantity", { valueAsNumber: true })}
                      placeholder="0 for unlimited"
                    />
                    {errors.stockQuantity && (
                      <p className="text-red-500 text-sm">{errors.stockQuantity.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxOrderPerCustomer">Max Order Per Customer</Label>
                    <Input
                      id="maxOrderPerCustomer"
                      type="number"
                      {...register("maxOrderPerCustomer", { valueAsNumber: true })}
                      placeholder="1"
                    />
                    {errors.maxOrderPerCustomer && (
                      <p className="text-red-500 text-sm">{errors.maxOrderPerCustomer.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details & Options */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>
                  Add dietary information, allergens, and add-ons
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Dietary Information</Label>
                    <p className="text-sm text-gray-600 mb-2">
                      Add dietary labels that apply to this dish
                    </p>
                    <ArrayInput 
                      field="dietaryInfo" 
                      placeholder="e.g., Vegetarian, Gluten-Free"
                      suggestions={dietaryOptions}
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label>Allergen Information</Label>
                    <p className="text-sm text-gray-600 mb-2">
                      List allergens present in this dish
                    </p>
                    <ArrayInput 
                      field="allergens" 
                      placeholder="e.g., Nuts, Dairy, Eggs"
                      suggestions={allergenOptions}
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label>Add-ons & Extras</Label>
                    <p className="text-sm text-gray-600 mb-2">
                      Optional extras customers can add to this dish
                    </p>
                    <ArrayInput 
                      field="addOns" 
                      placeholder="e.g., Extra Cheese, Extra Sauce"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media & Tags */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media & Tags</CardTitle>
                <CardDescription>
                  Upload images and add search tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Dish Image</Label>
                  <div className="mt-2">
                    {imagePreview ? (
                      <div className="relative w-full max-w-md mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={400}
                          height={300}
                          className="rounded-lg object-cover w-full h-64"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload dish image</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Search Tags</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Add tags to help customers find this dish easily
                  </p>
                  <ArrayInput 
                    field="tags" 
                    placeholder="e.g., spicy, popular, quick"
                  />
                </div>

                <Separator />

                {/* Preview Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Preview
                  </h3>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {watchedData.dishName || "Dish Name"}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {watchedData.description || "Dish description will appear here..."}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-green-600">
                            ₦{watchedData.price?.toLocaleString() || "0"}
                          </span>
                          <Badge variant="outline">
                            {watchedData.category || "Category"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !isValid}
            className="min-w-32"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
