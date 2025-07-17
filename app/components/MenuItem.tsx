import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, Eye, Clock, Package, Star } from "lucide-react";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface MenuItemType {
  _id: string;
  vendor: string;
  dishName: string;
  description: string;
  price: number;
  category: string;
  itemImage: string;
  cuisineType?: string;
  availabilityStatus?: boolean;
  preparationTime?: string;
  stockQuantity?: number;
  discountPrice?: number;
}

interface MenuItemProps {
  data: MenuItemType;
  onDelete?: (itemId: string) => void;
  viewMode?: "grid" | "list";
}

const MenuItem = ({ data, onDelete, viewMode = "grid" }: MenuItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    _id,
    dishName,
    itemImage,
    category,
    price,
    description,
    cuisineType,
    availabilityStatus = true,
    preparationTime,
    stockQuantity,
    discountPrice,
  } = data;

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(_id);
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const imageUrl = imageError ? "/hero-bg.jpg" : itemImage || "/hero-bg.jpg";
  const hasDiscount = discountPrice && discountPrice < price;
  const isOutOfStock = stockQuantity !== undefined && stockQuantity <= 0;

  if (viewMode === "list") {
    return (
      <Card
        className={`w-full transition-all hover:shadow-md ${!availabilityStatus ? "opacity-75" : ""}`}
      >
        <div className="flex p-4">
          {/* Image Section */}
          <div className="relative w-24 h-24 flex-shrink-0 mr-4">
            <Image
              src={imageUrl}
              fill
              className="rounded-lg object-cover"
              alt={dishName || "Menu Item"}
              onError={() => setImageError(true)}
            />
            {!availabilityStatus && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  Unavailable
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {dishName}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {description}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{category}</Badge>
                  {cuisineType && (
                    <Badge variant="outline">{cuisineType}</Badge>
                  )}
                  {preparationTime && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      {preparationTime}min
                    </Badge>
                  )}
                  {stockQuantity !== undefined && (
                    <Badge
                      variant={isOutOfStock ? "destructive" : "outline"}
                      className="flex items-center gap-1"
                    >
                      <Package className="w-3 h-3" />
                      {stockQuantity} left
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-lg font-bold text-green-600">
                        ₦{discountPrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₦{price}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((price - discountPrice!) / price) * 100)}%
                        OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-indigo-600">
                      ₦{price}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                <Link href={`menu/${_id}`}>
                  <Button size="sm" variant="outline">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{dishName}"? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card
      className={`w-full max-w-sm bg-white/80 backdrop-blur-lg shadow-xl overflow-hidden transform transition-all hover:shadow-2xl hover:scale-[1.02] border border-gray-200 ${!availabilityStatus ? "opacity-75" : ""}`}
    >
      <CardHeader className="p-0">
        {/* Image Section with Gradient Overlay */}
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={imageUrl}
            fill
            className="object-cover transition-transform hover:scale-105"
            alt={dishName || "Menu Item"}
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

          {/* Status Overlays */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {!availabilityStatus && (
              <Badge variant="destructive">Unavailable</Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                {Math.round(((price - discountPrice!) / price) * 100)}% OFF
              </Badge>
            )}
            {isOutOfStock && <Badge variant="secondary">Out of Stock</Badge>}
          </div>

          {/* Quick Info */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            {preparationTime && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {preparationTime}min
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Content Section */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 truncate">
              {dishName}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            {cuisineType && (
              <Badge variant="outline" className="text-xs">
                {cuisineType}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-xl font-bold text-green-600">
                    ₦{discountPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₦{price}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-indigo-600">
                  ₦{price}
                </span>
              )}
            </div>

            {stockQuantity !== undefined && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Stock</p>
                <p
                  className={`text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}
                >
                  {stockQuantity}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Action Buttons */}
        <div className="flex justify-between items-center w-full gap-2">
          <Link href={`menu/${_id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="hover:scale-110 transition-all"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{dishName}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MenuItem;
