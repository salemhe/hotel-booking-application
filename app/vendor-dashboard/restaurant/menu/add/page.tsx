"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetcher } from '@/app/lib/fetcher';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { X, Plus, Upload } from "lucide-react";
import Image from "next/image";

interface CreateMenuRequest {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: "available" | "unavailable";
  menuType: string;
  mealTimes: string[];
  tags: string[];
  restaurantId: string;
}

export default function AddMenuPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState<CreateMenuRequest>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'main-dish',
    status: 'available',
    menuType: 'A la Carte',
    mealTimes: ['Lunch'],
    tags: [],
    restaurantId: ''
  });

  const [newTag, setNewTag] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Get restaurant ID from localStorage
  useEffect(() => {
    const getRestaurantId = () => {
      if (typeof window !== 'undefined') {
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          const profile = JSON.parse(userProfile);
          return profile.restaurantId || profile.businessId;
        }
      }
      return '';
    };
    
    setForm(prev => ({ ...prev, restaurantId: getRestaurantId() }));
  }, []);

  const categories = [
    { value: "starters", label: "Starters" },
    { value: "main-dish", label: "Main Dish" },
    { value: "desserts", label: "Desserts" },
    { value: "beverages", label: "Drinks" },
    { value: "sides", label: "Sides" },
  ];

  const menuTypes = ["A la Carte", "Buffet", "Set Menu", "Tasting Menu"];
  const mealTimeOptions = ["Breakfast", "Lunch", "Dinner", "Brunch", "All Day", "Late Night"];
  const availableTags = ["Popular", "Spicy", "Vegetarian", "Vegan", "Gluten-Free", "Healthy", "Kids Menu"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMealTimeChange = (mealTime: string) => {
    setForm(prev => ({
      ...prev,
      mealTimes: prev.mealTimes.includes(mealTime)
        ? prev.mealTimes.filter(mt => mt !== mealTime)
        : [...prev.mealTimes, mealTime]
    }));
  };

  const handleAddTag = () => {
    if (newTag && !form.tags.includes(newTag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm(prev => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiFetcher('/api/restaurant/menu', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (response?.id) {
        // Emit WebSocket event for real-time update
        if (typeof window !== 'undefined') {
          const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_ENDPOINT || 'ws://localhost:3001'}/restaurant-menu`);
          ws.onopen = () => {
            ws.send(JSON.stringify({
              type: 'menu_created',
              data: response
            }));
            ws.close();
          };
        }
        
        router.push('/vendor-dashboard/restaurant/menu');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Menu Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <Label htmlFor="name">Menu Item Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Signature Burger"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Add a short description..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="pl-8"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Menu Image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
                      height={150}
                      className="mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview('');
                        setForm(prev => ({ ...prev, image: '' }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload menu image</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF • Max 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Categorization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Categorization</h3>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="menuType">Menu Type *</Label>
                <Select
                  value={form.menuType}
                  onValueChange={(value) => handleSelectChange('menuType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select menu type" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Meal Times</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {mealTimeOptions.map(mealTime => (
                    <label key={mealTime} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.mealTimes.includes(mealTime)}
                        onChange={() => handleMealTimeChange(mealTime)}
                        className="rounded"
                      />
                      <span className="text-sm">{mealTime}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tags</h3>
              
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add custom tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={form.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        tags: prev.tags.includes(tag)
                          ? prev.tags.filter(t => t !== tag)
                          : [...prev.tags, tag]
                      }));
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status</h3>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={form.status === 'available'}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, status: checked ? 'available' : 'unavailable' }))}
                />
                <Label>{form.status === 'available' ? 'Available' : 'Unavailable'}</Label>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
                {loading ? 'Creating...' : 'Create Menu Item'}
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
