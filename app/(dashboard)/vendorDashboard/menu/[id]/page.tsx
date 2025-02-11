import { MenuUpdateForm } from "@/components/MenuUpdateForm";

export default function AddMenuButton() {
    const formData = {
      id: 1,
      dishName: "Jollof Rice & Chicken",
      cuisineType: "nigerian",
      image: "/hero-bg.jpg",
      category: "mainCourse",
      price: 1500,
      discountPrice: 1200,
      preparationTime: "30min",
      stockQuantity: 10,
      maxOrderPerCustomer: 2,
      portionSize: "small",
      spiceLevel: "mild",
      addOns: ["Extra Cheese", "Extra Chicken", "Extra Sauce"],
      dietaryInfo: ["Vegetarian", "Gluten Free"],
      };

  return (
    <div className="flex items-center justify-center w-full container mx-auto my-10 px-4">
      <MenuUpdateForm formData={formData} />
    </div>
  )
}

